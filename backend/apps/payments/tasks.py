"""Celery tasks for payment polling and confirmation."""
import logging

import httpx
from celery import shared_task
from django.conf import settings
from django.utils import timezone

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=10, default_retry_delay=60)
def check_nowpayments_status(self, payment_id: int):
    """
    Poll the NowPayments API for a payment's status.

    On confirmation: mark the payment CONFIRMED, the order PAID, and trigger
    delivery. Otherwise retry up to 10 times with a 60s delay.
    """
    from apps.orders.models import Order

    from .models import Payment

    try:
        payment = Payment.objects.select_related("order").get(id=payment_id)
    except Payment.DoesNotExist:
        logger.error("check_nowpayments_status: payment %s not found", payment_id)
        return

    if payment.status == Payment.Status.CONFIRMED:
        return  # already done

    if not payment.gateway_payment_id or not settings.NOWPAYMENTS_API_KEY:
        return

    headers = {"x-api-key": settings.NOWPAYMENTS_API_KEY}
    try:
        resp = httpx.get(
            f"{settings.NOWPAYMENTS_API_URL}/payment/{payment.gateway_payment_id}",
            headers=headers,
            timeout=30,
        )
        resp.raise_for_status()
        data = resp.json()
    except httpx.HTTPError as exc:
        logger.warning("NowPayments poll failed for %s: %s", payment_id, exc)
        raise self.retry(exc=exc)

    payment.raw_response = data
    status = data.get("payment_status", "")

    if status in ("finished", "confirmed"):
        payment.status = Payment.Status.CONFIRMED
        payment.confirmed_at = timezone.now()
        payment.save()

        order = payment.order
        if order.status == Order.Status.PENDING:
            order.status = Order.Status.PAID
            order.save(update_fields=["status", "updated_at"])
            from apps.orders.tasks import deliver_premium_order

            deliver_premium_order.delay(order.id)
        logger.info("Payment %s confirmed; delivery triggered", payment_id)
        return

    if status in ("failed", "refunded", "expired"):
        payment.status = Payment.Status.FAILED
        payment.save()
        logger.info("Payment %s marked FAILED (%s)", payment_id, status)
        return

    # Still pending — save and retry
    payment.save(update_fields=["raw_response"])
    raise self.retry()

"""Celery tasks for order lifecycle management."""
import logging
from datetime import timedelta

from celery import shared_task
from django.utils import timezone

logger = logging.getLogger(__name__)


def _notify_user(telegram_id: int, text: str) -> None:
    """Send a Telegram message to a user via the Bot API (best-effort)."""
    from django.conf import settings

    if not settings.BOT_TOKEN:
        logger.warning("BOT_TOKEN not configured; skipping user notification.")
        return
    try:
        import httpx

        httpx.post(
            f"https://api.telegram.org/bot{settings.BOT_TOKEN}/sendMessage",
            json={"chat_id": telegram_id, "text": text, "parse_mode": "HTML"},
            timeout=10,
        )
    except Exception as exc:  # noqa: BLE001
        logger.error("Failed to notify user %s: %s", telegram_id, exc)


def _notify_admins(text: str) -> None:
    from django.conf import settings

    for admin_id in settings.ADMIN_TELEGRAM_IDS:
        _notify_user(admin_id, text)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def deliver_premium_order(self, order_id: int):
    """
    Move an order through PROCESSING and attempt premium delivery.

    For the MVP delivery is manual: we flag the order PROCESSING and notify the
    admins so they can fulfil it. Admins then update the status to DELIVERED.
    """
    from .models import Order

    try:
        order = Order.objects.select_related("user", "product").get(id=order_id)
    except Order.DoesNotExist:
        logger.error("deliver_premium_order: order %s not found", order_id)
        return

    if order.status in (Order.Status.DELIVERED, Order.Status.FAILED):
        logger.info("Order %s already finalized (%s)", order_id, order.status)
        return

    order.status = Order.Status.PROCESSING
    order.save(update_fields=["status", "updated_at"])

    # MVP: hand off to admins for manual delivery
    _notify_admins(
        "🔔 <b>سفارش جدید برای تحویل</b>\n"
        f"کد رهگیری: <code>{order.tracking_code}</code>\n"
        f"محصول: {order.product.name}\n"
        f"گیرنده: @{order.recipient_username}\n"
        f"مبلغ: {int(order.amount_toman):,} تومان"
    )

    _notify_user(
        order.user.telegram_id,
        "✅ پرداخت شما تأیید شد و سفارش در حال پردازش است.\n"
        f"کد رهگیری: <code>{order.tracking_code}</code>",
    )

    logger.info("Order %s set to PROCESSING and admins notified", order_id)


@shared_task
def check_pending_orders():
    """Fail orders that have been PENDING for more than 30 minutes."""
    from .models import Order

    threshold = timezone.now() - timedelta(minutes=30)
    stale = Order.objects.filter(
        status=Order.Status.PENDING, created_at__lt=threshold
    )
    count = 0
    for order in stale.select_related("user"):
        order.status = Order.Status.FAILED
        order.notes = (order.notes or "") + "\nAuto-failed: payment timeout."
        order.save(update_fields=["status", "notes", "updated_at"])
        _notify_user(
            order.user.telegram_id,
            "⌛️ مهلت پرداخت سفارش به پایان رسید و سفارش لغو شد.\n"
            f"کد رهگیری: <code>{order.tracking_code}</code>",
        )
        count += 1
    logger.info("check_pending_orders: failed %s stale orders", count)
    return count

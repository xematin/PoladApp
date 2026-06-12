import logging

import httpx
from django.conf import settings
from django.http import HttpRequest, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from ninja import Router

from apps.orders.models import Order
from core.utils import verify_nowpayments_ipn

from .models import Payment
from .schemas import (
    CardReceiptIn,
    ErrorOut,
    GenericOut,
    NowPaymentsCreateIn,
    NowPaymentsCreateOut,
)

logger = logging.getLogger(__name__)
router = Router()


@router.post(
    "/nowpayments/create/",
    response={200: NowPaymentsCreateOut, 400: ErrorOut, 404: ErrorOut},
)
def create_nowpayments_invoice(request, payload: NowPaymentsCreateIn):
    """Create a NowPayments invoice for the given order."""
    order = Order.objects.select_related("user").filter(id=payload.order_id).first()
    if order is None:
        return 404, {"detail": "Order not found."}
    if order.status not in (Order.Status.PENDING,):
        return 400, {"detail": "Order is not payable."}
    if not settings.NOWPAYMENTS_API_KEY:
        return 400, {"detail": "Payment gateway is not configured."}

    body = {
        "price_amount": float(order.amount_toman),
        "price_currency": "irr",
        "pay_currency": "usdttrc20",
        "order_id": order.tracking_code,
        "order_description": f"PoladApp order {order.tracking_code}",
        "ipn_callback_url": f"{settings.MINI_APP_URL}/api/v1/payments/nowpayments/webhook/",
    }
    headers = {
        "x-api-key": settings.NOWPAYMENTS_API_KEY,
        "Content-Type": "application/json",
    }

    try:
        resp = httpx.post(
            f"{settings.NOWPAYMENTS_API_URL}/payment",
            json=body,
            headers=headers,
            timeout=30,
        )
        resp.raise_for_status()
        data = resp.json()
    except httpx.HTTPError as exc:
        logger.error("NowPayments create failed: %s", exc)
        return 400, {"detail": "Failed to create payment invoice."}

    payment, _ = Payment.objects.update_or_create(
        order=order,
        defaults={
            "gateway": Payment.Gateway.NOWPAYMENTS,
            "gateway_payment_id": str(data.get("payment_id", "")),
            "amount_crypto": data.get("pay_amount"),
            "crypto_currency": data.get("pay_currency"),
            "status": Payment.Status.PENDING,
            "raw_response": data,
        },
    )

    # Kick off polling as a fallback to the IPN webhook
    from .tasks import check_nowpayments_status

    check_nowpayments_status.apply_async(
        args=[payment.id], countdown=60
    )

    return 200, {
        "payment_id": str(data.get("payment_id", "")),
        "pay_address": data.get("pay_address"),
        "pay_amount": data.get("pay_amount"),
        "pay_currency": data.get("pay_currency"),
        "invoice_url": data.get("invoice_url"),
        "status": data.get("payment_status", "waiting"),
    }


@router.post("/card/submit/", response={200: GenericOut, 404: ErrorOut})
def submit_card_receipt(request, payload: CardReceiptIn):
    """Record a card-to-card receipt; awaits manual admin confirmation."""
    order = Order.objects.filter(id=payload.order_id).first()
    if order is None:
        return 404, {"detail": "Order not found."}

    Payment.objects.update_or_create(
        order=order,
        defaults={
            "gateway": Payment.Gateway.CARD,
            "gateway_payment_id": payload.receipt_reference,
            "status": Payment.Status.PENDING,
            "raw_response": {"note": payload.note},
        },
    )
    order.payment_method = Order.PaymentMethod.CARD
    order.notes = (order.notes or "") + f"\nCard receipt: {payload.receipt_reference}"
    order.save(update_fields=["payment_method", "notes", "updated_at"])

    # Notify admins for manual verification
    from apps.orders.tasks import _notify_admins

    _notify_admins(
        "🧾 <b>رسید کارت‌به‌کارت جدید</b>\n"
        f"کد رهگیری: <code>{order.tracking_code}</code>\n"
        f"شناسه تراکنش: <code>{payload.receipt_reference}</code>\n"
        f"مبلغ: {int(order.amount_toman):,} تومان"
    )

    return 200, {"detail": "Receipt submitted; awaiting confirmation.", "status": "PENDING"}


# NowPayments IPN webhook — verify signature manually (raw body required)
@csrf_exempt
def nowpayments_webhook(request: HttpRequest):
    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed."}, status=405)

    signature = request.headers.get("x-nowpayments-sig", "")
    if not verify_nowpayments_ipn(
        request.body, signature, settings.NOWPAYMENTS_IPN_SECRET
    ):
        logger.warning("NowPayments webhook: invalid IPN signature")
        return JsonResponse({"detail": "Invalid signature."}, status=401)

    import json

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid payload."}, status=400)

    payment_id = str(data.get("payment_id", ""))
    payment_status = data.get("payment_status", "")
    tracking_code = data.get("order_id", "")

    payment = Payment.objects.filter(gateway_payment_id=payment_id).first()
    if payment is None and tracking_code:
        order = Order.objects.filter(tracking_code=tracking_code).first()
        payment = getattr(order, "payment", None) if order else None

    if payment is None:
        logger.warning("NowPayments webhook: unknown payment %s", payment_id)
        return JsonResponse({"detail": "Payment not found."}, status=404)

    payment.raw_response = data
    if payment_status in ("finished", "confirmed"):
        from django.utils import timezone

        payment.status = Payment.Status.CONFIRMED
        payment.confirmed_at = timezone.now()
        payment.save()

        order = payment.order
        if order.status == Order.Status.PENDING:
            order.status = Order.Status.PAID
            order.save(update_fields=["status", "updated_at"])
            from apps.orders.tasks import deliver_premium_order

            deliver_premium_order.delay(order.id)
    elif payment_status in ("failed", "refunded", "expired"):
        payment.status = Payment.Status.FAILED
        payment.save()
    else:
        payment.save()

    return JsonResponse({"detail": "ok"}, status=200)

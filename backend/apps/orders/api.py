from django.shortcuts import get_object_or_404
from ninja import Router

from apps.products.models import Product
from apps.users.models import TelegramUser

from .models import Order
from .schemas import ErrorOut, OrderCreateIn, OrderOut

router = Router()


@router.post("/", response={200: OrderOut, 400: ErrorOut, 404: ErrorOut})
def create_order(request, payload: OrderCreateIn):
    """Create a new order in PENDING state."""
    user = TelegramUser.objects.filter(telegram_id=payload.telegram_id).first()
    if user is None:
        return 404, {"detail": "User not found."}
    if user.is_banned:
        return 400, {"detail": "This account is banned."}

    product = Product.objects.filter(id=payload.product_id, is_active=True).first()
    if product is None:
        return 404, {"detail": "Product not found."}

    if payload.payment_method not in Order.PaymentMethod.values:
        return 400, {"detail": "Invalid payment method."}

    recipient = payload.recipient_username.strip().lstrip("@")
    if not recipient:
        return 400, {"detail": "Recipient username is required."}

    order = Order.objects.create(
        user=user,
        product=product,
        recipient_username=recipient,
        payment_method=payload.payment_method,
        amount_toman=product.price_toman,
        status=Order.Status.PENDING,
    )
    return 200, order


@router.get("/{tracking_code}/", response={200: OrderOut, 404: ErrorOut})
def get_order(request, tracking_code: str):
    order = get_object_or_404(
        Order.objects.select_related("product", "user"),
        tracking_code=tracking_code,
    )
    return 200, order

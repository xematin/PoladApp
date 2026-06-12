from django.conf import settings
from django.shortcuts import get_object_or_404
from ninja import Router

from core.utils import validate_telegram_init_data

from .models import TelegramUser
from .schemas import (
    ErrorOut,
    InitDataIn,
    ProfileOut,
    ProfileStatsOut,
    UserOut,
    UserRegisterIn,
)

router = Router()
miniapp_router = Router()


def _resolve_referrer(referral_code: str | None) -> TelegramUser | None:
    if not referral_code:
        return None
    return TelegramUser.objects.filter(referral_code=referral_code).first()


def _upsert_user(
    telegram_id: int,
    first_name: str,
    username: str | None = None,
    last_name: str | None = None,
    referral_code: str | None = None,
) -> TelegramUser:
    """Create or update a TelegramUser, applying referral on first creation."""
    user, created = TelegramUser.objects.get_or_create(
        telegram_id=telegram_id,
        defaults={
            "first_name": first_name or "User",
            "username": username,
            "last_name": last_name,
            "is_admin": telegram_id in settings.ADMIN_TELEGRAM_IDS,
        },
    )
    if created:
        referrer = _resolve_referrer(referral_code)
        if referrer and referrer.telegram_id != telegram_id:
            user.referred_by = referrer
            user.save(update_fields=["referred_by"])
    else:
        # Keep profile data fresh
        changed = False
        if username != user.username:
            user.username = username
            changed = True
        if first_name and first_name != user.first_name:
            user.first_name = first_name
            changed = True
        if last_name != user.last_name:
            user.last_name = last_name
            changed = True
        # Promote to admin if configured in env
        if telegram_id in settings.ADMIN_TELEGRAM_IDS and not user.is_admin:
            user.is_admin = True
            changed = True
        if changed:
            user.save()
    return user


# ---------------------------------------------------------------------------
# Mini App endpoints (/api/v1/miniapp/...)
# ---------------------------------------------------------------------------
@miniapp_router.post("/init/", response={200: UserOut, 401: ErrorOut})
def miniapp_init(request, payload: InitDataIn):
    """Validate Telegram initData (HMAC-SHA256) and register/login the user."""
    data = validate_telegram_init_data(payload.init_data, settings.BOT_TOKEN)
    if data is None or not data.get("user"):
        return 401, {"detail": "Invalid Telegram init data."}

    tg_user = data["user"]
    user = _upsert_user(
        telegram_id=tg_user["id"],
        first_name=tg_user.get("first_name", "User"),
        username=tg_user.get("username"),
        last_name=tg_user.get("last_name"),
        referral_code=data.get("start_param"),
    )

    if user.is_banned:
        return 401, {"detail": "This account is banned."}

    return 200, user


# ---------------------------------------------------------------------------
# User endpoints (/api/v1/users/...)
# ---------------------------------------------------------------------------
@router.post("/register/", response={200: UserOut})
def register_user(request, payload: UserRegisterIn):
    """Register or update a user — used by the bot on /start."""
    user = _upsert_user(
        telegram_id=payload.telegram_id,
        first_name=payload.first_name,
        username=payload.username,
        last_name=payload.last_name,
        referral_code=payload.referral_code,
    )
    return 200, user


@router.get("/{int:tg_id}/profile/", response={200: ProfileOut, 404: ErrorOut})
def user_profile(request, tg_id: int):
    user = get_object_or_404(TelegramUser, telegram_id=tg_id)
    total_orders = user.orders.count()
    return 200, {
        "telegram_id": user.telegram_id,
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "full_name": user.full_name,
        "balance": float(user.balance),
        "referral_code": user.referral_code,
        "stats": ProfileStatsOut(
            total_orders=total_orders,
            balance=float(user.balance),
        ),
    }


@router.get("/{int:tg_id}/orders/")
def user_orders(request, tg_id: int):
    """Return the list of orders belonging to the given user."""
    from apps.orders.schemas import OrderOut  # local import to avoid cycle

    user = get_object_or_404(TelegramUser, telegram_id=tg_id)
    orders = user.orders.select_related("product").all()
    return [OrderOut.from_orm(o) for o in orders]

from datetime import datetime

from ninja import Schema


class InitDataIn(Schema):
    """Payload for /miniapp/init/ — raw Telegram WebApp initData string."""

    init_data: str


class UserRegisterIn(Schema):
    """Payload for direct registration (used by the bot)."""

    telegram_id: int
    username: str | None = None
    first_name: str
    last_name: str | None = None
    referral_code: str | None = None  # referral code of the referrer


class UserOut(Schema):
    telegram_id: int
    username: str | None = None
    first_name: str
    last_name: str | None = None
    balance: float
    referral_code: str
    is_admin: bool
    is_banned: bool
    created_at: datetime


class ProfileStatsOut(Schema):
    total_orders: int
    balance: float


class ProfileOut(Schema):
    telegram_id: int
    username: str | None = None
    first_name: str
    last_name: str | None = None
    full_name: str
    balance: float
    referral_code: str
    stats: ProfileStatsOut


class ErrorOut(Schema):
    detail: str

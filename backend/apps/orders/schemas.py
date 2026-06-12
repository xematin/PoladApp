from datetime import datetime

from ninja import Schema


class OrderCreateIn(Schema):
    telegram_id: int
    product_id: int
    recipient_username: str
    payment_method: str = "NOWPAYMENTS"


class ProductBrief(Schema):
    id: int
    name: str
    product_type: str
    duration_months: int | None = None
    stars_amount: int | None = None


class OrderOut(Schema):
    id: int
    tracking_code: str
    recipient_username: str
    status: str
    payment_method: str
    amount_toman: float
    notes: str | None = None
    product: ProductBrief
    created_at: datetime
    updated_at: datetime

    @staticmethod
    def resolve_amount_toman(obj):
        return float(obj.amount_toman)


class ErrorOut(Schema):
    detail: str

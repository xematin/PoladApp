from ninja import Schema


class ProductOut(Schema):
    id: int
    name: str
    product_type: str
    duration_months: int | None = None
    stars_amount: int | None = None
    price_toman: float
    is_active: bool

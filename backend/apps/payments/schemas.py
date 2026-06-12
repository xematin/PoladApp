from ninja import Schema


class NowPaymentsCreateIn(Schema):
    order_id: int


class NowPaymentsCreateOut(Schema):
    payment_id: str
    pay_address: str | None = None
    pay_amount: float | None = None
    pay_currency: str | None = None
    invoice_url: str | None = None
    status: str


class CardReceiptIn(Schema):
    order_id: int
    receipt_reference: str  # bank reference / transaction id
    note: str | None = None


class GenericOut(Schema):
    detail: str
    status: str | None = None


class ErrorOut(Schema):
    detail: str

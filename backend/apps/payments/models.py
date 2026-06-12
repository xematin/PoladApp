from django.db import models


class Payment(models.Model):
    """A payment record attached to a single order."""

    class Gateway(models.TextChoices):
        NOWPAYMENTS = "NOWPAYMENTS", "NowPayments"
        CARD = "CARD", "Card to Card"

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        CONFIRMED = "CONFIRMED", "Confirmed"
        FAILED = "FAILED", "Failed"

    order = models.OneToOneField(
        "orders.Order", on_delete=models.CASCADE, related_name="payment"
    )
    gateway = models.CharField(max_length=20, choices=Gateway.choices)
    gateway_payment_id = models.CharField(max_length=255, null=True, blank=True)
    amount_crypto = models.DecimalField(
        max_digits=24, decimal_places=8, null=True, blank=True
    )
    crypto_currency = models.CharField(max_length=20, null=True, blank=True)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.PENDING, db_index=True
    )
    raw_response = models.JSONField(null=True, blank=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Payment"
        verbose_name_plural = "Payments"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"Payment for {self.order.tracking_code} — {self.get_status_display()}"

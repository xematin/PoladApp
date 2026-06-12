from django.db import models

from core.utils import generate_tracking_code


class Order(models.Model):
    """A purchase order placed by a Telegram user."""

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        PAID = "PAID", "Paid"
        PROCESSING = "PROCESSING", "Processing"
        DELIVERED = "DELIVERED", "Delivered"
        FAILED = "FAILED", "Failed"
        REFUNDED = "REFUNDED", "Refunded"

    class PaymentMethod(models.TextChoices):
        NOWPAYMENTS = "NOWPAYMENTS", "NowPayments (Crypto)"
        CARD = "CARD", "Card to Card"
        WALLET = "WALLET", "Wallet Balance"

    user = models.ForeignKey(
        "users.TelegramUser", on_delete=models.CASCADE, related_name="orders"
    )
    product = models.ForeignKey(
        "products.Product", on_delete=models.PROTECT, related_name="orders"
    )
    recipient_username = models.CharField(max_length=255)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True,
    )
    payment_method = models.CharField(
        max_length=20, choices=PaymentMethod.choices
    )
    amount_toman = models.DecimalField(max_digits=14, decimal_places=0)
    tracking_code = models.CharField(max_length=20, unique=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Order"
        verbose_name_plural = "Orders"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.tracking_code} — {self.get_status_display()}"

    def save(self, *args, **kwargs):
        if not self.tracking_code:
            code = generate_tracking_code()
            while Order.objects.filter(tracking_code=code).exists():
                code = generate_tracking_code()
            self.tracking_code = code
        super().save(*args, **kwargs)

from django.db import models


class Product(models.Model):
    """A purchasable item — Telegram Premium subscription or a Stars pack."""

    class ProductType(models.TextChoices):
        PREMIUM = "PREMIUM", "Telegram Premium"
        STARS = "STARS", "Telegram Stars"

    name = models.CharField(max_length=255)
    product_type = models.CharField(
        max_length=20, choices=ProductType.choices, db_index=True
    )
    duration_months = models.IntegerField(null=True, blank=True)
    stars_amount = models.IntegerField(null=True, blank=True)
    price_toman = models.DecimalField(max_digits=14, decimal_places=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"
        ordering = ["product_type", "price_toman"]

    def __str__(self) -> str:
        return f"{self.name} ({self.get_product_type_display()})"

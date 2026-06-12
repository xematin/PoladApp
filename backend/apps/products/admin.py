from django.contrib import admin

from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "product_type",
        "duration_months",
        "stars_amount",
        "price_toman",
        "is_active",
    )
    list_filter = ("product_type", "is_active")
    search_fields = ("name",)
    list_editable = ("price_toman", "is_active")

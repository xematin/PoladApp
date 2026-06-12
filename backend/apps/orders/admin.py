from django.contrib import admin

from .models import Order


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "tracking_code",
        "user",
        "product",
        "recipient_username",
        "status",
        "payment_method",
        "amount_toman",
        "created_at",
    )
    list_filter = ("status", "payment_method", "created_at")
    search_fields = (
        "tracking_code",
        "recipient_username",
        "user__telegram_id",
        "user__username",
    )
    readonly_fields = ("tracking_code", "created_at", "updated_at")
    list_select_related = ("user", "product")
    list_per_page = 50

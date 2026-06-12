from django.contrib import admin

from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        "order",
        "gateway",
        "gateway_payment_id",
        "amount_crypto",
        "crypto_currency",
        "status",
        "confirmed_at",
        "created_at",
    )
    list_filter = ("gateway", "status", "created_at")
    search_fields = ("order__tracking_code", "gateway_payment_id")
    readonly_fields = ("raw_response", "created_at")
    list_select_related = ("order",)

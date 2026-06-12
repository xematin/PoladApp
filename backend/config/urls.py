"""URL configuration for PoladApp — wires Django Ninja API."""
from django.contrib import admin
from django.urls import path
from ninja import NinjaAPI

from apps.users.api import router as users_router, miniapp_router as users_miniapp_router
from apps.products.api import router as products_router, miniapp_router as products_miniapp_router
from apps.orders.api import router as orders_router
from apps.payments.api import router as payments_router
from apps.payments.api import nowpayments_webhook

api = NinjaAPI(
    title="PoladApp API",
    version="1.0.0",
    description="REST API for PoladApp Telegram Mini App",
)

# Mini App specific endpoints under /miniapp (init lives in users, products in products)
api.add_router("/miniapp", users_miniapp_router, tags=["miniapp"])
api.add_router("/miniapp", products_miniapp_router, tags=["miniapp"])

api.add_router("/users", users_router, tags=["users"])
api.add_router("/products", products_router, tags=["products"])
api.add_router("/orders", orders_router, tags=["orders"])
api.add_router("/payments", payments_router, tags=["payments"])

urlpatterns = [
    path("admin/", admin.site.urls),
    # Raw webhook (needs unparsed body for IPN signature verification)
    path(
        "api/v1/payments/nowpayments/webhook/",
        nowpayments_webhook,
        name="nowpayments-webhook",
    ),
    path("api/v1/", api.urls),
]

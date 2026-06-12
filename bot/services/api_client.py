"""Async HTTP client wrapping all PoladApp backend API calls."""
import logging
import os

import httpx

logger = logging.getLogger(__name__)

BASE_URL = os.environ.get("BACKEND_INTERNAL_URL", "http://backend:8000").rstrip("/")
API_PREFIX = "/api/v1"


class APIClient:
    """Thin async wrapper around the backend REST API."""

    def __init__(self, base_url: str = BASE_URL):
        self.base_url = f"{base_url}{API_PREFIX}"

    async def _request(self, method: str, path: str, **kwargs):
        url = f"{self.base_url}{path}"
        async with httpx.AsyncClient(timeout=30) as client:
            try:
                resp = await client.request(method, url, **kwargs)
                resp.raise_for_status()
                if resp.content:
                    return resp.json()
                return None
            except httpx.HTTPStatusError as exc:
                logger.error("API %s %s -> %s", method, path, exc.response.status_code)
                return None
            except httpx.HTTPError as exc:
                logger.error("API %s %s failed: %s", method, path, exc)
                return None

    # --- Users -----------------------------------------------------------
    async def register_user(
        self,
        telegram_id: int,
        first_name: str,
        username: str | None = None,
        last_name: str | None = None,
        referral_code: str | None = None,
    ):
        return await self._request(
            "POST",
            "/users/register/",
            json={
                "telegram_id": telegram_id,
                "first_name": first_name,
                "username": username,
                "last_name": last_name,
                "referral_code": referral_code,
            },
        )

    async def get_profile(self, telegram_id: int):
        return await self._request("GET", f"/users/{telegram_id}/profile/")

    async def get_user_orders(self, telegram_id: int):
        return await self._request("GET", f"/users/{telegram_id}/orders/")

    # --- Products --------------------------------------------------------
    async def get_products(self):
        return await self._request("GET", "/products/")

    # --- Orders ----------------------------------------------------------
    async def create_order(
        self,
        telegram_id: int,
        product_id: int,
        recipient_username: str,
        payment_method: str = "NOWPAYMENTS",
    ):
        return await self._request(
            "POST",
            "/orders/",
            json={
                "telegram_id": telegram_id,
                "product_id": product_id,
                "recipient_username": recipient_username,
                "payment_method": payment_method,
            },
        )

    async def get_order(self, tracking_code: str):
        return await self._request("GET", f"/orders/{tracking_code}/")

    # --- Payments --------------------------------------------------------
    async def create_nowpayments_invoice(self, order_id: int):
        return await self._request(
            "POST",
            "/payments/nowpayments/create/",
            json={"order_id": order_id},
        )


api_client = APIClient()

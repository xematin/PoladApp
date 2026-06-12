"""
Telegram Premium delivery service.

MVP strategy: delivery is handled manually by admins. This module notifies
admins with the order details so they can fulfil it, then admins update the
order status from the Django admin or via the /admin bot panel.
"""
import logging
import os

from aiogram import Bot

logger = logging.getLogger(__name__)

ADMIN_IDS = [
    int(x.strip())
    for x in os.environ.get("ADMIN_TELEGRAM_IDS", "").split(",")
    if x.strip().isdigit()
]


async def notify_admin_for_delivery(
    bot: Bot,
    order_id: int,
    tracking_code: str,
    product_name: str,
    recipient: str,
    duration: int | None = None,
) -> None:
    """Notify all admins that an order is ready for manual delivery."""
    duration_line = f"⏳ مدت: {duration} ماه\n" if duration else ""
    text = (
        "🔔 <b>سفارش آماده تحویل</b>\n\n"
        f"🆔 شناسه سفارش: <code>{order_id}</code>\n"
        f"📦 کد رهگیری: <code>{tracking_code}</code>\n"
        f"🎁 محصول: {product_name}\n"
        f"{duration_line}"
        f"👤 گیرنده: @{recipient}\n\n"
        "پس از تحویل، وضعیت سفارش را به DELIVERED تغییر دهید."
    )
    for admin_id in ADMIN_IDS:
        try:
            await bot.send_message(admin_id, text)
        except Exception as exc:  # noqa: BLE001
            logger.error("Failed to notify admin %s: %s", admin_id, exc)

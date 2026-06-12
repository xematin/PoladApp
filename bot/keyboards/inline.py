"""Inline keyboards for the PoladApp bot."""
import os

from aiogram.types import (
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    WebAppInfo,
)
from aiogram.utils.keyboard import InlineKeyboardBuilder

MINI_APP_URL = os.environ.get("MINI_APP_URL", "https://yourdomain.com")


def main_menu_kb() -> InlineKeyboardMarkup:
    """Main menu shown after /start."""
    builder = InlineKeyboardBuilder()
    builder.row(
        InlineKeyboardButton(text="💎 خرید پرمیوم", callback_data="buy_premium"),
        InlineKeyboardButton(text="⭐ خرید استارز", callback_data="buy_stars"),
    )
    builder.row(
        InlineKeyboardButton(text="📋 سفارشات من", callback_data="my_orders"),
        InlineKeyboardButton(text="👤 پروفایل من", callback_data="my_profile"),
    )
    builder.row(
        InlineKeyboardButton(
            text="🚀 باز کردن Mini App",
            web_app=WebAppInfo(url=MINI_APP_URL),
        )
    )
    return builder.as_markup()


def products_kb(products: list[dict], prefix: str) -> InlineKeyboardMarkup:
    """Build a keyboard listing products of a single type."""
    builder = InlineKeyboardBuilder()
    for p in products:
        price = f"{int(p['price_toman']):,}"
        builder.row(
            InlineKeyboardButton(
                text=f"{p['name']} — {price} تومان",
                callback_data=f"{prefix}:{p['id']}",
            )
        )
    builder.row(
        InlineKeyboardButton(text="🔙 بازگشت", callback_data="back_main")
    )
    return builder.as_markup()


def payment_methods_kb(order_id: int) -> InlineKeyboardMarkup:
    """Choose a payment method for an order."""
    builder = InlineKeyboardBuilder()
    builder.row(
        InlineKeyboardButton(
            text="🪙 پرداخت با کریپتو", callback_data=f"pay_crypto:{order_id}"
        )
    )
    builder.row(
        InlineKeyboardButton(
            text="💳 کارت به کارت", callback_data=f"pay_card:{order_id}"
        )
    )
    builder.row(
        InlineKeyboardButton(text="❌ انصراف", callback_data="back_main")
    )
    return builder.as_markup()


def order_detail_kb(tracking_code: str) -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    builder.row(
        InlineKeyboardButton(
            text="📤 ارسال رسید", callback_data=f"upload_receipt:{tracking_code}"
        )
    )
    builder.row(
        InlineKeyboardButton(text="🔙 بازگشت", callback_data="my_orders")
    )
    return builder.as_markup()


def back_main_kb() -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    builder.row(
        InlineKeyboardButton(text="🔙 بازگشت به منو", callback_data="back_main")
    )
    return builder.as_markup()

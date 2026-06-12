"""Reply keyboards for the PoladApp bot."""
import os

from aiogram.types import KeyboardButton, ReplyKeyboardMarkup, WebAppInfo
from aiogram.utils.keyboard import ReplyKeyboardBuilder

MINI_APP_URL = os.environ.get("MINI_APP_URL", "https://yourdomain.com")


def main_reply_kb() -> ReplyKeyboardMarkup:
    """Persistent reply keyboard with quick actions."""
    builder = ReplyKeyboardBuilder()
    builder.row(
        KeyboardButton(text="💎 پرمیوم"),
        KeyboardButton(text="⭐ استارز"),
    )
    builder.row(
        KeyboardButton(text="📋 سفارشات"),
        KeyboardButton(text="👤 پروفایل"),
    )
    builder.row(
        KeyboardButton(
            text="🚀 Mini App",
            web_app=WebAppInfo(url=MINI_APP_URL),
        )
    )
    return builder.as_markup(resize_keyboard=True)

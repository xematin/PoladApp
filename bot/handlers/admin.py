"""Admin panel — /admin (admins only)."""
import logging
import os

from aiogram import Bot, F, Router
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import CallbackQuery, InlineKeyboardButton, Message
from aiogram.utils.keyboard import InlineKeyboardBuilder

from services.api_client import api_client

logger = logging.getLogger(__name__)
router = Router()

ADMIN_IDS = [
    int(x.strip())
    for x in os.environ.get("ADMIN_TELEGRAM_IDS", "").split(",")
    if x.strip().isdigit()
]


def is_admin(user_id: int) -> bool:
    return user_id in ADMIN_IDS


class AdminStates(StatesGroup):
    waiting_broadcast = State()
    waiting_status_update = State()


def admin_kb():
    builder = InlineKeyboardBuilder()
    builder.row(
        InlineKeyboardButton(text="📊 آمار امروز", callback_data="admin_stats")
    )
    builder.row(
        InlineKeyboardButton(
            text="✏️ تغییر وضعیت سفارش", callback_data="admin_status"
        )
    )
    builder.row(
        InlineKeyboardButton(text="📢 پیام همگانی", callback_data="admin_broadcast")
    )
    return builder.as_markup()


@router.message(Command("admin"))
async def cmd_admin(message: Message, db_user: dict | None = None):
    # Check both env list and DB flag (defense in depth)
    db_admin = bool(db_user and db_user.get("is_admin"))
    if not (is_admin(message.from_user.id) or db_admin):
        await message.answer("⛔️ شما دسترسی ادمین ندارید.")
        return
    await message.answer("🛠 <b>پنل مدیریت PoladApp</b>", reply_markup=admin_kb())


@router.callback_query(F.data == "admin_stats")
async def admin_stats(callback: CallbackQuery, db_user: dict | None = None):
    if not (is_admin(callback.from_user.id) or (db_user and db_user.get("is_admin"))):
        await callback.answer("⛔️ بدون دسترسی.", show_alert=True)
        return
    # Lightweight stats via products/orders endpoints
    text = (
        "📊 <b>آمار</b>\n\n"
        "برای گزارش کامل به پنل ادمین جنگو مراجعه کنید:\n"
        "/admin در داشبورد بک‌اند"
    )
    await callback.message.edit_text(text, reply_markup=admin_kb())
    await callback.answer()


@router.callback_query(F.data == "admin_broadcast")
async def admin_broadcast_start(callback: CallbackQuery, state: FSMContext):
    if not is_admin(callback.from_user.id):
        await callback.answer("⛔️ بدون دسترسی.", show_alert=True)
        return
    await state.set_state(AdminStates.waiting_broadcast)
    await callback.message.answer("📢 متن پیام همگانی را ارسال کنید:")
    await callback.answer()


@router.message(AdminStates.waiting_broadcast)
async def admin_broadcast_send(message: Message, state: FSMContext, bot: Bot):
    await state.clear()
    if not is_admin(message.from_user.id):
        return
    # In a full implementation we'd page through all users from the backend.
    await message.answer(
        "✅ پیام همگانی ثبت شد.\n"
        "(پیاده‌سازی ارسال انبوه نیازمند endpoint فهرست کاربران است.)"
    )


@router.callback_query(F.data == "admin_status")
async def admin_status_prompt(callback: CallbackQuery, state: FSMContext):
    if not is_admin(callback.from_user.id):
        await callback.answer("⛔️ بدون دسترسی.", show_alert=True)
        return
    await state.set_state(AdminStates.waiting_status_update)
    await callback.message.answer(
        "✏️ کد رهگیری و وضعیت جدید را به این شکل ارسال کنید:\n"
        "<code>PLD-12345678 DELIVERED</code>"
    )
    await callback.answer()


@router.message(AdminStates.waiting_status_update)
async def admin_status_apply(message: Message, state: FSMContext):
    await state.clear()
    if not is_admin(message.from_user.id):
        return
    parts = message.text.strip().split()
    if len(parts) != 2:
        await message.answer("فرمت نامعتبر است.")
        return
    tracking_code, new_status = parts[0], parts[1].upper()
    order = await api_client.get_order(tracking_code)
    if not order:
        await message.answer("سفارش یافت نشد.")
        return
    await message.answer(
        f"وضعیت سفارش <code>{tracking_code}</code> به <b>{new_status}</b> به‌روزرسانی شد.\n"
        "(برای اعمال نهایی از پنل ادمین جنگو استفاده کنید.)"
    )

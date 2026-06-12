"""Order listing, detail and receipt upload."""
import logging

from aiogram import F, Router
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import CallbackQuery, Message

from keyboards.inline import back_main_kb, order_detail_kb
from services.api_client import api_client

logger = logging.getLogger(__name__)
router = Router()

STATUS_LABELS = {
    "PENDING": "⏳ در انتظار پرداخت",
    "PAID": "💰 پرداخت‌شده",
    "PROCESSING": "⚙️ در حال پردازش",
    "DELIVERED": "✅ تحویل‌شده",
    "FAILED": "❌ ناموفق",
    "REFUNDED": "↩️ بازگشت‌خورده",
}


class ReceiptStates(StatesGroup):
    waiting_receipt = State()


def _format_orders(orders: list[dict]) -> str:
    if not orders:
        return "شما هنوز سفارشی ثبت نکرده‌اید."
    lines = ["📋 <b>سفارشات شما</b>\n"]
    for o in orders:
        status = STATUS_LABELS.get(o["status"], o["status"])
        lines.append(
            f"📦 <code>{o['tracking_code']}</code>\n"
            f"   {o['product']['name']} — {int(o['amount_toman']):,} تومان\n"
            f"   وضعیت: {status}\n"
        )
    return "\n".join(lines)


@router.message(Command("orders"))
async def cmd_orders(message: Message):
    orders = await api_client.get_user_orders(message.from_user.id)
    await message.answer(_format_orders(orders or []), reply_markup=back_main_kb())


@router.callback_query(F.data == "my_orders")
async def show_orders(callback: CallbackQuery):
    orders = await api_client.get_user_orders(callback.from_user.id)
    await callback.message.edit_text(
        _format_orders(orders or []), reply_markup=back_main_kb()
    )
    await callback.answer()


@router.message(F.text == "📋 سفارشات")
async def orders_shortcut(message: Message):
    orders = await api_client.get_user_orders(message.from_user.id)
    await message.answer(_format_orders(orders or []), reply_markup=back_main_kb())


@router.callback_query(F.data.startswith("upload_receipt:"))
async def ask_receipt(callback: CallbackQuery, state: FSMContext):
    tracking_code = callback.data.split(":", 1)[1]
    await state.update_data(tracking_code=tracking_code)
    await state.set_state(ReceiptStates.waiting_receipt)
    await callback.message.answer(
        "📤 لطفاً تصویر رسید پرداخت را ارسال کنید:"
    )
    await callback.answer()


@router.message(ReceiptStates.waiting_receipt, F.photo)
async def receive_receipt(message: Message, state: FSMContext):
    data = await state.get_data()
    tracking_code = data.get("tracking_code")
    await state.clear()

    # Forward the receipt to admins for manual verification
    import os

    admin_ids = [
        int(x.strip())
        for x in os.environ.get("ADMIN_TELEGRAM_IDS", "").split(",")
        if x.strip().isdigit()
    ]
    caption = (
        "🧾 <b>رسید جدید</b>\n"
        f"کد رهگیری: <code>{tracking_code}</code>\n"
        f"از کاربر: @{message.from_user.username or message.from_user.id}"
    )
    for admin_id in admin_ids:
        try:
            await message.bot.send_photo(
                admin_id, message.photo[-1].file_id, caption=caption
            )
        except Exception as exc:  # noqa: BLE001
            logger.error("Failed to forward receipt to %s: %s", admin_id, exc)

    await message.answer(
        "✅ رسید شما دریافت شد و در حال بررسی توسط ادمین است.",
        reply_markup=back_main_kb(),
    )


@router.message(ReceiptStates.waiting_receipt)
async def receipt_not_photo(message: Message):
    await message.answer("لطفاً رسید را به‌صورت <b>عکس</b> ارسال کنید.")

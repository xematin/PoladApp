"""Premium & Stars purchase flow."""
import logging

from aiogram import F, Router
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import CallbackQuery, Message

from keyboards.inline import (
    back_main_kb,
    main_menu_kb,
    payment_methods_kb,
    products_kb,
)
from services.api_client import api_client

logger = logging.getLogger(__name__)
router = Router()


class PurchaseStates(StatesGroup):
    waiting_recipient = State()


async def _show_products(callback: CallbackQuery, product_type: str, prefix: str):
    products = await api_client.get_products()
    if products is None:
        await callback.answer("خطا در دریافت محصولات.", show_alert=True)
        return
    filtered = [p for p in products if p["product_type"] == product_type]
    if not filtered:
        await callback.answer("محصولی موجود نیست.", show_alert=True)
        return
    title = "💎 بسته‌های پرمیوم:" if product_type == "PREMIUM" else "⭐ بسته‌های استارز:"
    await callback.message.edit_text(title, reply_markup=products_kb(filtered, prefix))
    await callback.answer()


@router.callback_query(F.data == "buy_premium")
async def buy_premium(callback: CallbackQuery):
    await _show_products(callback, "PREMIUM", "prod")


@router.callback_query(F.data == "buy_stars")
async def buy_stars(callback: CallbackQuery):
    await _show_products(callback, "STARS", "prod")


@router.callback_query(F.data.startswith("prod:"))
async def select_product(callback: CallbackQuery, state: FSMContext):
    product_id = int(callback.data.split(":", 1)[1])
    await state.update_data(product_id=product_id)
    await state.set_state(PurchaseStates.waiting_recipient)
    await callback.message.edit_text(
        "👤 لطفاً <b>یوزرنیم گیرنده</b> را وارد کنید (بدون @):",
        reply_markup=back_main_kb(),
    )
    await callback.answer()


@router.message(PurchaseStates.waiting_recipient)
async def receive_recipient(message: Message, state: FSMContext):
    recipient = message.text.strip().lstrip("@")
    if not recipient or " " in recipient:
        await message.answer("یوزرنیم نامعتبر است. دوباره تلاش کنید.")
        return

    data = await state.get_data()
    product_id = data.get("product_id")
    await state.clear()

    order = await api_client.create_order(
        telegram_id=message.from_user.id,
        product_id=product_id,
        recipient_username=recipient,
        payment_method="NOWPAYMENTS",
    )
    if not order:
        await message.answer("خطا در ثبت سفارش. دوباره تلاش کنید.")
        return

    text = (
        "🧾 <b>سفارش شما ثبت شد</b>\n\n"
        f"محصول: {order['product']['name']}\n"
        f"گیرنده: @{order['recipient_username']}\n"
        f"مبلغ: {int(order['amount_toman']):,} تومان\n"
        f"کد رهگیری: <code>{order['tracking_code']}</code>\n\n"
        "روش پرداخت را انتخاب کنید:"
    )
    await message.answer(text, reply_markup=payment_methods_kb(order["id"]))


@router.callback_query(F.data.startswith("pay_crypto:"))
async def pay_crypto(callback: CallbackQuery):
    order_id = int(callback.data.split(":", 1)[1])
    invoice = await api_client.create_nowpayments_invoice(order_id)
    if not invoice:
        await callback.answer("خطا در ایجاد فاکتور پرداخت.", show_alert=True)
        return

    lines = ["🪙 <b>پرداخت کریپتو</b>\n"]
    if invoice.get("pay_amount") and invoice.get("pay_currency"):
        lines.append(
            f"مبلغ: <code>{invoice['pay_amount']} {invoice['pay_currency'].upper()}</code>"
        )
    if invoice.get("pay_address"):
        lines.append(f"آدرس کیف پول:\n<code>{invoice['pay_address']}</code>")
    if invoice.get("invoice_url"):
        lines.append(f"\n🔗 لینک پرداخت:\n{invoice['invoice_url']}")
    lines.append("\nپس از تأیید تراکنش، سفارش به‌صورت خودکار پردازش می‌شود.")

    await callback.message.edit_text("\n".join(lines), reply_markup=main_menu_kb())
    await callback.answer()


@router.callback_query(F.data.startswith("pay_card:"))
async def pay_card(callback: CallbackQuery):
    await callback.message.edit_text(
        "💳 <b>پرداخت کارت به کارت</b>\n\n"
        "لطفاً مبلغ سفارش را به کارت زیر واریز کنید و سپس از بخش "
        "«سفارشات من» رسید را ارسال نمایید:\n\n"
        "<code>6037-XXXX-XXXX-XXXX</code>\n"
        "به نام: PoladApp\n\n"
        "پس از ارسال رسید، سفارش توسط ادمین بررسی و تأیید می‌شود.",
        reply_markup=main_menu_kb(),
    )
    await callback.answer()


# Reply-keyboard shortcuts
@router.message(F.text == "💎 پرمیوم")
async def premium_shortcut(message: Message):
    products = await api_client.get_products()
    if not products:
        await message.answer("خطا در دریافت محصولات.")
        return
    filtered = [p for p in products if p["product_type"] == "PREMIUM"]
    await message.answer("💎 بسته‌های پرمیوم:", reply_markup=products_kb(filtered, "prod"))


@router.message(F.text == "⭐ استارز")
async def stars_shortcut(message: Message):
    products = await api_client.get_products()
    if not products:
        await message.answer("خطا در دریافت محصولات.")
        return
    filtered = [p for p in products if p["product_type"] == "STARS"]
    await message.answer("⭐ بسته‌های استارز:", reply_markup=products_kb(filtered, "prod"))

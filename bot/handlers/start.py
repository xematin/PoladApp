"""/start handler — register user and show the main menu."""
import logging

from aiogram import F, Router
from aiogram.filters import CommandObject, CommandStart
from aiogram.types import CallbackQuery, Message

from keyboards.inline import main_menu_kb
from keyboards.reply import main_reply_kb
from services.api_client import api_client

logger = logging.getLogger(__name__)
router = Router()

WELCOME_TEXT = (
    "🌉 <b>به PoladApp خوش آمدید!</b>\n\n"
    "پلی پولادین برای خرید امن و آنی:\n"
    "💎 تلگرام پرمیوم\n"
    "⭐ تلگرام استارز\n\n"
    "برای شروع یکی از گزینه‌های زیر را انتخاب کنید 👇"
)


@router.message(CommandStart())
async def cmd_start(message: Message, command: CommandObject):
    # Support referral via deep-link: /start <referral_code>
    referral_code = command.args.strip() if command.args else None

    await api_client.register_user(
        telegram_id=message.from_user.id,
        first_name=message.from_user.first_name or "User",
        username=message.from_user.username,
        last_name=message.from_user.last_name,
        referral_code=referral_code,
    )

    await message.answer(WELCOME_TEXT, reply_markup=main_reply_kb())
    await message.answer("منوی اصلی:", reply_markup=main_menu_kb())


@router.callback_query(F.data == "back_main")
async def back_to_main(callback: CallbackQuery):
    await callback.message.edit_text("منوی اصلی:", reply_markup=main_menu_kb())
    await callback.answer()


@router.callback_query(F.data == "my_profile")
async def show_profile(callback: CallbackQuery):
    profile = await api_client.get_profile(callback.from_user.id)
    if not profile:
        await callback.answer("خطا در دریافت پروفایل.", show_alert=True)
        return

    stats = profile.get("stats", {})
    bot_username = (await callback.bot.me()).username
    ref_link = f"https://t.me/{bot_username}?start={profile['referral_code']}"

    text = (
        "👤 <b>پروفایل من</b>\n\n"
        f"نام: {profile['full_name']}\n"
        f"یوزرنیم: @{profile.get('username') or '—'}\n"
        f"موجودی کیف پول: {int(profile['balance']):,} تومان\n"
        f"تعداد سفارشات: {stats.get('total_orders', 0)}\n\n"
        f"🎁 کد معرف شما: <code>{profile['referral_code']}</code>\n"
        f"🔗 لینک دعوت:\n{ref_link}"
    )
    from keyboards.inline import back_main_kb

    await callback.message.edit_text(text, reply_markup=back_main_kb())
    await callback.answer()


# Reply-keyboard shortcuts
@router.message(F.text == "👤 پروفایل")
async def profile_shortcut(message: Message):
    profile = await api_client.get_profile(message.from_user.id)
    if not profile:
        await message.answer("خطا در دریافت پروفایل.")
        return
    stats = profile.get("stats", {})
    bot_username = (await message.bot.me()).username
    ref_link = f"https://t.me/{bot_username}?start={profile['referral_code']}"
    await message.answer(
        "👤 <b>پروفایل من</b>\n\n"
        f"نام: {profile['full_name']}\n"
        f"موجودی: {int(profile['balance']):,} تومان\n"
        f"تعداد سفارشات: {stats.get('total_orders', 0)}\n\n"
        f"🎁 کد معرف: <code>{profile['referral_code']}</code>\n"
        f"🔗 {ref_link}"
    )

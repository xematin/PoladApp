# 🌉 PoladApp

پلی پولادین برای خرید **تلگرام پرمیوم** و **استارز** — یک سیستم کامل Telegram Mini App.

> «پولاد» = پل + فولاد. هویت برند: فین‌تک پریمیوم تیره — تلاقی Apple Pay و Telegram.

---

## 🧱 معماری

| لایه       | تکنولوژی                         |
| ---------- | -------------------------------- |
| Frontend   | React + Vite (Telegram Mini App) |
| Backend    | Django 5 + Django Ninja (REST)   |
| Bot        | Aiogram 3                        |
| Database   | PostgreSQL 16                    |
| Cache/Queue| Redis 7 + Celery 5               |

```
poladapp/
├── docker-compose.yml      # ارکستراسیون کل سرویس‌ها
├── .env.example            # نمونه متغیرهای محیطی
├── backend/                # Django + Ninja API + Celery
├── bot/                    # Aiogram 3 bot
└── frontend/               # React + Vite Mini App
```

---

## 🚀 راه‌اندازی سریع

### ۱. متغیرهای محیطی

```bash
cp .env.example .env
# سپس مقادیر واقعی را در .env قرار دهید
```

مقادیر کلیدی:

- `SECRET_KEY` — کلید مخفی Django
- `BOT_TOKEN` — توکن ربات از BotFather
- `ADMIN_TELEGRAM_IDS` — شناسه عددی ادمین‌ها (جداشده با کاما)
- `MINI_APP_URL` — آدرس دامنه‌ی Mini App (برای CORS و webhook)
- `NOWPAYMENTS_API_KEY` / `NOWPAYMENTS_IPN_SECRET` — درگاه کریپتو

> ⚠️ هیچ توکن یا کلیدی را hardcode نکنید. همه‌چیز فقط از طریق `.env`.

### ۲. اجرای کل سیستم با Docker

```bash
docker compose up --build
```

این دستور به‌ترتیب راه‌اندازی می‌کند:

- `db` (PostgreSQL) و `redis`
- `backend` روی پورت `8000` (migrate + loaddata خودکار)
- `celery_worker` و `celery_beat`
- `bot` (polling)

### ۳. اجرای Frontend (توسعه)

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
```

برای بیلد پروداکشن:

```bash
npm run build    # خروجی در frontend/dist/
```

---

## 🔌 API (Django Ninja)

تمام مسیرها زیر `/api/v1/`:

| متد  | مسیر                              | توضیح                       |
| ---- | -------------------------------- | --------------------------- |
| POST | `/miniapp/init/`                 | اعتبارسنجی initData تلگرام   |
| GET  | `/miniapp/products/`             | لیست محصولات Mini App        |
| POST | `/users/register/`               | ثبت/به‌روزرسانی کاربر (بات)  |
| GET  | `/users/{tg_id}/profile/`        | پروفایل کاربر               |
| GET  | `/users/{tg_id}/orders/`         | سفارشات کاربر               |
| GET  | `/products/`                     | لیست محصولات                |
| GET  | `/products/{id}/`                | جزئیات محصول                |
| POST | `/orders/`                       | ثبت سفارش                   |
| GET  | `/orders/{tracking_code}/`       | پیگیری سفارش                |
| POST | `/payments/nowpayments/create/`  | ساخت فاکتور کریپتو          |
| POST | `/payments/nowpayments/webhook/` | وب‌هوک IPN (با تأیید امضا)   |
| POST | `/payments/card/submit/`         | ثبت رسید کارت‌به‌کارت        |

مستندات تعاملی: `http://localhost:8000/api/v1/docs`

---

## 🔐 امنیت

- اعتبارسنجی `initData` تلگرام با **HMAC-SHA256** در `/miniapp/init/`.
- تأیید امضای **IPN** نوپیمنتس (HMAC-SHA512) روی webhook.
- بررسی `is_admin` از دیتابیس (نه فقط از env) در هندلرهای ادمین.
- فعال‌سازی CORS فقط برای `MINI_APP_URL`.
- همه‌ی اسرار فقط از `.env`.

---

## ⚙️ Celery Tasks

| تسک                        | توضیح                                          |
| -------------------------- | ---------------------------------------------- |
| `deliver_premium_order`    | پردازش سفارش → اطلاع به ادمین برای تحویل دستی   |
| `check_pending_orders`     | هر ۵ دقیقه: سفارش‌های PENDING بالای ۳۰ دقیقه → FAILED |
| `check_nowpayments_status` | poll وضعیت پرداخت با ۱۰ بار retry              |

---

## 🤖 ربات (Aiogram 3)

- `/start` — ثبت‌نام + منوی اصلی + دکمه‌ی WebApp
- `/orders` — لیست سفارشات + آپلود رسید
- `/admin` — پنل ادمین (فقط ادمین‌ها): آمار، تغییر وضعیت، پیام همگانی

---

## 🎨 هویت بصری

پالت رنگی سخت‌گیرانه (در `frontend/src/styles/variables.css`):

| متغیر         | رنگ       | کاربرد                  |
| ------------- | --------- | ----------------------- |
| `--bg-deep`   | `#080C14` | پس‌زمینه‌ی صفحه          |
| `--glow-blue` | `#2A7FFF` | CTA و حالت‌های فعال      |
| `--steel`     | `#C8CDD6` | متن اصلی و لوگو          |

دکمه‌ها همگی با افکت **شیشه‌ای سه‌بعدی** (Glass) و ناوبری پایین به‌صورت کپسول شناور (iOS 26 liquid glass).

---

ساخته‌شده با ❤️ برای جامعه‌ی تلگرام فارسی.

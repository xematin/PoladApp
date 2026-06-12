"""Authentication middleware: auto-register users and block banned ones."""
import logging
from typing import Any, Awaitable, Callable

from aiogram import BaseMiddleware
from aiogram.types import TelegramObject, Update, User

from services.api_client import api_client

logger = logging.getLogger(__name__)


class AuthMiddleware(BaseMiddleware):
    """Ensures every interacting user exists in the backend and isn't banned."""

    async def __call__(
        self,
        handler: Callable[[TelegramObject, dict[str, Any]], Awaitable[Any]],
        event: TelegramObject,
        data: dict[str, Any],
    ) -> Any:
        tg_user: User | None = data.get("event_from_user")
        if tg_user is None or tg_user.is_bot:
            return await handler(event, data)

        # Auto-register / refresh profile on every message (idempotent upsert)
        profile = await api_client.register_user(
            telegram_id=tg_user.id,
            first_name=tg_user.first_name or "User",
            username=tg_user.username,
            last_name=tg_user.last_name,
        )

        if profile is not None and profile.get("is_banned"):
            logger.info("Blocked banned user %s", tg_user.id)
            # Silently drop updates from banned users
            return None

        data["db_user"] = profile
        return await handler(event, data)

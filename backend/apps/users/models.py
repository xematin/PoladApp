from django.db import models

from core.utils import generate_referral_code


class TelegramUser(models.Model):
    """A Telegram user registered through the bot or Mini App."""

    telegram_id = models.BigIntegerField(unique=True, db_index=True)
    username = models.CharField(max_length=255, null=True, blank=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255, null=True, blank=True)
    balance = models.DecimalField(max_digits=14, decimal_places=0, default=0)
    referral_code = models.CharField(max_length=8, unique=True, blank=True)
    referred_by = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="referrals",
    )
    is_banned = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Telegram User"
        verbose_name_plural = "Telegram Users"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.first_name} (@{self.username or self.telegram_id})"

    def save(self, *args, **kwargs):
        # Auto-generate a unique referral code on first save
        if not self.referral_code:
            code = generate_referral_code()
            while TelegramUser.objects.filter(referral_code=code).exists():
                code = generate_referral_code()
            self.referral_code = code
        super().save(*args, **kwargs)

    @property
    def full_name(self) -> str:
        if self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.first_name

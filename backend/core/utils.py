"""Shared helper utilities for PoladApp backend."""
import hashlib
import hmac
import json
import secrets
import string
from urllib.parse import parse_qsl


def generate_referral_code(length: int = 8) -> str:
    """Generate a random uppercase alphanumeric referral code."""
    alphabet = string.ascii_uppercase + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(length))


def generate_tracking_code(prefix: str = "PLD") -> str:
    """Generate a unique-ish human-readable order tracking code."""
    body = "".join(secrets.choice(string.digits) for _ in range(8))
    return f"{prefix}-{body}"


def validate_telegram_init_data(init_data: str, bot_token: str) -> dict | None:
    """
    Validate Telegram WebApp ``initData`` using HMAC-SHA256.

    Returns the parsed data dict (including a parsed ``user`` object) when the
    signature is valid, otherwise ``None``.

    Reference:
    https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
    """
    if not init_data or not bot_token:
        return None

    try:
        parsed = dict(parse_qsl(init_data, strict_parsing=True))
    except ValueError:
        return None

    received_hash = parsed.pop("hash", None)
    if not received_hash:
        return None

    # Build the data-check-string: keys sorted alphabetically, "key=value"
    data_check_string = "\n".join(
        f"{key}={parsed[key]}" for key in sorted(parsed.keys())
    )

    # secret_key = HMAC_SHA256(bot_token, key="WebAppData")
    secret_key = hmac.new(
        b"WebAppData", bot_token.encode(), hashlib.sha256
    ).digest()

    computed_hash = hmac.new(
        secret_key, data_check_string.encode(), hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(computed_hash, received_hash):
        return None

    # Parse nested JSON user object if present
    if "user" in parsed:
        try:
            parsed["user"] = json.loads(parsed["user"])
        except (json.JSONDecodeError, TypeError):
            parsed["user"] = None

    return parsed


def verify_nowpayments_ipn(payload_body: bytes, signature: str, ipn_secret: str) -> bool:
    """
    Verify a NowPayments IPN callback signature.

    NowPayments signs the JSON-sorted payload with HMAC-SHA512 using the IPN
    secret and sends the result in the ``x-nowpayments-sig`` header.
    """
    if not signature or not ipn_secret:
        return False

    try:
        payload = json.loads(payload_body)
    except (json.JSONDecodeError, TypeError):
        return False

    sorted_payload = json.dumps(payload, sort_keys=True, separators=(",", ":"))
    computed = hmac.new(
        ipn_secret.encode(), sorted_payload.encode(), hashlib.sha512
    ).hexdigest()

    return hmac.compare_digest(computed, signature)

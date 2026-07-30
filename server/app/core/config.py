from pathlib import Path
import os
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent.parent

app_env_initial = os.getenv("APP_ENV", "development").lower()

if (BASE_DIR / ".env").exists():
    load_dotenv(BASE_DIR / ".env", override=True)
elif app_env_initial == "production":
    load_dotenv(BASE_DIR / ".env.production", override=True)
else:
    load_dotenv(BASE_DIR / ".env.development", override=True)


class Config:

    APP_NAME = os.getenv("APP_NAME")
    FRONTEND_ORIGINS = [
        origin.strip()
        for origin in os.getenv("FRONTEND_ORIGINS", "").split(",")
        if origin.strip()
    ]

    APP_ENV = os.getenv("APP_ENV")

    APP_PORT = int(os.getenv("APP_PORT"))  # type: ignore

    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = int(os.getenv("DB_PORT"))  # type: ignore
    DB_NAME = os.getenv("DB_NAME")
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")

    JWT_SECRET = os.getenv("JWT_SECRET")
    JWT_REFRESH_SECRET = os.getenv("JWT_REFRESH_SECRET")
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
    JWT_EXPIRE_HOURS = int(os.getenv("JWT_EXPIRE_HOURS"))  # type: ignore

    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    GEMINI_PROJECT_ID= os.getenv("GEMINI_PROJECT_ID")
    GEMINI_LOCATION = os.getenv("GEMINI_LOCATION")
    GEMINI_AI_MODEL = os.getenv("GEMINI_AI_MODEL")

    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    GROQ_MODEL = os.getenv("GROQ_MODEL")

    HOTLINE = os.getenv("HOTLINE")

    VNPAY_TMN_CODE = os.getenv("VNPAY_TMN_CODE")
    VNPAY_HASH_SECRET = os.getenv("VNPAY_HASH_SECRET")
    VNPAY_PAYMENT_URL = os.getenv("VNPAY_PAYMENT_URL")
    VNPAY_RETURN_URL = os.getenv("VNPAY_RETURN_URL")
    VNPAY_API_URL = os.getenv("VNPAY_API_URL")

    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

    SMTP_SERVER = os.getenv("SMTP_SERVER", "").strip() or None
    smtp_port_raw = os.getenv("SMTP_PORT")
    SMTP_PORT = int(smtp_port_raw) if smtp_port_raw is not None and smtp_port_raw.strip() else None
    SMTP_USERNAME = os.getenv("SMTP_USERNAME", "").strip() or None
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "").strip() or None
    SMTP_FROM_EMAIL = os.getenv("SMTP_FROM_EMAIL", "").strip() or None
    smtp_timeout_raw = os.getenv("SMTP_TIMEOUT", "3")
    SMTP_TIMEOUT = int(smtp_timeout_raw) if smtp_timeout_raw.strip() else 3
    RESEND_API_KEY = os.getenv("RESEND_API_KEY", "").strip() or None
    RESEND_FROM_EMAIL = os.getenv("RESEND_FROM_EMAIL", "").strip() or None
    _email_mode_raw = os.getenv("EMAIL_DELIVERY_MODE")
    if _email_mode_raw and _email_mode_raw.strip():
        EMAIL_DELIVERY_MODE = _email_mode_raw.strip().lower()
    elif APP_ENV and APP_ENV.lower() == "production":
        if RESEND_API_KEY and (RESEND_FROM_EMAIL or SMTP_FROM_EMAIL):
            EMAIL_DELIVERY_MODE = "resend"
        else:
            # On Render Cloud hosting, direct outbound SMTP ports (587/465) are blocked by firewall.
            # Fallback to "log" mode on production unless RESEND_API_KEY or EMAIL_DELIVERY_MODE is explicitly configured.
            EMAIL_DELIVERY_MODE = "log"
    else:
        EMAIL_DELIVERY_MODE = "smtp"


config = Config()
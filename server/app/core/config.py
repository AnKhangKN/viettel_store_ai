from pathlib import Path
import os
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent.parent
env_path = BASE_DIR / ".env.development"
load_dotenv(env_path)

class Config:

    APP_NAME = os.getenv("APP_NAME")

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

    HOTLINE = os.getenv("HOTLINE")

    VNPAY_TMN_CODE = os.getenv("VNPAY_TMN_CODE")
    VNPAY_HASH_SECRET = os.getenv("VNPAY_HASH_SECRET")
    VNPAY_PAYMENT_URL = os.getenv("VNPAY_PAYMENT_URL")
    VNPAY_RETURN_URL = os.getenv("VNPAY_RETURN_URL")
    VNPAY_API_URL = os.getenv("VNPAY_API_URL")


config = Config()
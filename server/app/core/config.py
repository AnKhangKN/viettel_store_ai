from pathlib import Path
import os
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent.parent

print("BASE_DIR:", BASE_DIR)

env_path = BASE_DIR / ".env.development"
print("ENV PATH:", env_path)
print("EXISTS:", env_path.exists())

load_dotenv(env_path)

print("DB_PORT =", os.getenv("DB_PORT"))


class Config:

    APP_NAME = os.getenv("APP_NAME")

    APP_ENV = os.getenv("APP_ENV")

    APP_PORT = int(os.getenv("APP_PORT", 8000))

    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = int(os.getenv("DB_PORT"))
    DB_NAME = os.getenv("DB_NAME")
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")

    JWT_SECRET = os.getenv("JWT_SECRET")
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
    JWT_EXPIRE_HOURS = int(os.getenv("JWT_EXPIRE_HOURS"))

    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    AI_MODEL = os.getenv("AI_MODEL")

    HOTLINE = os.getenv("HOTLINE")


config = Config()
# pyrefly: ignore [missing-import]
import asyncpg
from app.core.config import Config

pool: asyncpg.Pool | None = None


async def connect() -> None:

    global pool

    pool = await asyncpg.create_pool(
        host=Config.DB_HOST,
        port=Config.DB_PORT,
        user=Config.DB_USER,
        password=Config.DB_PASSWORD,
        database=Config.DB_NAME,
    )


async def disconnect() -> None:

    global pool

    if pool:
        await pool.close()
        pool = None


def get_pool() -> asyncpg.Pool:
    if pool is None:
        raise RuntimeError("Database pool is not initialized")
    return pool
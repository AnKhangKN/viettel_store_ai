import asyncpg
from app.core.config import Config
pool = None

async def connect():

    global pool

    pool = await asyncpg.create_pool(
        host=Config.DB_HOST,
        port=Config.DB_PORT,
        user=Config.DB_USER,
        password=Config.DB_PASSWORD,
        database=Config.DB_NAME,
    )

async def disconnect():

    global pool

    if pool:
        await pool.close()
        pool = None
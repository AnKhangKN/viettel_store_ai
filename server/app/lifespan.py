from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.database import connect, disconnect, get_pool

@asynccontextmanager
async def lifespan(app: FastAPI):

    print("Connecting Database...")
    await connect()

    yield

    print("Closing Database...")
    await disconnect()

# app/main.py

# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware

from app.core.error_handler import register_exception_handlers

from app.lifespan import lifespan
from app.routers import api_router

app = FastAPI(
    title="Viettel Store AI",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký router
app.include_router(api_router)

register_exception_handlers(app)


@app.get("/")
async def root():
    return {
        "message": "Viettel Store AI API"
    }
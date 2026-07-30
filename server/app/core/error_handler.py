from typing import Any
# pyrefly: ignore [missing-import]
from fastapi import Request, FastAPI
# pyrefly: ignore [missing-import]
from fastapi.responses import JSONResponse

from app.core.exceptions import AppException


def register_exception_handlers(app: FastAPI):

    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        content: dict[str, Any] = {
            "success": False,
            "message": exc.message,
        }
        if exc.details:
            content["details"] = exc.details
        return JSONResponse(
            status_code=exc.status_code,
            content=content,
        )


    @app.exception_handler(Exception)
    async def unknown_exception_handler(request: Request, exc: Exception):
        print(exc)

        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "Internal Server Error",
            },
        )
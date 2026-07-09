from fastapi import APIRouter

from app.modules.auth.controllers.auth_controller import AuthController

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

router.post("/login")(AuthController.login)
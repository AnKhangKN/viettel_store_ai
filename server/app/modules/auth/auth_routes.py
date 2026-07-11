from fastapi import APIRouter

from app.modules.auth.controllers.auth_controller import AuthController

class AuthRoutes:
    def __init__(self):
        self.router = APIRouter(
            prefix="/auth",
            tags=["Auth"]
        )

        self.router.post("/register")(AuthController().register)
        self.router.post("/login")(AuthController().login)
        self.router.post("/logout")(AuthController().logout)
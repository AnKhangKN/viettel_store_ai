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
        self.router.post("/google-login")(AuthController().google_login)
        self.router.post("/verify-otp")(AuthController().verify_otp)
        self.router.post("/resend-otp")(AuthController().resend_otp)
        self.router.post("/forgot-password")(AuthController().forgot_password)
        self.router.post("/reset-password")(AuthController().reset_password)
        self.router.delete("/logout")(AuthController().logout)
        self.router.get("/me")(AuthController().me)
        self.router.post("/refresh-token")(AuthController().refresh_token)
from fastapi import Response, Depends, Cookie
from app.modules.auth.schemas.register_request import RegisterRequest
from app.modules.auth.schemas.login_request import LoginRequest
from app.modules.auth.schemas.google_login_request import GoogleLoginRequest
from app.modules.auth.schemas.verify_otp_request import VerifyOtpRequest
from app.modules.auth.schemas.resend_otp_request import ResendOtpRequest
from app.modules.auth.schemas.forgot_password_request import ForgotPasswordRequest
from app.modules.auth.schemas.reset_password_request import ResetPasswordRequest
from app.modules.auth.services.auth_service import AuthService
from app.common.dependencies.user_dependency import get_current_user

class AuthController:

    def __init__(self):
        self.auth_service = AuthService()

    async def register(self, body: RegisterRequest):
        result = await self.auth_service.register(body)
        return result

    async def login(self, body: LoginRequest, response: Response):
        result = await self.auth_service.login(body, response)
        return result

    async def google_login(self, body: GoogleLoginRequest, response: Response):
        result = await self.auth_service.google_login(body, response)
        return result

    async def verify_otp(self, body: VerifyOtpRequest):
        return await self.auth_service.verify_otp(body)

    async def resend_otp(self, body: ResendOtpRequest):
        return await self.auth_service.resend_otp(body)

    async def forgot_password(self, body: ForgotPasswordRequest):
        return await self.auth_service.forgot_password(body)

    async def reset_password(self, body: ResetPasswordRequest):
        return await self.auth_service.reset_password(body)

    async def logout(self, response: Response):
        result = await self.auth_service.logout(response)
        return result

    async def me(self, current_user: dict = Depends(get_current_user)):
        return await self.auth_service.get_current_user_info(current_user)

    async def refresh_token(self, response: Response, refreshToken: str | None = Cookie(None, alias="refreshToken")):
        return await self.auth_service.refresh_token(refreshToken, response)


        
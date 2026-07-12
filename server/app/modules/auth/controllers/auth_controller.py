from fastapi import Response, Depends, Cookie
from app.modules.auth.schemas.register_request import RegisterRequest
from app.modules.auth.schemas.login_request import LoginRequest
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

    async def logout(self, response: Response):
        result = await self.auth_service.logout(response)
        return result

    async def me(self, current_user: dict = Depends(get_current_user)):
        return await self.auth_service.get_current_user_info(current_user)

    async def refresh_token(self, response: Response, refreshToken: str | None = Cookie(None, alias="refreshToken")):
        return await self.auth_service.refresh_token(refreshToken, response)
        
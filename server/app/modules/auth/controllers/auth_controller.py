
from fastapi import Response
from app.modules.auth.schemas.register_request import RegisterRequest
from app.modules.auth.schemas.login_request import LoginRequest
from app.modules.auth.services.auth_service import AuthService

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
        
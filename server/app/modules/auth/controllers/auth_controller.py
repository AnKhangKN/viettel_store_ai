from app.modules.auth.schemas.login_request import LoginRequest
from app.modules.auth.services.auth_service import AuthService

class AuthController:

    @staticmethod
    async def login(body: LoginRequest):

        result = await AuthService.login(body)

        return result
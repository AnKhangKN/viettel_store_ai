from fastapi import HTTPException

from app.core.jwt import Jwt
from app.core.security import hash_password, verify_password

from app.modules.auth.repositories.auth_repository import AuthRepository


class AuthService:

    @staticmethod
    async def login(body):

        user = await AuthRepository.find_by_email(body.email)

        if user is None:
            raise HTTPException(
                404,
                "Email không tồn tại"
            )

        if not verify_password(
            body.password,
            user["password"]
        ):
            raise HTTPException(
                401,
                "Sai mật khẩu"
            )

        payload = {
            "userId": user["id"],
            "role": user["role"]
        }

        access_token = Jwt.create_access_token(payload)

        refresh_token = Jwt.create_refresh_token(payload)

        return {
            "user": {
                "id": user["id"],
                "name": user["name"]
            },
            "accessToken": access_token,
            "refreshToken": refresh_token
        }
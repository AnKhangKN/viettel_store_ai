from fastapi import status, Response
from app.core.exceptions import AppException
from app.common.utils.uuid import generate_uuid7
from app.core.config import Config

from app.core.jwt import jwt_handler
from app.core.security import hash_password, verify_password
from app.modules.auth.repositories.auth_repository import AuthRepository
from app.modules.auth.schemas.register_request import RegisterRequest
from app.modules.auth.schemas.login_request import LoginRequest


class AuthService:

    def __init__(self):
        self.repository = AuthRepository()
    
    async def register(self, body: RegisterRequest):

        user = await self.repository.find_by_email(body.email)

        if user:
            raise AppException(
                status_code=status.HTTP_409_CONFLICT,
                message="Email đã tồn tại",
            )

        hashed_password = hash_password(body.password)

        id_khach_hang = generate_uuid7()

        await self.repository.create(
            id_khach_hang=id_khach_hang,
            ten_dang_nhap=body.email,
            mat_khau=hashed_password,
            ho_ten=body.name,
            email=body.email,
            so_dien_thoai=body.phone
        )

        return {
            "success": True,
            "message": "Đăng ký thành công"
        }

    async def login(self, body: LoginRequest, response: Response):

        user = await self.repository.find_by_email(body.email)

        if user is None:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Email không tồn tại"
            )

        if not verify_password(
            body.password,
            user["mat_khau"]
        ):
            raise AppException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                message="Sai mật khẩu"
            )

        payload = {
            "userId": str(user["id_khach_hang"]),
            "role": user["vai_tro"]
        }

        access_token = jwt_handler.create_access_token(payload)
        refresh_token = jwt_handler.create_refresh_token(payload)

        # Cài đặt HTTP-Only cookie cho refresh token
        is_production = Config.APP_ENV == "production"
        response.set_cookie(
            key="refreshToken",
            value=refresh_token,
            httponly=True,
            secure=is_production,
            samesite="lax" if not is_production else "none",
            max_age=7 * 24 * 60 * 60  # 7 ngày
        )

        return {
            "success": True,
            "data": {
                "user": {
                    "id": str(user["id_khach_hang"]),
                    "name": user["ho_ten"]
                },
                "accessToken": access_token,
                "refreshToken": refresh_token
            }
        }

    async def logout(self, response: Response):
        is_production = Config.APP_ENV == "production"
        
        # Xóa cookie refresh token bằng cách đặt max_age=0 và xóa giá trị
        response.delete_cookie(
            key="refreshToken",
            httponly=True,
            secure=is_production,
            samesite="lax" if not is_production else "none"
        )

        return {
            "success": True,
            "message": "Đăng xuất thành công"
        }

    
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
            "id_khach_hang": str(user["id_khach_hang"]),
            "quyen": user["vai_tro"]
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

    async def get_current_user_info(self, payload: dict):
        id_khach_hang = payload.get("id_khach_hang")
        if not id_khach_hang:
            raise AppException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Token không hợp lệ"
            )
        
        user = await self.repository.find_by_id(id_khach_hang)
        if not user:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Người dùng không tồn tại"
            )
        
        return {
            "success": True,
            "data": {
                "id": str(user["id_khach_hang"]),
                "name": user["ho_ten"],
                "email": user["email"],
                "phone": user["so_dien_thoai"],
                "role": user["vai_tro"],
                "cccd": user["cccd"],
                "dia_chi": user["dia_chi"]
            }
        }

    async def refresh_token(self, refresh_token: str | None, response: Response):
        if not refresh_token:
            raise AppException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                message="Không tìm thấy refresh token"
            )

        print("Refresh token:", refresh_token)

        res = jwt_handler.handle_refresh_token(refresh_token)
        if not res["success"]:
            raise AppException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                message=str(res.get("message", "Refresh token không hợp lệ"))
            )

        new_access_token = res["accessToken"]

        return {
            "success": True,
            "data": {
                "accessToken": new_access_token
            }
        }

    
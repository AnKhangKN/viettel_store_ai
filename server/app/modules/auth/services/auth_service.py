from fastapi import status, Response
from app.core.exceptions import AppException
from app.common.utils.uuid import generate_uuid7
from app.core.config import Config

from app.core.jwt import jwt_handler
from app.core.security import hash_password, verify_password
from app.modules.auth.repositories.auth_repository import AuthRepository
from app.modules.cskh.services.cskh_service import CSKHService
from app.modules.auth.schemas.register_request import RegisterRequest
from app.modules.auth.schemas.login_request import LoginRequest
from app.modules.auth.schemas.google_login_request import GoogleLoginRequest


class AuthService:

    def __init__(self):
        self.repository = AuthRepository()
        self.cskh_service = CSKHService()
    
    async def register(self, body: RegisterRequest):

        user = await self.repository.find_by_email(body.email)

        if user:
            raise AppException(
                status_code=status.HTTP_409_CONFLICT,
                message="Email đã tồn tại",
            )

        phone_user = await self.repository.find_by_phone(body.phone)
        if phone_user:
            raise AppException(
                status_code=status.HTTP_409_CONFLICT,
                message="Số điện thoại đã tồn tại trong hệ thống",
            )

        if self.cskh_service.is_phone_in_cskh_data(body.phone):
            raise AppException(
                status_code=status.HTTP_409_CONFLICT,
                message="Số điện thoại đã tồn tại trong file data-cskh.xlsx",
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

        user_id = str(user["id_khach_hang"])

        # Giải phóng quầy làm việc cũ (nếu có) của nhân viên trên server memory
        try:
            from app.modules.queue.services.queue_service import QueueService
            queue_service = QueueService()
            await queue_service.release_booth(user_id)
        except Exception:
            pass

        return {
            "success": True,
            "data": {
                "user": {
                    "id": user_id,
                    "name": user["ho_ten"],
                    "email": user["email"],
                    "anh_dai_dien": user["anh_dai_dien"] if "anh_dai_dien" in user else None
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
                "dia_chi": user["dia_chi"],
                "anh_dai_dien": user["anh_dai_dien"] if "anh_dai_dien" in user else None
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

    async def google_login(self, body: GoogleLoginRequest, response: Response):
        google_id = None
        email = None
        name = None
        picture = None

        if body.id_token:
            if not Config.GOOGLE_CLIENT_ID:
                raise AppException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    message="Google Client ID chưa được cấu hình trên hệ thống"
                )
            try:
                from google.oauth2 import id_token
                from google.auth.transport import requests
                id_info = id_token.verify_oauth2_token(
                    body.id_token,
                    requests.Request(),
                    Config.GOOGLE_CLIENT_ID
                )
                google_id = id_info.get("sub")
                email = id_info.get("email")
                name = id_info.get("name") or (email.split("@")[0] if email else "Google User")
                picture = id_info.get("picture")
            except Exception as e:
                raise AppException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    message=f"Xác thực Google ID Token thất bại: {str(e)}"
                )
        elif body.access_token:
            import httpx
            try:
                async with httpx.AsyncClient() as client:
                    res = await client.get(
                        "https://www.googleapis.com/oauth2/v3/userinfo",
                        headers={"Authorization": f"Bearer {body.access_token}"}
                    )
                    if res.status_code != 200:
                        raise Exception("Google UserInfo API trả về lỗi")
                    user_info = res.json()
                    google_id = user_info.get("sub")
                    email = user_info.get("email")
                    name = user_info.get("name") or (email.split("@")[0] if email else "Google User")
                    picture = user_info.get("picture")
            except Exception as e:
                raise AppException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    message=f"Xác thực Google Access Token thất bại: {str(e)}"
                )
        else:
            raise AppException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Cần cung cấp id_token hoặc access_token"
            )

        if not google_id or not email:
            raise AppException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Thông tin tài khoản Google không hợp lệ (thiếu email hoặc id)"
            )

        # 1. Tìm theo google_id
        user = await self.repository.find_by_google_id(google_id)

        # 2. Nếu chưa tìm thấy theo google_id, tìm theo email
        if user is None:
            user = await self.repository.find_by_email(email)
            if user:
                # Đã có tài khoản truyền thống -> liên kết google_id
                await self.repository.link_google_id(
                    id_khach_hang=str(user["id_khach_hang"]),
                    google_id=google_id,
                    anh_dai_dien=picture
                )
            else:
                # Chưa có tài khoản -> tạo tài khoản mới từ Google
                new_id = generate_uuid7()
                random_pass = hash_password(generate_uuid7())
                user = await self.repository.create_google_user(
                    id_khach_hang=new_id,
                    ten_dang_nhap=email,
                    mat_khau=random_pass,
                    ho_ten=name,
                    email=email,
                    google_id=google_id,
                    anh_dai_dien=picture
                )

        payload = {
            "id_khach_hang": str(user["id_khach_hang"]),
            "quyen": user["vai_tro"] if "vai_tro" in user and user["vai_tro"] else "user"
        }

        access_token = jwt_handler.create_access_token(payload)
        refresh_token = jwt_handler.create_refresh_token(payload)

        is_production = Config.APP_ENV == "production"
        response.set_cookie(
            key="refreshToken",
            value=refresh_token,
            httponly=True,
            secure=is_production,
            samesite="lax" if not is_production else "none",
            max_age=7 * 24 * 60 * 60
        )

        return {
            "success": True,
            "data": {
                "user": {
                    "id": str(user["id_khach_hang"]),
                    "name": user["ho_ten"],
                    "email": user["email"],
                    "anh_dai_dien": user["anh_dai_dien"] if "anh_dai_dien" in user else None
                },
                "accessToken": access_token,
                "refreshToken": refresh_token
            }
        }


    
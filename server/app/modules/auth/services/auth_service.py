import random
from datetime import datetime, timezone, timedelta
from fastapi import status, Response
from app.core.exceptions import AppException
from app.common.utils.uuid import generate_uuid7
from app.core.config import Config
from app.core.email import send_otp_email

from app.core.jwt import jwt_handler
from app.core.security import hash_password, verify_password
from app.modules.auth.repositories.auth_repository import AuthRepository
from app.modules.cskh.services.cskh_service import CSKHService
from app.modules.auth.schemas.register_request import RegisterRequest
from app.modules.auth.schemas.login_request import LoginRequest
from app.modules.auth.schemas.google_login_request import GoogleLoginRequest
from app.modules.auth.schemas.verify_otp_request import VerifyOtpRequest
from app.modules.auth.schemas.resend_otp_request import ResendOtpRequest
from app.modules.auth.schemas.forgot_password_request import ForgotPasswordRequest
from app.modules.auth.schemas.reset_password_request import ResetPasswordRequest

# Lưu trữ OTP trong bộ nhớ tạm (In-Memory OTP Store)
# Cấu trúc: { email: { "code": "123456", "loai": "REGISTER", "expires_at": datetime } }
_otp_store: dict[str, dict] = {}


class AuthService:

    def __init__(self):
        self.repository = AuthRepository()
        self.cskh_service = CSKHService()

    def _generate_and_store_otp(self, email: str, loai_otp: str) -> tuple[str, str]:
        otp_code = str(random.randint(100000, 999999))
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
        _otp_store[email] = {
            "code": otp_code,
            "loai": loai_otp,
            "expires_at": expires_at
        }
        # Định dạng HH:MM:SS hiển thị cho client
        expires_at_str = (expires_at + timedelta(hours=7)).strftime("%H:%M:%S")
        return otp_code, expires_at_str

    async def register(self, body: RegisterRequest):

        user = await self.repository.find_by_email(body.email)

        if user:
            # Nếu người dùng đã tồn tại nhưng chưa xác thực email, hỗ trợ cập nhật lại mật khẩu và gửi lại OTP
            if not user.get("da_xac_thuc_email") or user.get("trang_thai") == "ChoXacThuc":
                hashed_password = hash_password(body.password)
                await self.repository.update_password(body.email, hashed_password)
                otp_code, expires_at_str = self._generate_and_store_otp(body.email, "REGISTER")
                await send_otp_email(body.email, otp_code, "REGISTER")
                return {
                    "success": True,
                    "message": f"Tài khoản chưa được kích hoạt. Mã OTP mới đã được gửi về email (Hết hạn lúc: {expires_at_str}).",
                    "require_otp": True,
                    "email": body.email,
                    "expires_at_str": expires_at_str
                }

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

        otp_code, expires_at_str = self._generate_and_store_otp(body.email, "REGISTER")
        await send_otp_email(body.email, otp_code, "REGISTER")

        return {
            "success": True,
            "message": f"Đăng ký thành công! Mã OTP (10 phút) đã gửi tới Email. Hết hạn lúc: {expires_at_str}.",
            "require_otp": True,
            "email": body.email,
            "expires_at_str": expires_at_str
        }

    async def login(self, body: LoginRequest, response: Response):

        user = await self.repository.find_by_email(body.email)
        if user is None:
            user = await self.repository.find_by_phone(body.email)

        if user is None:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Tài khoản này không tồn tại trong hệ thống. Vui lòng kiểm tra lại hoặc đăng ký tài khoản mới."
            )


        if not verify_password(
            body.password,
            user["mat_khau"]
        ):
            raise AppException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                message="Sai mật khẩu"
            )

        # Kiểm tra xác thực email
        if not user.get("da_xac_thuc_email") or user.get("trang_thai") == "ChoXacThuc":
            otp_code, expires_at_str = self._generate_and_store_otp(body.email, "REGISTER")
            await send_otp_email(body.email, otp_code, "REGISTER")

            raise AppException(
                status_code=status.HTTP_403_FORBIDDEN,
                message=f"Tài khoản chưa xác thực Email. Mã OTP mới đã gửi tới Email (Hết hạn lúc: {expires_at_str}).",
                details={"require_otp": True, "email": body.email, "expires_at_str": expires_at_str}
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

    async def verify_otp(self, body: VerifyOtpRequest):
        user = await self.repository.find_by_email(body.email)
        if not user:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Không tìm thấy người dùng với Email này."
            )

        stored_data = _otp_store.get(body.email)
        if not stored_data or stored_data["code"] != body.otp or stored_data["loai"] != body.loai_otp:
            raise AppException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Mã OTP không chính xác."
            )

        if datetime.now(timezone.utc) > stored_data["expires_at"]:
            _otp_store.pop(body.email, None)
            raise AppException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Mã OTP đã hết hạn (quá 10 phút). Vui lòng bấm gửi lại mã."
            )

        if body.loai_otp == "REGISTER":
            await self.repository.activate_user_email(body.email)
            _otp_store.pop(body.email, None)
            return {
                "success": True,
                "message": "Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ."
            }
        else:
            # FORGOT_PASSWORD: Giữ OTP trong store để bước reset-password đổi mật khẩu
            return {
                "success": True,
                "message": "Xác thực OTP thành công. Vui lòng nhập mật khẩu mới."
            }

    async def resend_otp(self, body: ResendOtpRequest):
        user = await self.repository.find_by_email(body.email)
        if not user:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Không tìm thấy người dùng với Email này."
            )

        otp_code, expires_at_str = self._generate_and_store_otp(body.email, body.loai_otp)
        await send_otp_email(body.email, otp_code, body.loai_otp)

        return {
            "success": True,
            "message": f"Mã OTP mới (10 phút) đã gửi về email {body.email}. Hết hạn lúc: {expires_at_str}.",
            "expires_at_str": expires_at_str
        }

    async def forgot_password(self, body: ForgotPasswordRequest):
        user = await self.repository.find_by_email(body.email)
        if not user:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Email này chưa được đăng ký trong hệ thống."
            )

        otp_code, expires_at_str = self._generate_and_store_otp(body.email, "FORGOT_PASSWORD")
        await send_otp_email(body.email, otp_code, "FORGOT_PASSWORD")

        return {
            "success": True,
            "message": f"Mã OTP khôi phục mật khẩu (10 phút) đã gửi tới email. Hết hạn lúc: {expires_at_str}.",
            "expires_at_str": expires_at_str
        }

    async def reset_password(self, body: ResetPasswordRequest):
        user = await self.repository.find_by_email(body.email)
        if not user:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Email này chưa được đăng ký trong hệ thống."
            )

        stored_data = _otp_store.get(body.email)
        if not stored_data or stored_data["code"] != body.otp or stored_data["loai"] != "FORGOT_PASSWORD":
            raise AppException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Mã OTP không hợp lệ hoặc đã hết hạn."
            )

        if datetime.now(timezone.utc) > stored_data["expires_at"]:
            _otp_store.pop(body.email, None)
            raise AppException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Mã OTP đã hết hạn (quá 10 phút). Vui lòng yêu cầu gửi lại mã."
            )

        new_hashed_password = hash_password(body.new_password)
        await self.repository.update_password(body.email, new_hashed_password)
        _otp_store.pop(body.email, None)

        return {
            "success": True,
            "message": "Đổi mật khẩu thành công! Vui lòng đăng nhập bằng mật khẩu mới."
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
        is_production = Config.APP_ENV == "production"

        if not refresh_token:
            response.delete_cookie(
                key="refreshToken",
                httponly=True,
                secure=is_production,
                samesite="lax" if not is_production else "none"
            )
            raise AppException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                message="Không tìm thấy refresh token"
            )

        print("Refresh token:", refresh_token)

        res = jwt_handler.handle_refresh_token(refresh_token)
        if not res["success"]:
            response.delete_cookie(
                key="refreshToken",
                httponly=True,
                secure=is_production,
                samesite="lax" if not is_production else "none"
            )
            raise AppException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                message=str(res.get("message", "Refresh token không hợp lệ hoặc đã hết hạn"))
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


    
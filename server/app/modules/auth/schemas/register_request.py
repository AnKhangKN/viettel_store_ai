import re
from pydantic import BaseModel, EmailStr, field_validator

class RegisterRequest(BaseModel):
    name: str
    phone: str
    email: EmailStr
    password: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        name_clean = v.strip()
        if len(name_clean) < 2:
            raise ValueError("Vui lòng nhập Họ và Tên của bạn (tối thiểu 2 ký tự).")
        return name_clean



    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        phone_clean = v.strip()
        if not re.match(r"^(0[3|5|7|8|9])+([0-9]{8})$", phone_clean):
            raise ValueError("Số điện thoại không hợp lệ! Vui lòng nhập SĐT 10 chữ số chuẩn nhà mạng Việt Nam (bắt đầu bằng 03, 05, 07, 08, 09).")
        return phone_clean

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Mật khẩu phải chứa ít nhất 6 ký tự.")
        return v

    
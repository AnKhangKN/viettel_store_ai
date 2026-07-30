import re
from pydantic import BaseModel, EmailStr, Field, field_validator

class EmployeeCreateRequest(BaseModel):
    ho_ten: str = Field(..., description="Họ và tên nhân viên")
    email: EmailStr = Field(..., description="Email nhân viên")
    mat_khau: str = Field(..., description="Mật khẩu đăng nhập")
    so_dien_thoai: str = Field(..., description="Số điện thoại")
    id_chi_nhanh: str = Field(..., description="Mã chi nhánh làm việc (UUID)")
    vai_tro: str = Field("staff", description="Vai trò (staff hoặc admin)")
    trang_thai: str | None = Field("HoatDong", description="Trạng thái hoạt động")

    @field_validator("ho_ten")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v_clean = v.strip()
        if len(v_clean) < 2:
            raise ValueError("Họ và tên nhân viên phải chứa ít nhất 2 ký tự.")
        return v_clean

    @field_validator("so_dien_thoai")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        v_clean = v.strip()
        if not re.match(r"^(0[3|5|7|8|9])+([0-9]{8})$", v_clean):
            raise ValueError("Số điện thoại không hợp lệ! Vui lòng nhập SĐT 10 chữ số chuẩn nhà mạng Việt Nam (bắt đầu bằng 03, 05, 07, 08, 09).")
        return v_clean

    @field_validator("mat_khau")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Mật khẩu phải chứa ít nhất 6 ký tự.")
        return v


class EmployeeApproveRequest(BaseModel):
    trang_thai: str = Field(..., description="Trạng thái duyệt ('HoatDong', 'Khoa', 'ChoXacThuc')")


class AccountRoleUpdateRequest(BaseModel):
    vai_tro: str = Field(..., description="Vai trò mới ('admin', 'staff', 'user')")
    id_chi_nhanh: str | None = Field(None, description="Mã chi nhánh (bắt buộc nếu vai_tro là 'staff')")


class UserProfileUpdateRequest(BaseModel):
    ho_ten: str = Field(..., description="Họ và tên")
    so_dien_thoai: str = Field(..., description="Số điện thoại")
    email: EmailStr | None = Field(None, description="Email mới")
    cccd: str | None = Field(None, description="Số CCCD/CMND")
    dia_chi: str | None = Field(None, description="Địa chỉ giao hàng")

    @field_validator("ho_ten")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v_clean = v.strip()
        if len(v_clean) < 2:
            raise ValueError("Họ và tên phải chứa ít nhất 2 ký tự.")
        return v_clean

    @field_validator("so_dien_thoai")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        v_clean = v.strip()
        if v_clean and not re.match(r"^(0[3|5|7|8|9])+([0-9]{8})$", v_clean):
            raise ValueError("Số điện thoại không hợp lệ! Vui lòng nhập SĐT 10 chữ số chuẩn nhà mạng Việt Nam (bắt đầu bằng 03, 05, 07, 08, 09).")
        return v_clean

    @field_validator("cccd")
    @classmethod
    def validate_cccd(cls, v: str | None) -> str | None:
        if v is None:
            return None
        v_clean = v.strip()
        if not v_clean:
            return None
        if not re.match(r"^[0-9]{12}$", v_clean):
            raise ValueError("Số CCCD không hợp lệ! Số CCCD phải chứa đúng 12 chữ số.")
        return v_clean


class StaffProfileUpdateRequest(BaseModel):
    ho_ten: str = Field(..., description="Họ và tên nhân viên")
    so_dien_thoai: str = Field(..., description="Số điện thoại")
    cccd: str | None = Field(None, description="Số CCCD/CMND")
    dia_chi: str | None = Field(None, description="Địa chỉ thường trú")
    gioi_tinh: str | None = Field(None, description="Giới tính ('Nam', 'Nữ', 'Khác')")
    ngay_sinh: str | None = Field(None, description="Ngày sinh (YYYY-MM-DD)")

    @field_validator("ho_ten")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v_clean = v.strip()
        if len(v_clean) < 2:
            raise ValueError("Họ và tên phải chứa ít nhất 2 ký tự.")
        return v_clean

    @field_validator("so_dien_thoai")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        v_clean = v.strip()
        if v_clean and not re.match(r"^(0[3|5|7|8|9])+([0-9]{8})$", v_clean):
            raise ValueError("Số điện thoại không hợp lệ! Vui lòng nhập SĐT 10 chữ số chuẩn nhà mạng Việt Nam (bắt đầu bằng 03, 05, 07, 08, 09).")
        return v_clean

    @field_validator("cccd")
    @classmethod
    def validate_cccd(cls, v: str | None) -> str | None:
        if v is None:
            return None
        v_clean = v.strip()
        if not v_clean:
            return None
        if not re.match(r"^[0-9]{12}$", v_clean):
            raise ValueError("Số CCCD không hợp lệ! Số CCCD phải chứa đúng 12 chữ số.")
        return v_clean


class ChangePasswordRequest(BaseModel):
    mat_khau_cu: str = Field(..., description="Mật khẩu hiện tại")
    mat_khau_moi: str = Field(..., description="Mật khẩu mới")

    @field_validator("mat_khau_moi")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Mật khẩu mới phải chứa ít nhất 6 ký tự.")
        return v



from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class EmployeeCreateRequest(BaseModel):
    ho_ten: str = Field(..., description="Họ và tên nhân viên")
    email: EmailStr = Field(..., description="Email nhân viên")
    mat_khau: str = Field(..., description="Mật khẩu đăng nhập")
    so_dien_thoai: str = Field(..., description="Số điện thoại")
    id_chi_nhanh: str = Field(..., description="Mã chi nhánh làm việc (UUID)")
    vai_tro: str = Field("staff", description="Vai trò (staff hoặc admin)")
    trang_thai: Optional[str] = Field("HoatDong", description="Trạng thái hoạt động")

class EmployeeApproveRequest(BaseModel):
    trang_thai: str = Field(..., description="Trạng thái duyệt ('HoatDong', 'Khoa', 'ChoXacThuc')")

class AccountRoleUpdateRequest(BaseModel):
    vai_tro: str = Field(..., description="Vai trò mới ('admin', 'staff', 'user')")
    id_chi_nhanh: Optional[str] = Field(None, description="Mã chi nhánh (bắt buộc nếu vai_tro là 'staff')")

class UserProfileUpdateRequest(BaseModel):
    ho_ten: str = Field(..., description="Họ và tên")
    so_dien_thoai: str = Field(..., description="Số điện thoại")
    cccd: Optional[str] = Field(None, description="Số CCCD/CMND")
    dia_chi: Optional[str] = Field(None, description="Địa chỉ giao hàng")

class StaffProfileUpdateRequest(BaseModel):
    ho_ten: str = Field(..., description="Họ và tên nhân viên")
    so_dien_thoai: str = Field(..., description="Số điện thoại")
    cccd: Optional[str] = Field(None, description="Số CCCD/CMND")
    dia_chi: Optional[str] = Field(None, description="Địa chỉ thường trú")
    gioi_tinh: Optional[str] = Field(None, description="Giới tính ('Nam', 'Nữ', 'Khác')")
    ngay_sinh: Optional[str] = Field(None, description="Ngày sinh (YYYY-MM-DD)")


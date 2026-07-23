from pydantic import BaseModel, Field
from typing import Optional

class BoothSelectRequest(BaseModel):
    ten_quay: str = Field(..., description="Tên quầy (Ví dụ: 'Quầy 1', 'Quầy 2')")

class BoothReleaseRequest(BaseModel):
    ten_quay: Optional[str] = Field(None, description="Tên quầy muốn giải phóng.")

class BoothAdminCreateRequest(BaseModel):
    id_chi_nhanh: str = Field(..., description="ID Chi nhánh quầy trực thuộc")
    so_quay: int = Field(..., gt=0, description="Số thứ tự quầy (Ví dụ: 1, 2, 3...)")
    ten_quay: str = Field(..., description="Tên hiển thị quầy (Ví dụ: 'Quầy 1 - Đổi Sim & Gói cước')")
    mo_ta: Optional[str] = Field(None, description="Mô tả / vị trí quầy trong cửa hàng")
    trang_thai: Optional[str] = Field("HoatDong", description="Trạng thái: 'HoatDong' | 'TamNgung' | 'NgungHoatDong'")

class BoothAdminUpdateRequest(BaseModel):
    id_chi_nhanh: Optional[str] = Field(None, description="ID Chi nhánh (nếu đổi chi nhánh)")
    so_quay: Optional[int] = Field(None, gt=0, description="Số thứ tự quầy")
    ten_quay: Optional[str] = Field(None, description="Tên hiển thị quầy")
    mo_ta: Optional[str] = Field(None, description="Mô tả / vị trí quầy")
    trang_thai: Optional[str] = Field(None, description="Trạng thái quầy")

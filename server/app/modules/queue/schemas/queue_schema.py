from pydantic import BaseModel, Field
from typing import Optional

class ServiceCreateRequest(BaseModel):
    ten_giao_dich: str = Field(..., min_length=1, max_length=150, description="Tên loại giao dịch tại quầy")
    mo_ta: Optional[str] = Field(None, description="Mô tả chi tiết về loại giao dịch")
    thoi_gian_xu_ly_trung_binh: int = Field(..., ge=0, description="Thời gian xử lý trung bình tính bằng phút")
    trang_thai: Optional[str] = Field("HoatDong", description="Trạng thái (HoatDong, NgungApDung)")

class ServiceUpdateRequest(BaseModel):
    ten_giao_dich: Optional[str] = Field(None, min_length=1, max_length=150, description="Tên loại giao dịch")
    mo_ta: Optional[str] = Field(None, description="Mô tả chi tiết")
    thoi_gian_xu_ly_trung_binh: Optional[int] = Field(None, ge=0, description="Thời gian xử lý trung bình")
    trang_thai: Optional[str] = Field(None, description="Trạng thái (HoatDong, NgungApDung)")

class QueueTicketCreateRequest(BaseModel):
    ho_ten: str = Field(..., min_length=1, max_length=100, description="Họ và tên khách hàng")
    so_dien_thoai: str = Field(..., min_length=10, max_length=15, description="Số điện thoại khách hàng")
    id_chi_nhanh: str = Field(..., description="ID chi nhánh (UUID)")
    id_loai_giao_dich: str = Field(..., description="ID loại giao dịch (UUID)")

class TicketStatusUpdateRequest(BaseModel):
    trang_thai: str = Field(..., min_length=1, description="Trạng thái mới của phiếu (ChoXuLy, DangPhucVu, HoanThanh, DaHuy)")


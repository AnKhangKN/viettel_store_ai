from pydantic import BaseModel, Field
from typing import Optional

class PackageCreateRequest(BaseModel):
    ten_goi: str = Field(..., description="Tên gói cước Viettel")
    mo_ta: Optional[str] = Field(None, description="Mô tả gói cước")
    gia_cuoc: Optional[float] = Field(0.0, description="Giá cước gói (mặc định 0.0 do để tham khảo)", ge=0)
    dung_luong_gb: float = Field(..., description="Dung lượng Data (GB)", ge=0)
    thoi_han_ngay: Optional[int] = Field(30, description="Thời hạn sử dụng tính bằng ngày", gt=0)
    so_phut_goi: Optional[int] = Field(0, description="Số phút gọi nội mạng/ngoại mạng miễn phí", ge=0)
    so_sms: Optional[int] = Field(0, description="Số tin nhắn SMS miễn phí", ge=0)
    trang_thai: Optional[str] = Field("DangApDung", description="Trạng thái áp dụng (DangApDung, NgungApDung)")

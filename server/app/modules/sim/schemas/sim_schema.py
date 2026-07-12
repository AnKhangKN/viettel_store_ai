from pydantic import BaseModel, Field
from typing import Optional

class SimCreateRequest(BaseModel):
    so_sim: str = Field(..., description="Số thuê bao SIM")
    id_loai_sim: str = Field(..., description="ID loại SIM (UUID)")
    id_chi_nhanh: str = Field(..., description="ID chi nhánh sở hữu SIM (UUID)")
    gia_ban: float = Field(..., description="Giá bán SIM", ge=0)
    trang_thai: Optional[str] = Field("ConHang", description="Trạng thái SIM (ConHang, DaBan, DaDat, NgungKinhDoanh)")

class LoaiSimCreateRequest(BaseModel):
    ten_loai_sim: str = Field(..., description="Tên loại SIM (Ví dụ: Trả trước, Trả sau)")
    mo_ta: Optional[str] = Field(None, description="Mô tả chi tiết loại SIM")
    trang_thai: Optional[str] = Field("DangBan", description="Trạng thái bán (DangBan, TamNgung, NgungKinhDoanh)")


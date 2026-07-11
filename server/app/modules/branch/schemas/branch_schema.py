from pydantic import BaseModel, Field
from typing import Optional

class BranchCreateRequest(BaseModel):
    dia_chi: str = Field(..., description="Địa chỉ của chi nhánh")
    ten_chi_nhanh: Optional[str] = Field(None, description="Tên chi nhánh (tự động sinh nếu trống)")
    so_hotline: Optional[str] = Field(None, description="Số hotline (tự động sinh nếu trống)")
    gio_lam_viec: Optional[str] = Field("08:00 - 22:00", description="Giờ làm việc")

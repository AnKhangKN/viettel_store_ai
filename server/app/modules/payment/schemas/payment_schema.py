from typing import Optional
from pydantic import BaseModel, Field, field_validator
from uuid import UUID


class CreateSimOrderRequest(BaseModel):
    id_sim: UUID | str = Field(..., description="ID của SIM cần mua")
    id_chi_nhanh: UUID | str = Field(..., description="ID chi nhánh nhận SIM và kích hoạt")
    id_khach_hang: UUID | str | None = Field(None, description="ID khách hàng (nếu đã đăng nhập)")
    ho_ten: str | None = Field(None, description="Họ tên người mua")
    so_dien_thoai: str | None = Field(None, description="Số điện thoại người mua")
    cccd: str | None = Field(None, description="Số CCCD/CMND người mua")
    email: str | None = Field(None, description="Email người mua")
    dia_chi: str | None = Field(None, description="Địa chỉ người mua")
    phuong_thuc: str | None = Field("VNPay", description="Phương thức thanh toán: VNPay hoặc TienMat")

    @field_validator("id_sim", "id_chi_nhanh", "id_khach_hang", mode="before")
    def parse_uuid_fields(cls, v):
        if v == "" or v is None:
            return None
        if isinstance(v, str):
            v = v.strip()
            if not v:
                return None
            try:
                return UUID(v)
            except Exception:
                return v
        return v


class CreateSimPaymentRequest(BaseModel):
    id_don_hang: UUID | str = Field(..., description="ID của đơn hàng SIM cần thanh toán")
    bank_code: Optional[str] = Field(None, description="Mã ngân hàng (NCB, VNPAYQR, VISA... tùy chọn)")

    @field_validator("id_don_hang", mode="before")
    def parse_uuid_fields(cls, v):
        if isinstance(v, str):
            v = v.strip()
            try:
                return UUID(v)
            except Exception:
                return v
        return v


class PaymentUrlResponse(BaseModel):
    payment_url: str = Field(..., description="URL chuyển hướng người dùng tới cổng thanh toán VNPay")
    id_thanh_toan: UUID = Field(..., description="Mã bản ghi thanh toán")


class VNPayCallbackResponse(BaseModel):
    success: bool
    message: str
    id_don_hang: Optional[str] = None
    ma_giao_dich: Optional[str] = None
    so_tien: Optional[float] = None

from typing import Optional
from pydantic import BaseModel, Field
from uuid import UUID


class CreateSimOrderRequest(BaseModel):
    id_sim: UUID = Field(..., description="ID của SIM cần mua")
    id_khach_hang: Optional[UUID] = Field(None, description="ID khách hàng (nếu đã đăng nhập)")
    ho_ten: Optional[str] = Field(None, description="Họ tên người mua")
    so_dien_thoai: Optional[str] = Field(None, description="Số điện thoại người mua")
    cccd: Optional[str] = Field(None, description="Số CCCD/CMND người mua")
    email: Optional[str] = Field(None, description="Email người mua")
    dia_chi: Optional[str] = Field(None, description="Địa chỉ người mua")
    phuong_thuc: Optional[str] = Field("VNPay", description="Phương thức thanh toán: VNPay hoặc TienMat")


class CreateSimPaymentRequest(BaseModel):
    id_don_hang: UUID = Field(..., description="ID của đơn hàng SIM cần thanh toán")
    bank_code: Optional[str] = Field(None, description="Mã ngân hàng (NCB, VNPAYQR, VISA... tùy chọn)")


class PaymentUrlResponse(BaseModel):
    payment_url: str = Field(..., description="URL chuyển hướng người dùng tới cổng thanh toán VNPay")
    id_thanh_toan: UUID = Field(..., description="Mã bản ghi thanh toán")


class VNPayCallbackResponse(BaseModel):
    success: bool
    message: str
    id_don_hang: Optional[str] = None
    ma_giao_dich: Optional[str] = None
    so_tien: Optional[float] = None

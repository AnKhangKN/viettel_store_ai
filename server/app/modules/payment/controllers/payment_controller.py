from fastapi import Request, Depends
from app.modules.payment.schemas.payment_schema import CreateSimPaymentRequest, CreateSimOrderRequest
from app.modules.payment.services.payment_service import PaymentService
from app.common.dependencies.staff_dependency import get_current_staff


class PaymentController:

    def __init__(self):
        self.service = PaymentService()

    async def create_sim_order(self, body: CreateSimOrderRequest):
        res = await self.service.create_sim_order(
            id_sim=body.id_sim,
            id_khach_hang=body.id_khach_hang,
            ho_ten=body.ho_ten,
            so_dien_thoai=body.so_dien_thoai,
            cccd=body.cccd,
            email=body.email,
            dia_chi=body.dia_chi,
            phuong_thuc=body.phuong_thuc or "VNPay"
        )
        return {
            "success": True,
            "data": res
        }

    async def create_sim_payment(self, body: CreateSimPaymentRequest, request: Request):
        client_ip = request.client.host if request.client else "127.0.0.1"
        res = await self.service.create_sim_payment_url(
            id_don_hang=body.id_don_hang,
            client_ip=client_ip,
            bank_code=body.bank_code
        )
        return {
            "success": True,
            "data": res
        }

    async def vnpay_return(self, request: Request):
        params = dict(request.query_params)
        res = await self.service.process_vnpay_return(params)
        return {
            "success": res.get("success", False),
            "data": res
        }

    async def vnpay_ipn(self, request: Request):
        params = dict(request.query_params)
        result = await self.service.process_vnpay_ipn(params)
        return result

    async def confirm_received(self, id_thanh_toan: str):
        from uuid import UUID
        return await self.service.confirm_payment_received(UUID(id_thanh_toan))

    async def get_staff_sim_orders(self, current_user: dict = Depends(get_current_staff)):
        staff_id = current_user.get("id_khach_hang") or current_user.get("sub")
        res = await self.service.get_staff_sim_orders(str(staff_id))
        return {
            "success": True,
            "data": res
        }

    async def confirm_staff_sim_received(self, id_don_hang: str, current_user: dict = Depends(get_current_staff)):
        from uuid import UUID
        res = await self.service.confirm_staff_sim_received(UUID(id_don_hang))
        return {
            "success": True,
            "message": res.get("message", "Đã xác nhận giao SIM thành công!")
        }

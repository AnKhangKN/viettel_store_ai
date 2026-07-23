from datetime import datetime
from typing import Dict, Any, Optional
from uuid import UUID, uuid4

from app.core.config import config
from app.core.exceptions import AppException
from app.common.vnpay_helper import VNPayHelper
from app.modules.payment.repositories.payment_repository import PaymentRepository


class PaymentService:

    def __init__(self):
        self.repository = PaymentRepository()

    async def create_sim_order(
        self,
        id_sim: UUID,
        id_chi_nhanh: UUID,
        id_khach_hang: Optional[UUID] = None,
        ho_ten: Optional[str] = None,
        so_dien_thoai: Optional[str] = None,
        cccd: Optional[str] = None,
        email: Optional[str] = None,
        dia_chi: Optional[str] = None,
        phuong_thuc: str = "VNPay"
    ) -> Dict[str, Any]:
        try:
            return await self.repository.create_sim_order(
                id_sim=id_sim,
                id_chi_nhanh=id_chi_nhanh,
                id_khach_hang=id_khach_hang,
                ho_ten=ho_ten,
                so_dien_thoai=so_dien_thoai,
                cccd=cccd,
                email=email,
                dia_chi=dia_chi,
                phuong_thuc=phuong_thuc
            )
        except ValueError as e:
            raise AppException(400, str(e))

    async def create_sim_payment_url(
        self,
        id_don_hang: UUID,
        client_ip: str,
        bank_code: Optional[str] = None
    ) -> Dict[str, Any]:
        # 1. Kiểm tra đơn hàng SIM
        order = await self.repository.get_don_hang_sim_by_id(id_don_hang)
        if not order:
            raise AppException(404, "Đơn hàng SIM không tồn tại")

        if order["trang_thai"] == "DaThanhToan":
            raise AppException(400, "Đơn hàng này đã được thanh toán trước đó")
        if order["trang_thai"] == "DaHuy":
            raise AppException(400, "Đơn hàng này đã bị hủy, không thể thanh toán")

        # 2. Kiểm tra hoặc tạo bản ghi thanh toán
        payment = await self.repository.get_payment_by_order_id(id_don_hang)
        if payment:
            if payment["trang_thai"] == "ThanhCong":
                raise AppException(400, "Đơn hàng đã có giao dịch thanh toán thành công")
            id_thanh_toan = payment["id_thanh_toan"]
        else:
            id_thanh_toan = uuid4()
            so_tien = float(order["tong_tien"])
            await self.repository.create_payment(
                id_thanh_toan=id_thanh_toan,
                id_don_hang=id_don_hang,
                so_tien=so_tien,
                phuong_thuc="VNPay"
            )

        # 3. Chuẩn bị tham số VNPay
        create_date = datetime.now().strftime("%Y%m%d%H%M%S")
        amount = int(float(order["tong_tien"]) * 100)
        order_details = await self.repository.get_sim_order_details(id_don_hang)
        so_sim = order_details.get("so_sim", "") if order_details else ""
        order_info = f"Thanh toan mua SIM {so_sim} DH {str(id_don_hang)[:8]}" if so_sim else f"Thanh toan don hang SIM DH {str(id_don_hang)[:8]}"

        vnp_params = {
            "vnp_Version": "2.1.0",
            "vnp_Command": "pay",
            "vnp_TmnCode": config.VNPAY_TMN_CODE,
            "vnp_Amount": amount,
            "vnp_CreateDate": create_date,
            "vnp_CurrCode": "VND",
            "vnp_IpAddr": client_ip or "127.0.0.1",
            "vnp_Locale": "vn",
            "vnp_OrderInfo": order_info,
            "vnp_OrderType": "other",
            "vnp_ReturnUrl": config.VNPAY_RETURN_URL,
            "vnp_TxnRef": str(id_thanh_toan),
        }

        if bank_code:
            vnp_params["vnp_BankCode"] = bank_code

        payment_url = VNPayHelper.generate_payment_url(
            payment_url=config.VNPAY_PAYMENT_URL,  # type: ignore
            secret_key=config.VNPAY_HASH_SECRET,  # type: ignore
            params=vnp_params
        )

        return {
            "payment_url": payment_url,
            "id_thanh_toan": id_thanh_toan
        }

    async def process_vnpay_return(self, params: Dict[str, Any]) -> Dict[str, Any]:
        # 1. Xác thực chữ ký checksum
        is_valid = VNPayHelper.validate_response(config.VNPAY_HASH_SECRET, params)  # type: ignore
        if not is_valid:
            raise AppException(400, "Chữ ký mã hóa VNPay không hợp lệ")

        txn_ref = params.get("vnp_TxnRef")
        if not txn_ref:
            raise AppException(400, "Thiếu thông tin mã giao dịch vnp_TxnRef")

        try:
            id_thanh_toan = UUID(txn_ref)
        except ValueError:
            raise AppException(400, "Mã giao dịch vnp_TxnRef không đúng định dạng UUID")

        payment = await self.repository.get_payment_by_id(id_thanh_toan)
        if not payment:
            raise AppException(404, "Không tìm thấy thông tin bản ghi thanh toán")

        response_code = params.get("vnp_ResponseCode")
        transaction_no = params.get("vnp_TransactionNo", "")

        if response_code == "00":
            if payment["trang_thai"] != "ThanhCong":
                await self.repository.update_payment_success(id_thanh_toan, transaction_no)

            order_details = await self.repository.get_sim_order_details(payment["id_don_hang"])

            return {
                "success": True,
                "message": "Thanh toán đơn hàng SIM qua VNPay thành công!",
                "id_don_hang": str(payment["id_don_hang"]),
                "ma_giao_dich": transaction_no,
                "so_tien": float(payment["so_tien"]),
                "so_sim": order_details.get("so_sim") if order_details else None,
                "chi_nhanh": {
                    "ten_chi_nhanh": order_details.get("ten_chi_nhanh") if order_details else None,
                    "dia_chi": order_details.get("dia_chi_chi_nhanh") if order_details else None,
                    "map_url": order_details.get("map_url") if order_details else None,
                } if order_details else None
            }
        else:
            await self.repository.update_payment_failed(id_thanh_toan, transaction_no)
            return {
                "success": False,
                "message": f"Giao dịch thanh toán không thành công (Mã lỗi: {response_code})",
                "id_don_hang": str(payment["id_don_hang"])
            }

    async def process_vnpay_ipn(self, params: Dict[str, Any]) -> Dict[str, str]:
        # 1. Kiểm tra chữ ký
        is_valid = VNPayHelper.validate_response(config.VNPAY_HASH_SECRET, params)  # type: ignore
        if not is_valid:
            return {"RspCode": "97", "Message": "Invalid Checksum"}

        txn_ref = params.get("vnp_TxnRef")
        if not txn_ref:
            return {"RspCode": "01", "Message": "Order not found"}

        try:
            id_thanh_toan = UUID(txn_ref)
        except ValueError:
            return {"RspCode": "01", "Message": "Order not found"}

        payment = await self.repository.get_payment_by_id(id_thanh_toan)
        if not payment:
            return {"RspCode": "01", "Message": "Order not found"}

        # 2. Kiểm tra số tiền
        vnp_amount = int(params.get("vnp_Amount", 0))
        expected_amount = int(float(payment["so_tien"]) * 100)
        if vnp_amount != expected_amount:
            return {"RspCode": "04", "Message": "Invalid Amount"}

        # 3. Kiểm tra xem đã xử lý chưa
        if payment["trang_thai"] == "ThanhCong":
            return {"RspCode": "02", "Message": "Order already confirmed"}

        # 4. Cập nhật trạng thái
        response_code = params.get("vnp_ResponseCode")
        transaction_no = params.get("vnp_TransactionNo", "")

        if response_code == "00":
            await self.repository.update_payment_success(id_thanh_toan, transaction_no)
        else:
            await self.repository.update_payment_failed(id_thanh_toan, transaction_no)

        return {"RspCode": "00", "Message": "Confirm Success"}

    async def confirm_payment_received(self, id_thanh_toan: UUID) -> Dict[str, Any]:
        payment = await self.repository.get_payment_by_id(id_thanh_toan)
        if not payment:
            raise AppException(404, "Không tìm thấy thông tin bản ghi thanh toán")
        
        res = await self.repository.mark_payment_received(id_thanh_toan)
        return {
            "success": True,
            "message": "Đã xác nhận khách hàng nhận SIM thành công tại chi nhánh!",
            "data": res
        }

    async def get_staff_sim_orders(self, staff_id_khach_hang: str) -> Dict[str, Any]:
        # 1. Tìm chi nhánh của nhân viên (Repository đã hỗ trợ tự động fallback)
        branch_row = await self.repository.get_staff_branch(staff_id_khach_hang)
        if not branch_row:
            raise AppException(404, "Nhân viên chưa được gán làm việc tại chi nhánh nào")

        id_chi_nhanh = branch_row["id_chi_nhanh"]

        # 2. Lấy danh sách đơn hàng SIM
        rows = await self.repository.get_sim_orders_by_branch(id_chi_nhanh)
        orders = []
        for r in rows:
            gia_sim = float(r["gia_sim"])
            orders.append({
                "id_don_hang": str(r["id_don_hang"]),
                "loai_don_hang": "Đơn Mua SIM Số Đẹp",
                "tong_tien": float(r["tong_tien"]),
                "trang_thai_don_hang": r["trang_thai_don_hang"],
                "ngay_dat_hang": r["ngay_dat_hang"].isoformat() if r["ngay_dat_hang"] else None,
                "san_pham": [
                    {
                        "ten": f"SIM Số Đẹp Viettel: {r['so_sim']}",
                        "loai": r["ten_loai_sim"] or "SIM Số Đẹp",
                        "don_gia": gia_sim,
                        "so_luong": 1
                    },
                    {
                        "ten": "Phí hòa mạng & kích hoạt SIM",
                        "loai": "Dịch vụ mạng Viettel",
                        "don_gia": 50000.0,
                        "so_luong": 1
                    }
                ],
                "sim": {
                    "id_sim": str(r["id_sim"]),
                    "so_sim": r["so_sim"],
                    "gia_sim": gia_sim,
                    "ten_loai_sim": r["ten_loai_sim"] or "SIM thường"
                },
                "khach_hang": {
                    "id_khach_hang": str(r["id_khach_hang"]) if r["id_khach_hang"] else None,
                    "ho_ten": r["ho_ten"] or "Khách mua tại web",
                    "so_dien_thoai": r["so_dien_thoai"] or "Chưa có",
                    "email": r["email"] or "Chưa có",
                    "cccd": r["cccd"] or "Chưa bổ sung",
                    "dia_chi": r["dia_chi"] or ""
                },
                "thanh_toan": {
                    "id_thanh_toan": str(r["id_thanh_toan"]) if r["id_thanh_toan"] else None,
                    "phuong_thuc": r["phuong_thuc"] or "TienMat",
                    "trang_thai_thanh_toan": r["trang_thai_thanh_toan"] or "ChoThanhToan",
                    "ma_giao_dich": r["ma_giao_dich"] or None,
                    "da_nhan": bool(r["da_nhan"]),
                    "thoi_gian_nhan": r["thoi_gian_nhan"].isoformat() if r["thoi_gian_nhan"] else None,
                    "thoi_gian_thanh_toan": r["thoi_gian_thanh_toan"].isoformat() if r["thoi_gian_thanh_toan"] else None
                },
                "chi_nhanh": {
                    "ten_chi_nhanh": r["ten_chi_nhanh"]
                }
            })

        return {
            "id_chi_nhanh": str(id_chi_nhanh),
            "total_orders": len(orders),
            "orders": orders
        }

    async def confirm_staff_sim_received(self, id_don_hang: UUID) -> Dict[str, Any]:
        res = await self.repository.confirm_staff_sim_received(id_don_hang)
        return {
            "success": res,
            "message": "Đã xác nhận giao SIM cho khách hàng thành công!"
        }

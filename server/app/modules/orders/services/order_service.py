from typing import Dict, Any, List
from fastapi import status
from app.core.exceptions import AppException
from app.modules.orders.repositories.order_repository import OrderRepository


class OrderService:

    def __init__(self):
        self.repository = OrderRepository()

    async def get_my_orders(self, id_khach_hang: str) -> Dict[str, Any]:
        """
        Lấy danh sách các đơn hàng của khách hàng đang đăng nhập và format dữ liệu chuẩn.
        """
        rows = await self.repository.get_user_orders(id_khach_hang)
        orders = []
        for r in rows:
            gia_sim = float(r["gia_sim"]) if r["gia_sim"] else 0.0
            phi_hoa_mang = 50000.0
            tong_tien = float(r["tong_tien"]) if r["tong_tien"] else (gia_sim + phi_hoa_mang)

            orders.append({
                "id_don_hang": str(r["id_don_hang"]),
                "so_sim": r["so_sim"],
                "ten_loai_sim": r["ten_loai_sim"] or "SIM Số Đẹp",
                "gia_sim": gia_sim,
                "phi_hoa_mang": phi_hoa_mang,
                "tong_tien": tong_tien,
                "trang_thai_don_hang": r["trang_thai_don_hang"],
                "ngay_dat_hang": r["ngay_dat_hang"].isoformat() if r["ngay_dat_hang"] else None,
                "chi_nhanh": {
                    "id_chi_nhanh": str(r["id_chi_nhanh"]),
                    "ten_chi_nhanh": r["ten_chi_nhanh"],
                    "dia_chi": r["dia_chi_chi_nhanh"],
                    "hotline": r["hotline_chi_nhanh"]
                },
                "khach_hang": {
                    "ho_ten": r["ho_ten"],
                    "so_dien_thoai": r["so_dien_thoai"],
                    "email": r["email"],
                    "cccd": r["cccd"],
                    "dia_chi": r["dia_chi_khach_hang"]
                },
                "thanh_toan": {
                    "id_thanh_toan": str(r["id_thanh_toan"]) if r["id_thanh_toan"] else None,
                    "phuong_thuc": r["phuong_thuc"] or "TienMat",
                    "ma_giao_dich": r["ma_giao_dich"],
                    "trang_thai": r["trang_thai_thanh_toan"] or "ChoThanhToan",
                    "da_nhan": r["da_nhan"],
                    "thoi_gian_nhan": r["thoi_gian_nhan"].isoformat() if r["thoi_gian_nhan"] else None,
                    "thoi_gian_thanh_toan": r["thoi_gian_thanh_toan"].isoformat() if r["thoi_gian_thanh_toan"] else None
                }
            })

        return {
            "success": True,
            "data": orders
        }

    async def get_order_detail(self, id_don_hang: str, id_khach_hang: str) -> Dict[str, Any]:
        """
        Lấy thông tin chi tiết một đơn hàng cụ thể của khách hàng.
        """
        r = await self.repository.get_order_detail_by_id(id_don_hang, id_khach_hang)
        if not r:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Đơn hàng không tồn tại hoặc bạn không có quyền xem đơn hàng này."
            )

        gia_sim = float(r["gia_sim"]) if r["gia_sim"] else 0.0
        phi_hoa_mang = 50000.0
        tong_tien = float(r["tong_tien"]) if r["tong_tien"] else (gia_sim + phi_hoa_mang)

        return {
            "success": True,
            "data": {
                "id_don_hang": str(r["id_don_hang"]),
                "so_sim": r["so_sim"],
                "ten_loai_sim": r["ten_loai_sim"] or "SIM Số Đẹp",
                "gia_sim": gia_sim,
                "phi_hoa_mang": phi_hoa_mang,
                "tong_tien": tong_tien,
                "trang_thai_don_hang": r["trang_thai_don_hang"],
                "ngay_dat_hang": r["ngay_dat_hang"].isoformat() if r["ngay_dat_hang"] else None,
                "chi_nhanh": {
                    "id_chi_nhanh": str(r["id_chi_nhanh"]),
                    "ten_chi_nhanh": r["ten_chi_nhanh"],
                    "dia_chi": r["dia_chi_chi_nhanh"],
                    "hotline": r["hotline_chi_nhanh"],
                    "map_url": r.get("map_url")
                },
                "khach_hang": {
                    "ho_ten": r["ho_ten"],
                    "so_dien_thoai": r["so_dien_thoai"],
                    "email": r["email"],
                    "cccd": r["cccd"],
                    "dia_chi": r["dia_chi_khach_hang"]
                },
                "thanh_toan": {
                    "id_thanh_toan": str(r["id_thanh_toan"]) if r["id_thanh_toan"] else None,
                    "phuong_thuc": r["phuong_thuc"] or "TienMat",
                    "ma_giao_dich": r["ma_giao_dich"],
                    "trang_thai": r["trang_thai_thanh_toan"] or "ChoThanhToan",
                    "da_nhan": r["da_nhan"],
                    "thoi_gian_nhan": r["thoi_gian_nhan"].isoformat() if r["thoi_gian_nhan"] else None,
                    "thoi_gian_thanh_toan": r["thoi_gian_thanh_toan"].isoformat() if r["thoi_gian_thanh_toan"] else None
                }
            }
        }

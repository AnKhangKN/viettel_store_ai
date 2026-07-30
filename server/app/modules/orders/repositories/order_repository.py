import uuid
from typing import Optional, List, Dict, Any
from app.core.database import get_pool


class OrderRepository:

    async def get_user_orders(self, id_khach_hang: str) -> List[Dict[str, Any]]:
        """
        Lấy danh sách các đơn hàng đặt mua SIM của khách hàng theo id_khach_hang.
        """
        pool = get_pool()
        sql = """
            SELECT 
                dh.id_don_hang,
                dh.id_khach_hang,
                dh.tong_tien,
                dh.trang_thai AS trang_thai_don_hang,
                dh.ngay_dat_hang,
                s.id_sim,
                s.so_sim,
                s.gia_ban AS gia_sim,
                ls.ten_loai_sim,
                cn.id_chi_nhanh,
                cn.ten_chi_nhanh,
                cn.dia_chi AS dia_chi_chi_nhanh,
                cn.so_hotline AS hotline_chi_nhanh,
                kh.ho_ten,
                kh.so_dien_thoai,
                kh.email,
                kh.cccd,
                kh.dia_chi AS dia_chi_khach_hang,
                tt.id_thanh_toan,
                tt.phuong_thuc,
                tt.ma_giao_dich,
                tt.trang_thai AS trang_thai_thanh_toan,
                COALESCE(tt.da_nhan, false) AS da_nhan,
                tt.thoi_gian_nhan,
                tt.thoi_gian_thanh_toan
            FROM donhangsim dh
            JOIN chitietdonhang ct ON dh.id_don_hang = ct.id_don_hang
            JOIN sim s ON ct.id_sim = s.id_sim
            JOIN chinhanh cn ON dh.id_chi_nhanh = cn.id_chi_nhanh
            LEFT JOIN loaisim ls ON s.id_loai_sim = ls.id_loai_sim
            LEFT JOIN khachhang kh ON dh.id_khach_hang = kh.id_khach_hang
            LEFT JOIN thanhtoan tt ON dh.id_don_hang = tt.id_don_hang
            WHERE dh.id_khach_hang = $1 AND dh.da_xoa = false
            ORDER BY dh.ngay_dat_hang DESC
        """
        db_uuid = uuid.UUID(id_khach_hang) if isinstance(id_khach_hang, str) else id_khach_hang
        rows = await pool.fetch(sql, db_uuid)
        return [dict(r) for r in rows]

    async def get_order_detail_by_id(self, id_don_hang: str, id_khach_hang: str) -> Optional[Dict[str, Any]]:
        """
        Lấy thông tin chi tiết một đơn hàng cụ thể thuộc sở hữu của khách hàng.
        """
        pool = get_pool()
        sql = """
            SELECT 
                dh.id_don_hang,
                dh.id_khach_hang,
                dh.tong_tien,
                dh.trang_thai AS trang_thai_don_hang,
                dh.ngay_dat_hang,
                s.id_sim,
                s.so_sim,
                s.gia_ban AS gia_sim,
                ls.ten_loai_sim,
                cn.id_chi_nhanh,
                cn.ten_chi_nhanh,
                cn.dia_chi AS dia_chi_chi_nhanh,
                cn.so_hotline AS hotline_chi_nhanh,
                cn.map_url,
                kh.ho_ten,
                kh.so_dien_thoai,
                kh.email,
                kh.cccd,
                kh.dia_chi AS dia_chi_khach_hang,
                tt.id_thanh_toan,
                tt.phuong_thuc,
                tt.ma_giao_dich,
                tt.trang_thai AS trang_thai_thanh_toan,
                COALESCE(tt.da_nhan, false) AS da_nhan,
                tt.thoi_gian_nhan,
                tt.thoi_gian_thanh_toan
            FROM donhangsim dh
            JOIN chitietdonhang ct ON dh.id_don_hang = ct.id_don_hang
            JOIN sim s ON ct.id_sim = s.id_sim
            JOIN chinhanh cn ON dh.id_chi_nhanh = cn.id_chi_nhanh
            LEFT JOIN loaisim ls ON s.id_loai_sim = ls.id_loai_sim
            LEFT JOIN khachhang kh ON dh.id_khach_hang = kh.id_khach_hang
            LEFT JOIN thanhtoan tt ON dh.id_don_hang = tt.id_don_hang
            WHERE dh.id_don_hang = $1 AND dh.id_khach_hang = $2 AND dh.da_xoa = false
        """
        order_uuid = uuid.UUID(id_don_hang) if isinstance(id_don_hang, str) else id_don_hang
        user_uuid = uuid.UUID(id_khach_hang) if isinstance(id_khach_hang, str) else id_khach_hang
        row = await pool.fetchrow(sql, order_uuid, user_uuid)
        return dict(row) if row else None

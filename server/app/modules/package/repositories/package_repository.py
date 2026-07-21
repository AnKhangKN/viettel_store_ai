from typing import Optional
import uuid
from app.core.database import get_pool

class PackageRepository:

    async def create_package(
        self,
        id_goi: str,
        ten_goi: str,
        mo_ta: Optional[str],
        gia_cuoc: Optional[float],
        dung_luong_gb: float,
        thoi_han_ngay: Optional[int],
        so_phut_goi: Optional[int],
        so_sms: Optional[int],
        trang_thai: Optional[str],
        id_nguoi_tao: Optional[str] = None
    ):
        sql = """
            INSERT INTO goicuoc (
                id_goi,
                id_nguoi_tao,
                ten_goi,
                mo_ta,
                gia_cuoc,
                dung_luong_gb,
                thoi_han_ngay,
                so_phut_goi,
                so_sms,
                trang_thai
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id_goi, id_nguoi_tao, ten_goi, mo_ta, gia_cuoc, dung_luong_gb, thoi_han_ngay, so_phut_goi, so_sms, trang_thai
        """

        goi_uuid = uuid.UUID(id_goi) if isinstance(id_goi, str) else id_goi
        nguoi_tao_uuid = uuid.UUID(id_nguoi_tao) if id_nguoi_tao and isinstance(id_nguoi_tao, str) else id_nguoi_tao

        return await get_pool().fetchrow(
            sql,
            goi_uuid,
            nguoi_tao_uuid,
            ten_goi,
            mo_ta,
            gia_cuoc,
            dung_luong_gb,
            thoi_han_ngay,
            so_phut_goi,
            so_sms,
            trang_thai
        )

    async def find_by_name(self, ten_goi: str):
        sql = """
            SELECT id_goi, ten_goi
            FROM goicuoc
            WHERE ten_goi = $1 AND da_xoa = false
        """
        return await get_pool().fetchrow(sql, ten_goi)

    async def get_all_packages(self):
        sql = """
            SELECT 
                g.id_goi, 
                g.ten_goi, 
                g.gia_cuoc, 
                g.thoi_han_ngay, 
                g.dung_luong_gb, 
                g.so_phut_goi,
                g.so_sms,
                g.mo_ta,
                g.trang_thai,
                g.id_nguoi_tao,
                k.ho_ten AS ten_nguoi_tao
            FROM goicuoc g
            LEFT JOIN khachhang k ON g.id_nguoi_tao = k.id_khach_hang
            WHERE g.da_xoa = false
            ORDER BY g.ngay_tao DESC
        """
        return await get_pool().fetch(sql)

    async def get_package_by_id(self, id_goi: str):
        sql = """
            SELECT 
                g.id_goi, 
                g.ten_goi, 
                g.gia_cuoc, 
                g.thoi_han_ngay, 
                g.dung_luong_gb, 
                g.so_phut_goi,
                g.so_sms,
                g.mo_ta,
                g.trang_thai,
                g.id_nguoi_tao,
                k.ho_ten AS ten_nguoi_tao
            FROM goicuoc g
            LEFT JOIN khachhang k ON g.id_nguoi_tao = k.id_khach_hang
            WHERE g.id_goi = $1 AND g.da_xoa = false
        """
        goi_uuid = uuid.UUID(id_goi) if isinstance(id_goi, str) else id_goi
        return await get_pool().fetchrow(sql, goi_uuid)

    async def update_package(
        self,
        id_goi: str,
        ten_goi: str,
        mo_ta: Optional[str],
        gia_cuoc: Optional[float],
        dung_luong_gb: float,
        thoi_han_ngay: Optional[int],
        so_phut_goi: Optional[int],
        so_sms: Optional[int],
        trang_thai: Optional[str],
        id_nguoi_tao: Optional[str] = None
    ):
        sql = """
            UPDATE goicuoc
            SET 
                ten_goi = $2,
                mo_ta = $3,
                gia_cuoc = $4,
                dung_luong_gb = $5,
                thoi_han_ngay = $6,
                so_phut_goi = $7,
                so_sms = $8,
                trang_thai = $9,
                id_nguoi_tao = COALESCE($10, id_nguoi_tao),
                cap_nhat = CURRENT_TIMESTAMP
            WHERE id_goi = $1 AND da_xoa = false
            RETURNING id_goi, id_nguoi_tao, ten_goi, mo_ta, gia_cuoc, dung_luong_gb, thoi_han_ngay, so_phut_goi, so_sms, trang_thai
        """
        goi_uuid = uuid.UUID(id_goi) if isinstance(id_goi, str) else id_goi
        nguoi_tao_uuid = uuid.UUID(id_nguoi_tao) if id_nguoi_tao and isinstance(id_nguoi_tao, str) else id_nguoi_tao

        return await get_pool().fetchrow(
            sql,
            goi_uuid,
            ten_goi,
            mo_ta,
            gia_cuoc,
            dung_luong_gb,
            thoi_han_ngay,
            so_phut_goi,
            so_sms,
            trang_thai,
            nguoi_tao_uuid
        )


import uuid
from typing import Optional
from app.core.database import get_pool

class BranchRepository:

    async def create(
        self,
        id_chi_nhanh: str,
        ten_chi_nhanh: str,
        dia_chi: str,
        so_hotline: str,
        gio_lam_viec: str,
        map_url: Optional[str] = None
    ):
        sql = """
            INSERT INTO chinhanh (
                id_chi_nhanh,
                ten_chi_nhanh,
                dia_chi,
                so_hotline,
                gio_lam_viec,
                map_url,
                trang_thai
            )
            VALUES ($1, $2, $3, $4, $5, $6, 'HoatDong')
            RETURNING id_chi_nhanh, ten_chi_nhanh, dia_chi, so_hotline, gio_lam_viec, map_url, trang_thai
        """

        db_uuid = uuid.UUID(id_chi_nhanh) if isinstance(id_chi_nhanh, str) else id_chi_nhanh

        return await get_pool().fetchrow(
            sql,
            db_uuid,
            ten_chi_nhanh,
            dia_chi,
            so_hotline,
            gio_lam_viec,
            map_url
        )

    async def get_by_hotline(self, hotline: str):
        sql = """
            SELECT id_chi_nhanh, ten_chi_nhanh, dia_chi, so_hotline, gio_lam_viec, map_url, trang_thai
            FROM chinhanh
            WHERE so_hotline = $1 AND da_xoa = false
        """
        return await get_pool().fetchrow(sql, hotline)

    async def get_all(self):
        sql = """
            SELECT 
                id_chi_nhanh,
                ten_chi_nhanh,
                dia_chi,
                so_hotline,
                gio_lam_viec,
                map_url,
                trang_thai,
                ngay_tao
            FROM chinhanh
            WHERE da_xoa = false
            ORDER BY ngay_tao DESC
        """
        return await get_pool().fetch(sql)

    async def get_by_id(self, id_chi_nhanh: str):
        sql = """
            SELECT 
                id_chi_nhanh,
                ten_chi_nhanh,
                dia_chi,
                so_hotline,
                gio_lam_viec,
                map_url,
                trang_thai
            FROM chinhanh
            WHERE id_chi_nhanh = $1 AND da_xoa = false
        """
        db_uuid = uuid.UUID(id_chi_nhanh) if isinstance(id_chi_nhanh, str) else id_chi_nhanh
        return await get_pool().fetchrow(sql, db_uuid)

    async def update(
        self,
        id_chi_nhanh: str,
        ten_chi_nhanh: str,
        dia_chi: str,
        so_hotline: str,
        gio_lam_viec: str,
        trang_thai: str,
        map_url: Optional[str] = None
    ):
        sql = """
            UPDATE chinhanh
            SET
                ten_chi_nhanh = $2,
                dia_chi = $3,
                so_hotline = $4,
                gio_lam_viec = $5,
                trang_thai = $6,
                map_url = $7,
                cap_nhat = CURRENT_TIMESTAMP
            WHERE id_chi_nhanh = $1 AND da_xoa = false
            RETURNING id_chi_nhanh, ten_chi_nhanh, dia_chi, so_hotline, gio_lam_viec, map_url, trang_thai
        """
        db_uuid = uuid.UUID(id_chi_nhanh) if isinstance(id_chi_nhanh, str) else id_chi_nhanh
        return await get_pool().fetchrow(
            sql,
            db_uuid,
            ten_chi_nhanh,
            dia_chi,
            so_hotline,
            gio_lam_viec,
            trang_thai,
            map_url
        )

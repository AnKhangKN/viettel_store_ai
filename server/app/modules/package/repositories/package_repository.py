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
        trang_thai: Optional[str]
    ):
        sql = """
            INSERT INTO goicuoc (
                id_goi,
                ten_goi,
                mo_ta,
                gia_cuoc,
                dung_luong_gb,
                thoi_han_ngay,
                so_phut_goi,
                so_sms,
                trang_thai
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id_goi, ten_goi, mo_ta, gia_cuoc, dung_luong_gb, thoi_han_ngay, so_phut_goi, so_sms, trang_thai
        """

        goi_uuid = uuid.UUID(id_goi) if isinstance(id_goi, str) else id_goi

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
            trang_thai
        )

    async def find_by_name(self, ten_goi: str):
        sql = """
            SELECT id_goi, ten_goi
            FROM goicuoc
            WHERE ten_goi = $1 AND da_xoa = false
        """
        return await get_pool().fetchrow(sql, ten_goi)

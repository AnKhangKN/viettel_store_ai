from app.core.database import get_pool
import uuid


class AuthRepository:

    async def find_by_email(self, email: str):

        sql = """
            SELECT
                id_khach_hang,
                ten_dang_nhap,
                ho_ten,
                email,
                so_dien_thoai,
                mat_khau,
                vai_tro,
                trang_thai
            FROM khachhang
            WHERE email = $1 AND da_xoa = false
        """

        return await get_pool().fetchrow(
            sql,
            email
        )

    async def create(
        self,
        id_khach_hang: str,
        ten_dang_nhap: str,
        mat_khau: str,
        ho_ten: str,
        email: str,
        so_dien_thoai: str
    ):
        sql = """
            INSERT INTO khachhang (
                id_khach_hang,
                ten_dang_nhap,
                mat_khau,
                ho_ten,
                email,
                so_dien_thoai
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id_khach_hang
        """

        db_uuid = uuid.UUID(id_khach_hang) if isinstance(id_khach_hang, str) else id_khach_hang

        return await get_pool().fetchrow(
            sql,
            db_uuid,
            ten_dang_nhap,
            mat_khau,
            ho_ten,
            email,
            so_dien_thoai
        )

    async def find_by_id(self, id_khach_hang: str):
        sql = """
            SELECT
                id_khach_hang,
                ten_dang_nhap,
                ho_ten,
                email,
                so_dien_thoai,
                vai_tro,
                trang_thai
            FROM khachhang
            WHERE id_khach_hang = $1 AND da_xoa = false
        """
        db_uuid = uuid.UUID(id_khach_hang) if isinstance(id_khach_hang, str) else id_khach_hang
        return await get_pool().fetchrow(sql, db_uuid)

    

    
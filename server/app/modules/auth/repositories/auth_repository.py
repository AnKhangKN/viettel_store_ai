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
                trang_thai,
                google_id,
                anh_dai_dien
            FROM khachhang
            WHERE email = $1 AND da_xoa = false
        """

        return await get_pool().fetchrow(
            sql,
            email
        )

    async def find_by_google_id(self, google_id: str):
        sql = """
            SELECT
                id_khach_hang,
                ten_dang_nhap,
                ho_ten,
                email,
                so_dien_thoai,
                mat_khau,
                vai_tro,
                trang_thai,
                google_id,
                anh_dai_dien
            FROM khachhang
            WHERE google_id = $1 AND da_xoa = false
        """
        return await get_pool().fetchrow(sql, google_id)

    async def create_google_user(
        self,
        id_khach_hang: str,
        ten_dang_nhap: str,
        mat_khau: str,
        ho_ten: str,
        email: str,
        google_id: str,
        anh_dai_dien: str | None = None
    ):
        sql = """
            INSERT INTO khachhang (
                id_khach_hang,
                ten_dang_nhap,
                mat_khau,
                ho_ten,
                email,
                google_id,
                anh_dai_dien,
                da_xac_thuc_email,
                vai_tro
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, true, 'user')
            RETURNING id_khach_hang, ten_dang_nhap, ho_ten, email, vai_tro, google_id
        """
        db_uuid = uuid.UUID(id_khach_hang) if isinstance(id_khach_hang, str) else id_khach_hang
        return await get_pool().fetchrow(
            sql,
            db_uuid,
            ten_dang_nhap,
            mat_khau,
            ho_ten,
            email,
            google_id,
            anh_dai_dien
        )

    async def link_google_id(
        self,
        id_khach_hang: str,
        google_id: str,
        anh_dai_dien: str | None = None
    ):
        sql = """
            UPDATE khachhang
            SET google_id = $2,
                anh_dai_dien = COALESCE(anh_dai_dien, $3),
                da_xac_thuc_email = true,
                cap_nhat = CURRENT_TIMESTAMP
            WHERE id_khach_hang = $1
            RETURNING id_khach_hang
        """
        db_uuid = uuid.UUID(id_khach_hang) if isinstance(id_khach_hang, str) else id_khach_hang
        return await get_pool().fetchrow(sql, db_uuid, google_id, anh_dai_dien)

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
                trang_thai,
                cccd,
                dia_chi,
                google_id,
                anh_dai_dien
            FROM khachhang
            WHERE id_khach_hang = $1 AND da_xoa = false
        """
        db_uuid = uuid.UUID(id_khach_hang) if isinstance(id_khach_hang, str) else id_khach_hang
        return await get_pool().fetchrow(sql, db_uuid)


    

    
import uuid
from app.core.database import get_pool

class UserRepository:

    async def create_employee(
        self,
        id_khach_hang: str,
        ten_dang_nhap: str,
        mat_khau: str,
        ho_ten: str,
        email: str,
        so_dien_thoai: str,
        id_chi_nhanh: str,
        vai_tro: str,
        trang_thai: str
    ):
        db_uuid = uuid.UUID(id_khach_hang) if isinstance(id_khach_hang, str) else id_khach_hang
        branch_uuid = uuid.UUID(id_chi_nhanh) if isinstance(id_chi_nhanh, str) else id_chi_nhanh

        async with get_pool().acquire() as connection:
            async with connection.transaction():
                # 1. Thêm vào bảng khachhang
                sql_khachhang = """
                    INSERT INTO khachhang (
                        id_khach_hang,
                        ten_dang_nhap,
                        mat_khau,
                        ho_ten,
                        email,
                        so_dien_thoai,
                        vai_tro,
                        trang_thai
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    RETURNING id_khach_hang, ten_dang_nhap, ho_ten, email, so_dien_thoai, vai_tro, trang_thai
                """
                res_kh = await connection.fetchrow(
                    sql_khachhang,
                    db_uuid,
                    ten_dang_nhap,
                    mat_khau,
                    ho_ten,
                    email,
                    so_dien_thoai,
                    vai_tro,
                    trang_thai
                )

                # 2. Thêm liên kết vào bảng nhanvien
                sql_nhanvien = """
                    INSERT INTO nhanvien (id_khach_hang, id_chi_nhanh)
                    VALUES ($1, $2)
                """
                await connection.execute(sql_nhanvien, db_uuid, branch_uuid)

                return {
                    "id_khach_hang": res_kh["id_khach_hang"],
                    "ten_dang_nhap": res_kh["ten_dang_nhap"],
                    "ho_ten": res_kh["ho_ten"],
                    "email": res_kh["email"],
                    "so_dien_thoai": res_kh["so_dien_thoai"],
                    "id_chi_nhanh": branch_uuid,
                    "vai_tro": res_kh["vai_tro"],
                    "trang_thai": res_kh["trang_thai"]
                }

    async def find_by_email_or_phone(self, email: str, phone: str):
        sql = """
            SELECT id_khach_hang, ten_dang_nhap, ho_ten, email, so_dien_thoai
            FROM khachhang
            WHERE (email = $1 OR so_dien_thoai = $2) AND da_xoa = false
        """
        return await get_pool().fetchrow(sql, email, phone)

    async def get_all_employees(self):
        sql = """
            SELECT 
                k.id_khach_hang,
                k.ho_ten,
                k.email,
                k.so_dien_thoai,
                nv.id_chi_nhanh,
                c.ten_chi_nhanh,
                k.vai_tro,
                k.trang_thai
            FROM khachhang k
            INNER JOIN nhanvien nv ON k.id_khach_hang = nv.id_khach_hang
            LEFT JOIN chinhanh c ON nv.id_chi_nhanh = c.id_chi_nhanh
            WHERE k.vai_tro IN ('staff', 'admin') AND k.da_xoa = false
            ORDER BY k.ngay_tao DESC
        """
        return await get_pool().fetch(sql)

    async def get_employee_by_id(self, id_khach_hang: str):
        sql = """
            SELECT 
                k.id_khach_hang,
                k.ho_ten,
                k.email,
                k.so_dien_thoai,
                nv.id_chi_nhanh,
                c.ten_chi_nhanh,
                k.vai_tro,
                k.trang_thai
            FROM khachhang k
            INNER JOIN nhanvien nv ON k.id_khach_hang = nv.id_khach_hang
            LEFT JOIN chinhanh c ON nv.id_chi_nhanh = c.id_chi_nhanh
            WHERE k.id_khach_hang = $1 AND k.vai_tro IN ('staff', 'admin') AND k.da_xoa = false
        """
        db_uuid = uuid.UUID(id_khach_hang) if isinstance(id_khach_hang, str) else id_khach_hang
        return await get_pool().fetchrow(sql, db_uuid)

    async def update_employee_status(self, id_khach_hang: str, trang_thai: str):
        sql = """
            UPDATE khachhang k
            SET trang_thai = $2, cap_nhat = CURRENT_TIMESTAMP
            FROM nhanvien nv
            WHERE k.id_khach_hang = $1 AND k.id_khach_hang = nv.id_khach_hang AND k.vai_tro IN ('staff', 'admin') AND k.da_xoa = false
            RETURNING k.id_khach_hang, k.ho_ten, k.email, nv.id_chi_nhanh, k.vai_tro, k.trang_thai
        """
        db_uuid = uuid.UUID(id_khach_hang) if isinstance(id_khach_hang, str) else id_khach_hang
        return await get_pool().fetchrow(sql, db_uuid, trang_thai)

    async def get_all_customers(self):
        sql = """
            SELECT 
                id_khach_hang,
                ho_ten,
                so_dien_thoai,
                email,
                trang_thai
            FROM khachhang
            WHERE vai_tro = 'user' AND da_xoa = false
            ORDER BY ngay_tao DESC
        """
        return await get_pool().fetch(sql)

    async def get_customer_by_id(self, id_khach_hang: str):
        sql = """
            SELECT 
                id_khach_hang,
                ho_ten,
                gioi_tinh,
                ngay_sinh,
                cccd,
                so_dien_thoai,
                email,
                dia_chi,
                trang_thai
            FROM khachhang
            WHERE id_khach_hang = $1 AND vai_tro = 'user' AND da_xoa = false
        """
        db_uuid = uuid.UUID(id_khach_hang) if isinstance(id_khach_hang, str) else id_khach_hang
        return await get_pool().fetchrow(sql, db_uuid)

    async def get_all_accounts(self):
        sql = """
            SELECT 
                id_khach_hang,
                ho_ten,
                email,
                vai_tro,
                trang_thai
            FROM khachhang
            WHERE da_xoa = false
            ORDER BY ngay_tao DESC
        """
        return await get_pool().fetch(sql)

    async def update_account_role(self, id_khach_hang: str, vai_tro: str):
        sql = """
            UPDATE khachhang
            SET vai_tro = $2, cap_nhat = CURRENT_TIMESTAMP
            WHERE id_khach_hang = $1 AND da_xoa = false
            RETURNING id_khach_hang, ho_ten, email, vai_tro, trang_thai
        """
        db_uuid = uuid.UUID(id_khach_hang) if isinstance(id_khach_hang, str) else id_khach_hang
        return await get_pool().fetchrow(sql, db_uuid, vai_tro)

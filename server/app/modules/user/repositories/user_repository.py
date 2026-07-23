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
                cccd,
                gioi_tinh,
                ngay_sinh,
                dia_chi,
                trang_thai,
                ngay_tao
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
                k.id_khach_hang,
                k.ho_ten,
                k.email,
                k.vai_tro,
                k.trang_thai,
                nv.id_chi_nhanh
            FROM khachhang k
            LEFT JOIN nhanvien nv ON k.id_khach_hang = nv.id_khach_hang
            WHERE k.da_xoa = false
            ORDER BY k.ngay_tao DESC
        """
        return await get_pool().fetch(sql)


    async def update_account_role(self, id_khach_hang: str, vai_tro: str, id_chi_nhanh: str | None = None):
        db_uuid = uuid.UUID(id_khach_hang) if isinstance(id_khach_hang, str) else id_khach_hang
        
        async with get_pool().acquire() as connection:
            async with connection.transaction():
                # 1. Cập nhật vai_tro của khachhang
                sql_kh = """
                    UPDATE khachhang
                    SET vai_tro = $2, cap_nhat = CURRENT_TIMESTAMP
                    WHERE id_khach_hang = $1 AND da_xoa = false
                    RETURNING id_khach_hang, ho_ten, email, vai_tro, trang_thai
                """
                res = await connection.fetchrow(sql_kh, db_uuid, vai_tro)
                if not res:
                    return None

                # 2. Xử lý bảng nhanvien
                if vai_tro == "staff":
                    if not id_chi_nhanh:
                        raise ValueError("id_chi_nhanh is required for staff role")
                    branch_uuid = uuid.UUID(id_chi_nhanh) if isinstance(id_chi_nhanh, str) else id_chi_nhanh
                    
                    # Kiểm tra xem đã có dòng nào trong nhanvien chưa
                    sql_check = "SELECT 1 FROM nhanvien WHERE id_khach_hang = $1"
                    exists = await connection.fetchval(sql_check, db_uuid)
                    if exists:
                        # Cập nhật chi nhánh
                        sql_up = "UPDATE nhanvien SET id_chi_nhanh = $2 WHERE id_khach_hang = $1"
                        await connection.execute(sql_up, db_uuid, branch_uuid)
                    else:
                        # Thêm mới
                        sql_ins = "INSERT INTO nhanvien (id_khach_hang, id_chi_nhanh) VALUES ($1, $2)"
                        await connection.execute(sql_ins, db_uuid, branch_uuid)
                else:
                    # Nếu vai trò khác (admin, user), ta xóa khỏi bảng nhanvien (hoặc giữ nguyên nếu là admin, nhưng thường là xóa để dọn dẹp)
                    sql_del = "DELETE FROM nhanvien WHERE id_khach_hang = $1"
                    await connection.execute(sql_del, db_uuid)
                
                return res


    async def get_user_role(self, id_khach_hang: str):
        sql = """
            SELECT vai_tro 
            FROM khachhang 
            WHERE id_khach_hang = $1 AND da_xoa = false
        """
        db_uuid = uuid.UUID(id_khach_hang) if isinstance(id_khach_hang, str) else id_khach_hang
        return await get_pool().fetchval(sql, db_uuid)

    async def update_profile(self, id_khach_hang: str, ho_ten: str, so_dien_thoai: str, cccd: str, dia_chi: str):
        sql = """
            UPDATE khachhang
            SET
                ho_ten = $2,
                so_dien_thoai = $3,
                cccd = CASE WHEN $4 != '' THEN $4 ELSE cccd END,
                dia_chi = CASE WHEN $5 != '' THEN $5 ELSE dia_chi END,
                cap_nhat = CURRENT_TIMESTAMP
            WHERE id_khach_hang = $1 AND da_xoa = false
            RETURNING id_khach_hang, ho_ten, so_dien_thoai, cccd, dia_chi, email
        """
        db_uuid = uuid.UUID(id_khach_hang) if isinstance(id_khach_hang, str) else id_khach_hang
        return await get_pool().fetchrow(sql, db_uuid, ho_ten, so_dien_thoai, cccd, dia_chi)

    async def get_staff_profile(self, id_khach_hang: str):
        sql = """
            SELECT 
                k.id_khach_hang,
                k.ten_dang_nhap,
                k.ho_ten,
                k.email,
                k.so_dien_thoai,
                k.cccd,
                k.gioi_tinh,
                k.ngay_sinh,
                k.dia_chi,
                k.anh_dai_dien,
                k.vai_tro,
                k.trang_thai,
                k.lan_dang_nhap_cuoi,
                k.ngay_tao,
                nv.id_chi_nhanh,
                c.ten_chi_nhanh,
                c.dia_chi AS dia_chi_chi_nhanh,
                c.so_hotline AS hotline_chi_nhanh,
                c.gio_lam_viec AS gio_lam_viec_chi_nhanh
            FROM khachhang k
            LEFT JOIN nhanvien nv ON k.id_khach_hang = nv.id_khach_hang
            LEFT JOIN chinhanh c ON nv.id_chi_nhanh = c.id_chi_nhanh
            WHERE k.id_khach_hang = $1 AND k.da_xoa = false
        """
        db_uuid = uuid.UUID(id_khach_hang) if isinstance(id_khach_hang, str) else id_khach_hang
        return await get_pool().fetchrow(sql, db_uuid)

    async def update_staff_profile(
        self,
        id_khach_hang: str,
        ho_ten: str,
        so_dien_thoai: str,
        cccd: str | None = None,
        dia_chi: str | None = None,
        gioi_tinh: str | None = None,
        ngay_sinh: str | None = None
    ):
        sql = """
            UPDATE khachhang
            SET
                ho_ten = $2,
                so_dien_thoai = $3,
                cccd = COALESCE($4, cccd),
                dia_chi = COALESCE($5, dia_chi),
                gioi_tinh = COALESCE($6, gioi_tinh),
                ngay_sinh = CASE WHEN $7::text IS NOT NULL AND $7::text != '' THEN $7::date ELSE ngay_sinh END,
                cap_nhat = CURRENT_TIMESTAMP
            WHERE id_khach_hang = $1 AND da_xoa = false
            RETURNING id_khach_hang, ho_ten, so_dien_thoai, cccd, dia_chi, gioi_tinh, ngay_sinh, email
        """
        db_uuid = uuid.UUID(id_khach_hang) if isinstance(id_khach_hang, str) else id_khach_hang
        return await get_pool().fetchrow(sql, db_uuid, ho_ten, so_dien_thoai, cccd, dia_chi, gioi_tinh, ngay_sinh)



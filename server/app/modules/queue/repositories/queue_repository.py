import uuid
from datetime import datetime
from app.core.database import get_pool

class QueueRepository:

    # --- CRUD LOAIGIAODICH ---
    async def get_all_services(self):
        sql = """
            SELECT id_loai_giao_dich, ten_giao_dich, mo_ta, thoi_gian_xu_ly_trung_binh, trang_thai, ngay_tao
            FROM loaigiaodich
            WHERE da_xoa = false
            ORDER BY ngay_tao DESC
        """
        return await get_pool().fetch(sql)

    async def get_service_by_id(self, id_loai_giao_dich: str):
        sql = """
            SELECT id_loai_giao_dich, ten_giao_dich, mo_ta, thoi_gian_xu_ly_trung_binh, trang_thai
            FROM loaigiaodich
            WHERE id_loai_giao_dich = $1 AND da_xoa = false
        """
        db_uuid = uuid.UUID(id_loai_giao_dich) if isinstance(id_loai_giao_dich, str) else id_loai_giao_dich
        return await get_pool().fetchrow(sql, db_uuid)

    async def get_service_by_name(self, ten_giao_dich: str):
        sql = """
            SELECT id_loai_giao_dich, ten_giao_dich, mo_ta, thoi_gian_xu_ly_trung_binh, trang_thai
            FROM loaigiaodich
            WHERE ten_giao_dich = $1 AND da_xoa = false
        """
        return await get_pool().fetchrow(sql, ten_giao_dich)

    async def create_service(
        self,
        id_loai_giao_dich: str,
        ten_giao_dich: str,
        mo_ta: str,
        thoi_gian_xu_ly_trung_binh: int,
        trang_thai: str
    ):
        sql = """
            INSERT INTO loaigiaodich (
                id_loai_giao_dich,
                ten_giao_dich,
                mo_ta,
                thoi_gian_xu_ly_trung_binh,
                trang_thai
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id_loai_giao_dich, ten_giao_dich, mo_ta, thoi_gian_xu_ly_trung_binh, trang_thai
        """
        db_uuid = uuid.UUID(id_loai_giao_dich) if isinstance(id_loai_giao_dich, str) else id_loai_giao_dich
        return await get_pool().fetchrow(
            sql,
            db_uuid,
            ten_giao_dich,
            mo_ta,
            thoi_gian_xu_ly_trung_binh,
            trang_thai
        )

    async def update_service(
        self,
        id_loai_giao_dich: str,
        ten_giao_dich: str,
        mo_ta: str,
        thoi_gian_xu_ly_trung_binh: int,
        trang_thai: str
    ):
        sql = """
            UPDATE loaigiaodich
            SET
                ten_giao_dich = $2,
                mo_ta = $3,
                thoi_gian_xu_ly_trung_binh = $4,
                trang_thai = $5,
                cap_nhat = CURRENT_TIMESTAMP
            WHERE id_loai_giao_dich = $1 AND da_xoa = false
            RETURNING id_loai_giao_dich, ten_giao_dich, mo_ta, thoi_gian_xu_ly_trung_binh, trang_thai
        """
        db_uuid = uuid.UUID(id_loai_giao_dich) if isinstance(id_loai_giao_dich, str) else id_loai_giao_dich
        return await get_pool().fetchrow(
            sql,
            db_uuid,
            ten_giao_dich,
            mo_ta,
            thoi_gian_xu_ly_trung_binh,
            trang_thai
        )

    async def delete_service(self, id_loai_giao_dich: str):
        sql = """
            UPDATE loaigiaodich
            SET da_xoa = true, cap_nhat = CURRENT_TIMESTAMP
            WHERE id_loai_giao_dich = $1 AND da_xoa = false
            RETURNING id_loai_giao_dich
        """
        db_uuid = uuid.UUID(id_loai_giao_dich) if isinstance(id_loai_giao_dich, str) else id_loai_giao_dich
        return await get_pool().fetchrow(sql, db_uuid)


    # --- CUSTOMER MANAGEMENT ---
    async def get_customer_by_phone(self, so_dien_thoai: str):
        sql = """
            SELECT id_khach_hang, ho_ten, so_dien_thoai
            FROM khachhang
            WHERE so_dien_thoai = $1 AND da_xoa = false
        """
        return await get_pool().fetchrow(sql, so_dien_thoai)

    async def create_customer(self, id_khach_hang: str, ho_ten: str, so_dien_thoai: str):
        sql = """
            INSERT INTO khachhang (
                id_khach_hang,
                ten_dang_nhap,
                mat_khau,
                ho_ten,
                so_dien_thoai,
                vai_tro,
                trang_thai
            )
            VALUES ($1, $2, $3, $4, $5, 'user', 'ChoXacThuc')
            RETURNING id_khach_hang, ho_ten, so_dien_thoai
        """
        db_uuid = uuid.UUID(id_khach_hang) if isinstance(id_khach_hang, str) else id_khach_hang
        username = f"guest_{so_dien_thoai}_{uuid.uuid4().hex[:6]}"
        dummy_password = "guest_password_no_login"
        return await get_pool().fetchrow(sql, db_uuid, username, dummy_password, ho_ten, so_dien_thoai)


    # --- QUEUE & TICKET ---
    async def count_tickets_today_by_branch(self, id_chi_nhanh: str):
        sql = """
            SELECT COUNT(*) 
            FROM phieuxephang 
            WHERE id_chi_nhanh = $1 
              AND ngay_tao >= CURRENT_DATE
        """
        db_uuid = uuid.UUID(id_chi_nhanh) if isinstance(id_chi_nhanh, str) else id_chi_nhanh
        return await get_pool().fetchval(sql, db_uuid)

    async def create_ticket(
        self,
        id_phieu: str,
        id_khach_hang: str,
        id_chi_nhanh: str,
        id_loai_giao_dich: str,
        so_thu_tu: str
    ):
        sql = """
            INSERT INTO phieuxephang (
                id_phieu,
                id_khach_hang,
                id_chi_nhanh,
                id_loai_giao_dich,
                so_thu_tu,
                trang_thai
            )
            VALUES ($1, $2, $3, $4, $5, 'ChoXuLy')
            RETURNING id_phieu, id_khach_hang, id_chi_nhanh, id_loai_giao_dich, so_thu_tu, trang_thai, ngay_tao
        """
        uuid_phieu = uuid.UUID(id_phieu) if isinstance(id_phieu, str) else id_phieu
        uuid_kh = uuid.UUID(id_khach_hang) if isinstance(id_khach_hang, str) else id_khach_hang
        uuid_cn = uuid.UUID(id_chi_nhanh) if isinstance(id_chi_nhanh, str) else id_chi_nhanh
        uuid_lgd = uuid.UUID(id_loai_giao_dich) if isinstance(id_loai_giao_dich, str) else id_loai_giao_dich
        
        return await get_pool().fetchrow(
            sql,
            uuid_phieu,
            uuid_kh,
            uuid_cn,
            uuid_lgd,
            so_thu_tu
        )

    async def count_waiting_tickets_before(self, id_chi_nhanh: str, ngay_tao_limit: datetime):
        sql = """
            SELECT COUNT(*) 
            FROM phieuxephang 
            WHERE id_chi_nhanh = $1 
              AND trang_thai IN ('ChoXuLy', 'DangPhucVu')
              AND ngay_tao < $2
              AND da_xoa = false
        """
        db_uuid = uuid.UUID(id_chi_nhanh) if isinstance(id_chi_nhanh, str) else id_chi_nhanh
        return await get_pool().fetchval(sql, db_uuid, ngay_tao_limit)

    async def create_time_prediction(
        self,
        id_du_doan: str,
        id_phieu: str,
        thoi_gian_du_kien: datetime,
        so_phut_cho: int
    ):
        sql = """
            INSERT INTO dudoanthoigian (
                id_du_doan,
                id_phieu,
                thoi_gian_du_kien,
                so_phut_cho,
                do_tin_cay
            )
            VALUES ($1, $2, $3, $4, 95.0)
            RETURNING id_du_doan, id_phieu, thoi_gian_du_kien, so_phut_cho, do_tin_cay
        """
        uuid_dd = uuid.UUID(id_du_doan) if isinstance(id_du_doan, str) else id_du_doan
        uuid_p = uuid.UUID(id_phieu) if isinstance(id_phieu, str) else id_phieu
        
        return await get_pool().fetchrow(
            sql,
            uuid_dd,
            uuid_p,
            thoi_gian_du_kien,
            so_phut_cho
        )


    # --- STAFF SPECIFIC DB OPERATIONS ---
    async def get_staff_branch(self, id_khach_hang: str):
        # Lấy id chi nhánh mà nhân viên trực thuộc
        sql = """
            SELECT id_chi_nhanh
            FROM nhanvien
            WHERE id_khach_hang = $1
        """
        db_uuid = uuid.UUID(id_khach_hang) if isinstance(id_khach_hang, str) else id_khach_hang
        return await get_pool().fetchrow(sql, db_uuid)

    async def get_tickets_by_branch_today(self, id_chi_nhanh: str):
        # Lấy toàn bộ phiếu xếp hàng hôm nay của chi nhánh, sắp xếp theo thời gian đăng ký tăng dần
        sql = """
            SELECT 
                p.id_phieu,
                p.so_thu_tu,
                p.trang_thai,
                p.ngay_tao,
                k.ho_ten,
                k.so_dien_thoai,
                l.ten_giao_dich,
                l.thoi_gian_xu_ly_trung_binh
            FROM phieuxephang p
            JOIN khachhang k ON p.id_khach_hang = k.id_khach_hang
            JOIN loaigiaodich l ON p.id_loai_giao_dich = l.id_loai_giao_dich
            WHERE p.id_chi_nhanh = $1
              AND p.ngay_tao >= CURRENT_DATE
              AND p.da_xoa = false
            ORDER BY p.ngay_tao ASC
        """
        db_uuid = uuid.UUID(id_chi_nhanh) if isinstance(id_chi_nhanh, str) else id_chi_nhanh
        return await get_pool().fetch(sql, db_uuid)

    async def get_ticket_by_id(self, id_phieu: str):
        sql = """
            SELECT id_phieu, id_chi_nhanh, trang_thai
            FROM phieuxephang
            WHERE id_phieu = $1 AND da_xoa = false
        """
        db_uuid = uuid.UUID(id_phieu) if isinstance(id_phieu, str) else id_phieu
        return await get_pool().fetchrow(sql, db_uuid)

    async def update_ticket_status(self, id_phieu: str, trang_thai: str):
        sql = """
            UPDATE phieuxephang
            SET 
                trang_thai = $2,
                cap_nhat = CURRENT_TIMESTAMP
            WHERE id_phieu = $1 AND da_xoa = false
            RETURNING id_phieu, so_thu_tu, trang_thai
        """
        db_uuid = uuid.UUID(id_phieu) if isinstance(id_phieu, str) else id_phieu
        return await get_pool().fetchrow(sql, db_uuid, trang_thai)



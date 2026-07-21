from typing import Optional, Dict, Any, List
from uuid import UUID, uuid4
from app.core.database import get_pool


class PaymentRepository:

    async def get_staff_branch(self, id_khach_hang: str) -> Optional[Dict[str, Any]]:
        """
        Lấy thông tin chi nhánh nhân viên đang làm việc từ bảng nhanvien, hoặc fallback chi nhánh đầu tiên.
        """
        pool = get_pool()
        sql = "SELECT id_chi_nhanh FROM nhanvien WHERE id_khach_hang = $1"
        db_uuid = UUID(id_khach_hang) if isinstance(id_khach_hang, str) else id_khach_hang
        row = await pool.fetchrow(sql, db_uuid)
        if row:
            return dict(row)

        sql_fallback = "SELECT id_chi_nhanh FROM chinhanh WHERE da_xoa = false ORDER BY ngay_tao ASC LIMIT 1"
        fallback_row = await pool.fetchrow(sql_fallback)
        return dict(fallback_row) if fallback_row else None

    async def get_sim_orders_by_branch(self, id_chi_nhanh: UUID) -> List[Dict[str, Any]]:
        """
        Lấy danh sách các đơn hàng mua SIM thuộc chi nhánh do nhân viên phụ trách.
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
                kh.ho_ten,
                kh.so_dien_thoai,
                kh.email,
                kh.cccd,
                kh.dia_chi,
                tt.id_thanh_toan,
                tt.phuong_thuc,
                tt.ma_giao_dich,
                tt.trang_thai AS trang_thai_thanh_toan,
                COALESCE(tt.da_nhan, false) AS da_nhan,
                tt.thoi_gian_nhan,
                tt.thoi_gian_thanh_toan,
                cn.ten_chi_nhanh
            FROM donhangsim dh
            JOIN chitietdonhang ct ON dh.id_don_hang = ct.id_don_hang
            JOIN sim s ON ct.id_sim = s.id_sim
            JOIN chinhanh cn ON s.id_chi_nhanh = cn.id_chi_nhanh
            LEFT JOIN loaisim ls ON s.id_loai_sim = ls.id_loai_sim
            LEFT JOIN khachhang kh ON dh.id_khach_hang = kh.id_khach_hang
            LEFT JOIN thanhtoan tt ON dh.id_don_hang = tt.id_don_hang
            WHERE s.id_chi_nhanh = $1 AND dh.da_xoa = false
            ORDER BY dh.ngay_dat_hang DESC
        """
        db_uuid = UUID(str(id_chi_nhanh)) if isinstance(id_chi_nhanh, str) else id_chi_nhanh
        rows = await pool.fetch(sql, db_uuid)
        return [dict(r) for r in rows]

    async def confirm_staff_sim_received(self, id_don_hang: UUID) -> bool:
        """
        Nhân viên xác nhận khách hàng đã xuất trình hóa đơn và nhận SIM trực tiếp tại quầy.
        """
        pool = get_pool()
        async with pool.acquire() as conn:
            async with conn.transaction():
                # 1. Cập nhật hoặc tạo bản ghi thanh toán nếu chưa có
                sql_check_tt = "SELECT id_thanh_toan, phuong_thuc FROM thanhtoan WHERE id_don_hang = $1 AND da_xoa = false"
                tt_row = await conn.fetchrow(sql_check_tt, id_don_hang)
                
                if tt_row:
                    sql_tt = """
                        UPDATE thanhtoan
                        SET da_nhan = true,
                            thoi_gian_nhan = CURRENT_TIMESTAMP,
                            trang_thai = CASE WHEN trang_thai = 'ChoThanhToan' THEN 'ThanhCong' ELSE trang_thai END,
                            thoi_gian_thanh_toan = COALESCE(thoi_gian_thanh_toan, CURRENT_TIMESTAMP),
                            cap_nhat = CURRENT_TIMESTAMP
                        WHERE id_don_hang = $1 AND da_xoa = false
                    """
                    await conn.execute(sql_tt, id_don_hang)
                else:
                    # Tạo bản ghi thanh toán tại quầy
                    sql_dh_info = "SELECT tong_tien FROM donhangsim WHERE id_don_hang = $1"
                    so_tien = await conn.fetchval(sql_dh_info, id_don_hang) or 0.0
                    id_thanh_toan = uuid4()
                    sql_ins_tt = """
                        INSERT INTO thanhtoan (id_thanh_toan, id_don_hang, so_tien, phuong_thuc, trang_thai, da_nhan, thoi_gian_nhan, thoi_gian_thanh_toan)
                        VALUES ($1, $2, $3, 'TienMat', 'ThanhCong', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                    """
                    await conn.execute(sql_ins_tt, id_thanh_toan, id_don_hang, so_tien)

                # 2. Cập nhật donhangsim thành DaThanhToan
                sql_dh = """
                    UPDATE donhangsim
                    SET trang_thai = 'DaThanhToan',
                        cap_nhat = CURRENT_TIMESTAMP
                    WHERE id_don_hang = $1 AND da_xoa = false
                """
                await conn.execute(sql_dh, id_don_hang)

                # 3. Cập nhật sim thành DaBan
                sql_sim = """
                    UPDATE sim
                    SET trang_thai = 'DaBan',
                        cap_nhat = CURRENT_TIMESTAMP
                    WHERE id_sim IN (
                        SELECT id_sim FROM chitietdonhang WHERE id_don_hang = $1 AND da_xoa = false
                    ) AND da_xoa = false
                """
                await conn.execute(sql_sim, id_don_hang)
                return True

    async def create_sim_order(
        self,
        id_sim: UUID,
        id_khach_hang: Optional[UUID] = None,
        ho_ten: Optional[str] = None,
        so_dien_thoai: Optional[str] = None,
        cccd: Optional[str] = None,
        email: Optional[str] = None,
        dia_chi: Optional[str] = None,
        phuong_thuc: str = "VNPay"
    ) -> Dict[str, Any]:
        """
        Tạo đơn hàng mua SIM mới (bảng donhangsim & chitietdonhang).
        Tự động tạo hoặc cập nhật hồ sơ người mua thực sự dựa trên Họ tên, SĐT, CCCD, Email, Địa chỉ.
        """
        pool = get_pool()
        async with pool.acquire() as conn:
            async with conn.transaction():
                # 1. Kiểm tra SIM
                sql_sim = "SELECT id_sim, gia_ban, trang_thai FROM sim WHERE id_sim = $1 AND da_xoa = false"
                sim_row = await conn.fetchrow(sql_sim, id_sim)
                if not sim_row:
                    raise ValueError("Không tìm thấy thông tin SIM")
                if sim_row["trang_thai"] != "ConHang":
                    raise ValueError("SIM này không còn sẵn có để đặt mua")

                # 2. Xử lý thông tin khách hàng (người mua thực sự)
                customer_id = None

                if so_dien_thoai:
                    sql_kh_by_phone = "SELECT id_khach_hang FROM khachhang WHERE so_dien_thoai = $1 AND da_xoa = false"
                    existing_kh_id = await conn.fetchval(sql_kh_by_phone, so_dien_thoai)
                    if existing_kh_id:
                        customer_id = existing_kh_id
                        sql_up_kh = """
                            UPDATE khachhang
                            SET ho_ten = COALESCE($2, ho_ten),
                                cccd = COALESCE($3, cccd),
                                email = COALESCE($4, email),
                                dia_chi = COALESCE($5, dia_chi),
                                cap_nhat = CURRENT_TIMESTAMP
                            WHERE id_khach_hang = $1
                        """
                        await conn.execute(sql_up_kh, customer_id, ho_ten, cccd, email, dia_chi)
                    else:
                        new_kh_id = uuid4()
                        ten_dn = f"kh_{so_dien_thoai}"
                        sql_ins_kh = """
                            INSERT INTO khachhang (id_khach_hang, ten_dang_nhap, mat_khau, ho_ten, so_dien_thoai, cccd, email, dia_chi, vai_tro, trang_thai)
                            VALUES ($1, $2, '123456', $3, $4, $5, $6, $7, 'user', 'HoatDong')
                        """
                        await conn.execute(sql_ins_kh, new_kh_id, ten_dn, ho_ten or "Khách hàng Mua SIM", so_dien_thoai, cccd, email, dia_chi)
                        customer_id = new_kh_id
                elif id_khach_hang:
                    customer_id = id_khach_hang
                    sql_up_kh = """
                        UPDATE khachhang
                        SET ho_ten = COALESCE($2, ho_ten),
                            so_dien_thoai = COALESCE($3, so_dien_thoai),
                            cccd = COALESCE($4, cccd),
                            email = COALESCE($5, email),
                            dia_chi = COALESCE($6, dia_chi),
                            cap_nhat = CURRENT_TIMESTAMP
                        WHERE id_khach_hang = $1
                    """
                    await conn.execute(sql_up_kh, customer_id, ho_ten, so_dien_thoai, cccd, email, dia_chi)
                else:
                    sql_default_kh = "SELECT id_khach_hang FROM khachhang WHERE vai_tro = 'user' AND da_xoa = false LIMIT 1"
                    customer_id = await conn.fetchval(sql_default_kh) or id_khach_hang

                # 3. Tính tổng tiền
                gia_sim = float(sim_row["gia_ban"])
                phi_hoa_mang = 50000.0
                tong_tien = gia_sim + phi_hoa_mang

                # 4. Kiểm tra xem SIM đã có trong chitietdonhang chưa
                sql_check_ct = """
                    SELECT ct.id_chi_tiet, ct.id_don_hang, dh.trang_thai, dh.tong_tien, dh.id_khach_hang, dh.ngay_dat_hang
                    FROM chitietdonhang ct
                    LEFT JOIN donhangsim dh ON ct.id_don_hang = dh.id_don_hang
                    WHERE ct.id_sim = $1
                """
                existing_ct = await conn.fetchrow(sql_check_ct, id_sim)

                is_offline = phuong_thuc in ("TienMat", "cod", "offline")

                if existing_ct:
                    if existing_ct["trang_thai"] == "DaThanhToan":
                        raise ValueError("Số SIM này đã được mua và thanh toán thành công.")
                    elif existing_ct["trang_thai"] == "ChoThanhToan":
                        id_don_hang = existing_ct["id_don_hang"]
                        # Cập nhật thông tin khách hàng mới nhất cho đơn hàng này
                        if customer_id:
                            sql_up_dh = "UPDATE donhangsim SET id_khach_hang = $2, cap_nhat = CURRENT_TIMESTAMP WHERE id_don_hang = $1"
                            await conn.execute(sql_up_dh, id_don_hang, customer_id)

                        if is_offline:
                            # Tạo hoặc cập nhật bản ghi thanh toán tại quầy
                            sql_ins_tt = """
                                INSERT INTO thanhtoan (id_thanh_toan, id_don_hang, so_tien, phuong_thuc, trang_thai)
                                VALUES ($1, $2, $3, 'TienMat', 'ChoThanhToan')
                                ON CONFLICT (id_don_hang) DO UPDATE SET phuong_thuc = 'TienMat'
                            """
                            await conn.execute(sql_ins_tt, uuid4(), id_don_hang, tong_tien)
                            # Đánh dấu SIM thành Đã bán
                            await conn.execute("UPDATE sim SET trang_thai = 'DaBan', cap_nhat = CURRENT_TIMESTAMP WHERE id_sim = $1", id_sim)

                        return {
                            "id_don_hang": str(id_don_hang),
                            "id_khach_hang": str(customer_id or existing_ct["id_khach_hang"]),
                            "tong_tien": float(existing_ct["tong_tien"]),
                            "trang_thai": existing_ct["trang_thai"],
                            "ngay_dat_hang": existing_ct["ngay_dat_hang"]
                        }
                    else:
                        id_don_hang = uuid4()
                        sql_dh = """
                            INSERT INTO donhangsim (id_don_hang, id_khach_hang, tong_tien, trang_thai)
                            VALUES ($1, $2, $3, 'ChoThanhToan')
                            RETURNING id_don_hang, id_khach_hang, tong_tien, trang_thai, ngay_dat_hang
                        """
                        dh_row = await conn.fetchrow(sql_dh, id_don_hang, customer_id, tong_tien)

                        sql_update_ct = """
                            UPDATE chitietdonhang
                            SET id_don_hang = $1, gia_ban = $2, da_xoa = false, cap_nhat = CURRENT_TIMESTAMP
                            WHERE id_sim = $3
                        """
                        await conn.execute(sql_update_ct, id_don_hang, gia_sim, id_sim)

                        if is_offline:
                            sql_ins_tt = """
                                INSERT INTO thanhtoan (id_thanh_toan, id_don_hang, so_tien, phuong_thuc, trang_thai)
                                VALUES ($1, $2, $3, 'TienMat', 'ChoThanhToan')
                            """
                            await conn.execute(sql_ins_tt, uuid4(), id_don_hang, tong_tien)
                            await conn.execute("UPDATE sim SET trang_thai = 'DaBan', cap_nhat = CURRENT_TIMESTAMP WHERE id_sim = $1", id_sim)

                        return {
                            "id_don_hang": str(dh_row["id_don_hang"]),
                            "id_khach_hang": str(dh_row["id_khach_hang"]),
                            "tong_tien": float(dh_row["tong_tien"]),
                            "trang_thai": dh_row["trang_thai"],
                            "ngay_dat_hang": dh_row["ngay_dat_hang"]
                        }

                # 5. Nếu chưa có chi tiết đơn hàng nào cho SIM này -> Tạo mới donhangsim & chitietdonhang
                id_don_hang = uuid4()
                sql_dh = """
                    INSERT INTO donhangsim (id_don_hang, id_khach_hang, tong_tien, trang_thai)
                    VALUES ($1, $2, $3, 'ChoThanhToan')
                    RETURNING id_don_hang, id_khach_hang, tong_tien, trang_thai, ngay_dat_hang
                """
                dh_row = await conn.fetchrow(sql_dh, id_don_hang, customer_id, tong_tien)

                id_chi_tiet = uuid4()
                sql_ct = """
                    INSERT INTO chitietdonhang (id_chi_tiet, id_don_hang, id_sim, gia_ban)
                    VALUES ($1, $2, $3, $4)
                """
                await conn.execute(sql_ct, id_chi_tiet, id_don_hang, id_sim, gia_sim)

                if is_offline:
                    sql_ins_tt = """
                        INSERT INTO thanhtoan (id_thanh_toan, id_don_hang, so_tien, phuong_thuc, trang_thai)
                        VALUES ($1, $2, $3, 'TienMat', 'ChoThanhToan')
                    """
                    await conn.execute(sql_ins_tt, uuid4(), id_don_hang, tong_tien)
                    await conn.execute("UPDATE sim SET trang_thai = 'DaBan', cap_nhat = CURRENT_TIMESTAMP WHERE id_sim = $1", id_sim)

                return {
                    "id_don_hang": str(dh_row["id_don_hang"]),
                    "id_khach_hang": str(dh_row["id_khach_hang"]),
                    "tong_tien": float(dh_row["tong_tien"]),
                    "trang_thai": dh_row["trang_thai"],
                    "ngay_dat_hang": dh_row["ngay_dat_hang"]
                }

    async def get_don_hang_sim_by_id(self, id_don_hang: UUID) -> Optional[Dict[str, Any]]:
        """
        Lấy thông tin đơn hàng SIM theo id_don_hang.
        """
        pool = get_pool()
        sql = """
            SELECT id_don_hang, id_khach_hang, tong_tien, trang_thai, ngay_dat_hang
            FROM donhangsim
            WHERE id_don_hang = $1 AND da_xoa = false
        """
        row = await pool.fetchrow(sql, id_don_hang)
        return dict(row) if row else None

    async def get_sim_order_details(self, id_don_hang: UUID) -> Optional[Dict[str, Any]]:
        """
        Lấy thông tin chi tiết đơn hàng SIM kèm tên chi nhánh, địa chỉ và map_url.
        """
        pool = get_pool()
        sql = """
            SELECT 
                dh.id_don_hang,
                dh.tong_tien,
                s.so_sim,
                c.ten_chi_nhanh,
                c.dia_chi AS dia_chi_chi_nhanh,
                c.map_url
            FROM donhangsim dh
            JOIN chitietdonhang ct ON dh.id_don_hang = ct.id_don_hang
            JOIN sim s ON ct.id_sim = s.id_sim
            JOIN chinhanh c ON s.id_chi_nhanh = c.id_chi_nhanh
            WHERE dh.id_don_hang = $1 AND dh.da_xoa = false
        """
        row = await pool.fetchrow(sql, id_don_hang)
        return dict(row) if row else None

    async def get_payment_by_order_id(self, id_don_hang: UUID) -> Optional[Dict[str, Any]]:
        """
        Lấy thông tin bản ghi thanh toán theo id_don_hang.
        """
        pool = get_pool()
        sql = """
            SELECT id_thanh_toan, id_don_hang, so_tien, phuong_thuc, ma_giao_dich, trang_thai, da_nhan, thoi_gian_nhan, thoi_gian_thanh_toan
            FROM thanhtoan
            WHERE id_don_hang = $1 AND da_xoa = false
        """
        row = await pool.fetchrow(sql, id_don_hang)
        return dict(row) if row else None

    async def get_payment_by_id(self, id_thanh_toan: UUID) -> Optional[Dict[str, Any]]:
        """
        Lấy thông tin bản ghi thanh toán theo id_thanh_toan.
        """
        pool = get_pool()
        sql = """
            SELECT id_thanh_toan, id_don_hang, so_tien, phuong_thuc, ma_giao_dich, trang_thai, da_nhan, thoi_gian_nhan, thoi_gian_thanh_toan
            FROM thanhtoan
            WHERE id_thanh_toan = $1 AND da_xoa = false
        """
        row = await pool.fetchrow(sql, id_thanh_toan)
        return dict(row) if row else None

    async def create_payment(
        self,
        id_thanh_toan: UUID,
        id_don_hang: UUID,
        so_tien: float,
        phuong_thuc: str = "VNPay"
    ) -> Dict[str, Any]:
        """
        Tạo mới bản ghi thanh toán với trạng thái ChoThanhToan.
        """
        pool = get_pool()
        sql = """
            INSERT INTO thanhtoan (id_thanh_toan, id_don_hang, so_tien, phuong_thuc, trang_thai)
            VALUES ($1, $2, $3, $4, 'ChoThanhToan')
            RETURNING id_thanh_toan, id_don_hang, so_tien, phuong_thuc, trang_thai, ngay_tao
        """
        row = await pool.fetchrow(sql, id_thanh_toan, id_don_hang, so_tien, phuong_thuc)
        return dict(row) if row else {}

    async def update_payment_success(
        self,
        id_thanh_toan: UUID,
        ma_giao_dich: str
    ) -> bool:
        """
        Cập nhật bản ghi thanh toán thành công và tự động cập nhật trạng thái đơn hàng & SIM trong cùng transaction.
        """
        pool = get_pool()
        async with pool.acquire() as conn:
            async with conn.transaction():
                # 1. Cập nhật bảng thanhtoan
                sql_update_payment = """
                    UPDATE thanhtoan
                    SET trang_thai = 'ThanhCong',
                        ma_giao_dich = $2,
                        thoi_gian_thanh_toan = CURRENT_TIMESTAMP,
                        cap_nhat = CURRENT_TIMESTAMP
                    WHERE id_thanh_toan = $1 AND da_xoa = false
                    RETURNING id_don_hang
                """
                row = await conn.fetchrow(sql_update_payment, id_thanh_toan, ma_giao_dich)
                if not row:
                    return False

                id_don_hang = row["id_don_hang"]

                # 2. Cập nhật bảng donhangsim -> DaThanhToan
                sql_update_order = """
                    UPDATE donhangsim
                    SET trang_thai = 'DaThanhToan',
                        cap_nhat = CURRENT_TIMESTAMP
                    WHERE id_don_hang = $1 AND da_xoa = false
                """
                await conn.execute(sql_update_order, id_don_hang)

                # 3. Cập nhật các SIM thuộc đơn hàng -> DaBan
                sql_update_sim = """
                    UPDATE sim
                    SET trang_thai = 'DaBan',
                        cap_nhat = CURRENT_TIMESTAMP
                    WHERE id_sim IN (
                        SELECT id_sim FROM chitietdonhang WHERE id_don_hang = $1 AND da_xoa = false
                    ) AND da_xoa = false
                """
                await conn.execute(sql_update_sim, id_don_hang)

                return True

    async def update_payment_failed(self, id_thanh_toan: UUID, ma_giao_dich: Optional[str] = None) -> bool:
        """
        Cập nhật bản ghi thanh toán thành thất bại.
        """
        pool = get_pool()
        sql = """
            UPDATE thanhtoan
            SET trang_thai = 'ThatBai',
                ma_giao_dich = COALESCE($2, ma_giao_dich),
                cap_nhat = CURRENT_TIMESTAMP
            WHERE id_thanh_toan = $1 AND da_xoa = false
        """
        res = await pool.execute(sql, id_thanh_toan, ma_giao_dich)
        return "UPDATE" in res

    async def mark_payment_received(self, id_thanh_toan: UUID) -> Optional[Dict[str, Any]]:
        """
        Xác nhận khách hàng đã đến chi nhánh nhận SIM và đưa hóa đơn.
        """
        pool = get_pool()
        sql = """
            UPDATE thanhtoan
            SET da_nhan = true,
                thoi_gian_nhan = CURRENT_TIMESTAMP,
                cap_nhat = CURRENT_TIMESTAMP
            WHERE id_thanh_toan = $1 AND da_xoa = false
            RETURNING id_thanh_toan, id_don_hang, da_nhan, thoi_gian_nhan
        """
        row = await pool.fetchrow(sql, id_thanh_toan)
        return dict(row) if row else None

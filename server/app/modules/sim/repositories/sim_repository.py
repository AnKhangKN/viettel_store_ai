import uuid
from typing import Optional
from app.core.database import get_pool


class SimRepository:

    async def create_sim(
        self,
        id_sim: str,
        id_loai_sim: str,
        id_chi_nhanh: str,
        so_sim: str,
        gia_ban: float,
        trang_thai: str
    ):
        sql = """
            INSERT INTO sim (
                id_sim,
                id_loai_sim,
                id_chi_nhanh,
                so_sim,
                gia_ban,
                trang_thai
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id_sim, id_loai_sim, id_chi_nhanh, so_sim, gia_ban, trang_thai
        """

        sim_uuid = uuid.UUID(id_sim) if isinstance(id_sim, str) else id_sim
        type_uuid = uuid.UUID(id_loai_sim) if isinstance(id_loai_sim, str) else id_loai_sim
        branch_uuid = uuid.UUID(id_chi_nhanh) if isinstance(id_chi_nhanh, str) else id_chi_nhanh

        return await get_pool().fetchrow(
            sql,
            sim_uuid,
            type_uuid,
            branch_uuid,
            so_sim,
            gia_ban,
            trang_thai
        )

    async def find_by_number(self, so_sim: str):
        sql = """
            SELECT id_sim, so_sim
            FROM sim
            WHERE so_sim = $1 AND da_xoa = false
        """
        return await get_pool().fetchrow(sql, so_sim)

    async def find_customer_by_phone(self, phone: str):
        sql = """
            SELECT id_khach_hang, so_dien_thoai
            FROM khachhang
            WHERE so_dien_thoai = $1 AND da_xoa = false
        """
        return await get_pool().fetchrow(sql, phone)

    async def check_loaisim_exists(self, id_loai_sim: str):
        sql = """
            SELECT id_loai_sim
            FROM loaisim
            WHERE id_loai_sim = $1 AND da_xoa = false
        """
        db_uuid = uuid.UUID(id_loai_sim) if isinstance(id_loai_sim, str) else id_loai_sim
        return await get_pool().fetchrow(sql, db_uuid)

    async def get_sim_by_id(self, id_sim: str):
        sql = """
            SELECT 
                s.id_sim,
                s.so_sim,
                s.gia_ban,
                s.trang_thai,
                s.id_loai_sim,
                l.ten_loai_sim,
                s.id_chi_nhanh,
                c.ten_chi_nhanh
            FROM sim s
            LEFT JOIN loaisim l ON s.id_loai_sim = l.id_loai_sim
            LEFT JOIN chinhanh c ON s.id_chi_nhanh = c.id_chi_nhanh
            WHERE s.id_sim = $1 AND s.da_xoa = false
        """
        db_uuid = uuid.UUID(id_sim) if isinstance(id_sim, str) else id_sim
        return await get_pool().fetchrow(sql, db_uuid)

    async def get_sims_by_branch(self, id_chi_nhanh: str):
        sql = """
            SELECT 
                s.id_sim,
                s.so_sim,
                s.gia_ban,
                s.trang_thai,
                s.id_loai_sim,
                l.ten_loai_sim,
                s.id_chi_nhanh,
                c.ten_chi_nhanh
            FROM sim s
            LEFT JOIN loaisim l ON s.id_loai_sim = l.id_loai_sim
            LEFT JOIN chinhanh c ON s.id_chi_nhanh = c.id_chi_nhanh
            WHERE s.id_chi_nhanh = $1 AND s.da_xoa = false
            ORDER BY s.ngay_tao DESC
        """
        db_uuid = uuid.UUID(id_chi_nhanh) if isinstance(id_chi_nhanh, str) else id_chi_nhanh
        return await get_pool().fetch(sql, db_uuid)

    async def get_all_sims(self):
        sql = """
            SELECT 
                s.id_sim,
                s.so_sim,
                s.gia_ban,
                s.trang_thai,
                s.id_loai_sim,
                l.ten_loai_sim,
                s.id_chi_nhanh,
                c.ten_chi_nhanh
            FROM sim s
            LEFT JOIN loaisim l ON s.id_loai_sim = l.id_loai_sim
            LEFT JOIN chinhanh c ON s.id_chi_nhanh = c.id_chi_nhanh
            WHERE s.da_xoa = false
            ORDER BY s.ngay_tao DESC
        """
        return await get_pool().fetch(sql)

    async def update_sim(
        self,
        id_sim: str,
        id_loai_sim: str,
        id_chi_nhanh: str,
        so_sim: str,
        gia_ban: float,
        trang_thai: str
    ):
        sql = """
            UPDATE sim
            SET
                id_loai_sim = $2,
                id_chi_nhanh = $3,
                so_sim = $4,
                gia_ban = $5,
                trang_thai = $6,
                cap_nhat = CURRENT_TIMESTAMP
            WHERE id_sim = $1 AND da_xoa = false
            RETURNING id_sim, id_loai_sim, id_chi_nhanh, so_sim, gia_ban, trang_thai
        """
        sim_uuid = uuid.UUID(id_sim) if isinstance(id_sim, str) else id_sim
        type_uuid = uuid.UUID(id_loai_sim) if isinstance(id_loai_sim, str) else id_loai_sim
        branch_uuid = uuid.UUID(id_chi_nhanh) if isinstance(id_chi_nhanh, str) else id_chi_nhanh
        return await get_pool().fetchrow(sql, sim_uuid, type_uuid, branch_uuid, so_sim, gia_ban, trang_thai)

    async def get_all_loai_sim(self):
        sql = """
            SELECT id_loai_sim, ten_loai_sim, gia_ban, mo_ta, trang_thai
            FROM loaisim
            WHERE da_xoa = false
            ORDER BY ngay_tao DESC
        """
        return await get_pool().fetch(sql)

    async def find_loai_sim_by_name(self, ten_loai_sim: str):
        sql = """
            SELECT id_loai_sim, ten_loai_sim
            FROM loaisim
            WHERE ten_loai_sim = $1 AND da_xoa = false
        """
        return await get_pool().fetchrow(sql, ten_loai_sim)

    async def get_loai_sim_by_id(self, id_loai_sim: str):
        sql = """
            SELECT id_loai_sim, ten_loai_sim, gia_ban, mo_ta, trang_thai
            FROM loaisim
            WHERE id_loai_sim = $1 AND da_xoa = false
        """
        db_uuid = uuid.UUID(id_loai_sim) if isinstance(id_loai_sim, str) else id_loai_sim
        return await get_pool().fetchrow(sql, db_uuid)

    async def create_loai_sim(
        self,
        id_loai_sim: str,
        ten_loai_sim: str,
        mo_ta: Optional[str],
        trang_thai: str,
        gia_ban: float = 0.0
    ):
        sql = """
            INSERT INTO loaisim (
                id_loai_sim,
                ten_loai_sim,
                gia_ban,
                mo_ta,
                trang_thai
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id_loai_sim, ten_loai_sim, gia_ban, mo_ta, trang_thai
        """
        type_uuid = uuid.UUID(id_loai_sim) if isinstance(id_loai_sim, str) else id_loai_sim
        return await get_pool().fetchrow(sql, type_uuid, ten_loai_sim, gia_ban, mo_ta, trang_thai)

    async def update_loai_sim(
        self,
        id_loai_sim: str,
        ten_loai_sim: str,
        mo_ta: Optional[str],
        trang_thai: str,
        gia_ban: float = 0.0
    ):
        sql = """
            UPDATE loaisim
            SET
                ten_loai_sim = $2,
                gia_ban = $3,
                mo_ta = $4,
                trang_thai = $5,
                cap_nhat = CURRENT_TIMESTAMP
            WHERE id_loai_sim = $1 AND da_xoa = false
            RETURNING id_loai_sim, ten_loai_sim, gia_ban, mo_ta, trang_thai
        """
        type_uuid = uuid.UUID(id_loai_sim) if isinstance(id_loai_sim, str) else id_loai_sim
        return await get_pool().fetchrow(sql, type_uuid, ten_loai_sim, gia_ban, mo_ta, trang_thai)


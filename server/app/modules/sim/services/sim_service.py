from fastapi import status
from app.core.exceptions import AppException
from app.common.utils.uuid import generate_uuid7
from app.modules.sim.repositories.sim_repository import SimRepository
from app.modules.sim.schemas.sim_schema import SimCreateRequest, LoaiSimCreateRequest
from app.modules.branch.repositories.branch_repository import BranchRepository

class SimService:

    def __init__(self):
        self.repository = SimRepository()
        self.branch_repository = BranchRepository()

    async def create_sim(self, body: SimCreateRequest):
        # 1. Kiểm tra số SIM đã tồn tại chưa
        existing = await self.repository.find_by_number(body.so_sim)
        if existing:
            raise AppException(
                status_code=status.HTTP_409_CONFLICT,
                message=f"Số SIM '{body.so_sim}' đã tồn tại trong hệ thống"
            )

        # 1.1 Kiểm tra trùng với số điện thoại của khách hàng đã đăng ký
        existing_customer = await self.repository.find_customer_by_phone(body.so_sim)
        if existing_customer:
            raise AppException(
                status_code=status.HTTP_409_CONFLICT,
                message=f"Số SIM '{body.so_sim}' trùng với số điện thoại của một khách hàng đã đăng ký trên hệ thống"
            )

        # 2. Kiểm tra loại SIM có tồn tại không
        loai_sim = await self.repository.check_loaisim_exists(body.id_loai_sim)
        if not loai_sim:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message=f"Loại SIM có ID '{body.id_loai_sim}' không tồn tại"
            )

        # 3. Sinh ID và tạo
        id_sim = generate_uuid7()
        res = await self.repository.create_sim(
            id_sim=id_sim,
            id_loai_sim=body.id_loai_sim,
            so_sim=body.so_sim,
            gia_ban=body.gia_ban,
            trang_thai=body.trang_thai or "ConHang"
        )

        return {
            "success": True,
            "data": {
                "id_sim": str(res["id_sim"]),
                "id_loai_sim": str(res["id_loai_sim"]),
                "so_sim": res["so_sim"],
                "gia_ban": float(res["gia_ban"]),
                "trang_thai": res["trang_thai"]
            }
        }

    async def get_sim_details(self, id_sim: str):
        r = await self.repository.get_sim_by_id(id_sim)
        if not r:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="SIM không tồn tại hoặc đã bị xóa"
            )

        return {
            "success": True,
            "data": {
                "id_sim": str(r["id_sim"]),
                "so_sim": r["so_sim"],
                "loai_sim": {
                    "id_loai_sim": str(r["id_loai_sim"]) if r["id_loai_sim"] else None,
                    "ten_loai_sim": r["ten_loai_sim"] if r["ten_loai_sim"] else None
                },
                "gia_ban": float(r["gia_ban"]),
                "trang_thai": r["trang_thai"]
            }
        }

    async def get_sims_by_branch(self, id_chi_nhanh: str):
        rows = await self.repository.get_sims_by_branch(id_chi_nhanh)
        sims = []
        for r in rows:
            sims.append({
                "id_sim": str(r["id_sim"]),
                "so_sim": r["so_sim"],
                "loai_sim": {
                    "id_loai_sim": str(r["id_loai_sim"]) if r["id_loai_sim"] else None,
                    "ten_loai_sim": r["ten_loai_sim"] if r["ten_loai_sim"] else None
                },
                "gia_ban": float(r["gia_ban"]),
                "trang_thai": r["trang_thai"]
            })

        return {
            "success": True,
            "data": sims
        }

    async def get_all_sims(self):
        rows = await self.repository.get_all_sims()
        sims = []
        for r in rows:
            sims.append({
                "id_sim": str(r["id_sim"]),
                "so_sim": r["so_sim"],
                "loai_sim": {
                    "id_loai_sim": str(r["id_loai_sim"]) if r["id_loai_sim"] else None,
                    "ten_loai_sim": r["ten_loai_sim"] if r["ten_loai_sim"] else None
                },
                "gia_ban": float(r["gia_ban"]),
                "trang_thai": r["trang_thai"]
            })

        return {
            "success": True,
            "data": sims
        }

    async def update_sim(self, id_sim: str, body: SimCreateRequest):
        # 1. Kiểm tra tồn tại
        existing = await self.repository.get_sim_by_id(id_sim)
        if not existing:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="SIM không tồn tại hoặc đã bị xóa"
            )

        # 2. Kiểm tra trùng số SIM (nếu thay đổi số SIM)
        if existing["so_sim"] != body.so_sim:
            num_check = await self.repository.find_by_number(body.so_sim)
            if num_check:
                raise AppException(
                    status_code=status.HTTP_409_CONFLICT,
                    message=f"Số SIM '{body.so_sim}' đã tồn tại ở một SIM khác"
                )

            # Kiểm tra trùng với số điện thoại của khách hàng đã đăng ký
            existing_customer = await self.repository.find_customer_by_phone(body.so_sim)
            if existing_customer:
                raise AppException(
                    status_code=status.HTTP_409_CONFLICT,
                    message=f"Số SIM '{body.so_sim}' trùng với số điện thoại của một khách hàng đã đăng ký trên hệ thống"
                )

        # 3. Kiểm tra loại SIM có tồn tại không
        loai_sim = await self.repository.check_loaisim_exists(body.id_loai_sim)
        if not loai_sim:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message=f"Loại SIM có ID '{body.id_loai_sim}' không tồn tại"
            )

        # 4. Cập nhật dữ liệu
        res = await self.repository.update_sim(
            id_sim=id_sim,
            id_loai_sim=body.id_loai_sim,
            so_sim=body.so_sim,
            gia_ban=body.gia_ban,
            trang_thai=body.trang_thai or "ConHang"
        )

        return {
            "success": True,
            "data": {
                "id_sim": str(res["id_sim"]),
                "id_loai_sim": str(res["id_loai_sim"]),
                "so_sim": res["so_sim"],
                "gia_ban": float(res["gia_ban"]),
                "trang_thai": res["trang_thai"]
            }
        }

    async def get_all_loai_sim(self):
        rows = await self.repository.get_all_loai_sim()
        types = []
        for r in rows:
            types.append({
                "id_loai_sim": str(r["id_loai_sim"]),
                "ten_loai_sim": r["ten_loai_sim"],
                "gia_ban": float(r["gia_ban"]),
                "mo_ta": r["mo_ta"],
                "trang_thai": r["trang_thai"]
            })
        return {
            "success": True,
            "data": types
        }

    async def create_loai_sim(self, body: LoaiSimCreateRequest):
        # 1. Kiểm tra trùng tên loại SIM
        existing = await self.repository.find_loai_sim_by_name(body.ten_loai_sim)
        if existing:
            raise AppException(
                status_code=status.HTTP_409_CONFLICT,
                message=f"Loại SIM '{body.ten_loai_sim}' đã tồn tại trong hệ thống"
            )

        # 2. Tạo mới loại SIM với giá bán mặc định = 0.0
        id_loai_sim = generate_uuid7()
        res = await self.repository.create_loai_sim(
            id_loai_sim=id_loai_sim,
            ten_loai_sim=body.ten_loai_sim,
            mo_ta=body.mo_ta,
            trang_thai=body.trang_thai or "DangBan",
            gia_ban=0.0
        )

        return {
            "success": True,
            "data": {
                "id_loai_sim": str(res["id_loai_sim"]),
                "ten_loai_sim": res["ten_loai_sim"],
                "gia_ban": float(res["gia_ban"]),
                "mo_ta": res["mo_ta"],
                "trang_thai": res["trang_thai"]
            }
        }

    async def update_loai_sim(self, id_loai_sim: str, body: LoaiSimCreateRequest):
        # 1. Kiểm tra tồn tại
        existing = await self.repository.get_loai_sim_by_id(id_loai_sim)
        if not existing:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Loại SIM không tồn tại hoặc đã bị xóa"
            )

        # 2. Kiểm tra trùng tên loại SIM khác
        if existing["ten_loai_sim"] != body.ten_loai_sim:
            name_check = await self.repository.find_loai_sim_by_name(body.ten_loai_sim)
            if name_check:
                raise AppException(
                    status_code=status.HTTP_409_CONFLICT,
                    message=f"Tên loại SIM '{body.ten_loai_sim}' đã tồn tại ở một loại SIM khác"
                )

        # 3. Cập nhật loại SIM
        res = await self.repository.update_loai_sim(
            id_loai_sim=id_loai_sim,
            ten_loai_sim=body.ten_loai_sim,
            mo_ta=body.mo_ta,
            trang_thai=body.trang_thai or "DangBan",
            gia_ban=0.0
        )

        return {
            "success": True,
            "data": {
                "id_loai_sim": str(res["id_loai_sim"]),
                "ten_loai_sim": res["ten_loai_sim"],
                "gia_ban": float(res["gia_ban"]),
                "mo_ta": res["mo_ta"],
                "trang_thai": res["trang_thai"]
            }
        }



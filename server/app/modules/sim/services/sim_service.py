from fastapi import status
from app.core.exceptions import AppException
from app.common.utils.uuid import generate_uuid7
from app.modules.sim.repositories.sim_repository import SimRepository
from app.modules.sim.schemas.sim_schema import SimCreateRequest
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

        # 2. Kiểm tra loại SIM có tồn tại không
        loai_sim = await self.repository.check_loaisim_exists(body.id_loai_sim)
        if not loai_sim:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message=f"Loại SIM có ID '{body.id_loai_sim}' không tồn tại"
            )

        # 3. Kiểm tra chi nhánh có tồn tại không
        branch = await self.branch_repository.get_by_id(body.id_chi_nhanh)
        if not branch:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message=f"Chi nhánh có ID '{body.id_chi_nhanh}' không tồn tại"
            )

        # 4. Sinh ID và tạo
        id_sim = generate_uuid7()
        res = await self.repository.create_sim(
            id_sim=id_sim,
            id_loai_sim=body.id_loai_sim,
            id_chi_nhanh=body.id_chi_nhanh,
            so_sim=body.so_sim,
            gia_ban=body.gia_ban,
            trang_thai=body.trang_thai or "ConHang"
        )

        return {
            "success": True,
            "data": {
                "id_sim": str(res["id_sim"]),
                "id_loai_sim": str(res["id_loai_sim"]),
                "id_chi_nhanh": str(res["id_chi_nhanh"]),
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
                "chi_nhanh": {
                    "id_chi_nhanh": str(r["id_chi_nhanh"]) if r["id_chi_nhanh"] else None,
                    "ten_chi_nhanh": r["ten_chi_nhanh"] if r["ten_chi_nhanh"] else None
                },
                "gia_ban": float(r["gia_ban"]),
                "trang_thai": r["trang_thai"]
            }
        }

    async def get_sims_by_branch(self, id_chi_nhanh: str):
        # 1. Kiểm tra xem chi nhánh có tồn tại không
        branch = await self.branch_repository.get_by_id(id_chi_nhanh)
        if not branch:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message=f"Chi nhánh có ID '{id_chi_nhanh}' không tồn tại"
            )

        # 2. Lấy danh sách SIM
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
                "chi_nhanh": {
                    "id_chi_nhanh": str(r["id_chi_nhanh"]) if r["id_chi_nhanh"] else None,
                    "ten_chi_nhanh": r["ten_chi_nhanh"] if r["ten_chi_nhanh"] else None
                },
                "gia_ban": float(r["gia_ban"]),
                "trang_thai": r["trang_thai"]
            })

        return {
            "success": True,
            "data": sims
        }

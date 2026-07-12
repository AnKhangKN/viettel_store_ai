import random
from fastapi import status
from app.core.exceptions import AppException
from app.common.utils.uuid import generate_uuid7
from app.modules.branch.repositories.branch_repository import BranchRepository
from app.modules.branch.schemas.branch_schema import BranchCreateRequest

class BranchService:

    def __init__(self):
        self.repository = BranchRepository()

    async def create_branch(self, body: BranchCreateRequest):
        
        # 1. Determine or generate hotline
        hotline = body.so_hotline
        if not hotline:
            # Generate random unique hotline
            for _ in range(10):
                temp_hotline = f"1800{random.randint(1000, 9999)}"
                existing = await self.repository.get_by_hotline(temp_hotline)
                if not existing:
                    hotline = temp_hotline
                    break
            if not hotline:
                raise AppException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    message="Không thể tạo hotline ngẫu nhiên không trùng lặp"
                )
        else:
            # Check if hotline already exists
            existing = await self.repository.get_by_hotline(hotline)
            if existing:
                raise AppException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    message=f"Số hotline {hotline} đã tồn tại"
                )

        # 2. Determine or generate branch name
        name = body.ten_chi_nhanh
        if not name:
            name = f"Viettel Store {body.dia_chi} {random.randint(1, 1000)}"

        # 3. Generate ID
        branch_id = generate_uuid7()

        # 4. Save to database
        res = await self.repository.create(
            id_chi_nhanh=branch_id,
            ten_chi_nhanh=name,
            dia_chi=body.dia_chi,
            so_hotline=hotline,
            gio_lam_viec=body.gio_lam_viec or "08:00 - 22:00"
        )

        return {
            "success": True,
            "data": {
                "id_chi_nhanh": str(res["id_chi_nhanh"]),
                "ten_chi_nhanh": res["ten_chi_nhanh"],
                "dia_chi": res["dia_chi"],
                "so_hotline": res["so_hotline"],
                "gio_lam_viec": res["gio_lam_viec"],
                "trang_thai": res["trang_thai"]
            }
        }

    async def get_all_branches(self):
        rows = await self.repository.get_all()

        branches = []
        for r in rows:
            # Generate mock email from branch name
            name_slug = self._slugify(r["ten_chi_nhanh"])
            email = f"{name_slug}@viettelstore.vn"

            branches.append({
                "id_chi_nhanh": str(r["id_chi_nhanh"]),
                "ten_chi_nhanh": r["ten_chi_nhanh"],
                "dia_chi": r["dia_chi"],
                "so_hotline": r["so_hotline"],
                "email": email,
                "trang_thai": r["trang_thai"]
            })

        return {
            "success": True,
            "data": branches
        }

    async def get_branch_details(self, id_chi_nhanh: str):
        r = await self.repository.get_by_id(id_chi_nhanh)
        if not r:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Chi nhánh không tồn tại hoặc đã bị xóa"
            )

        name_slug = self._slugify(r["ten_chi_nhanh"])
        email = f"{name_slug}@viettelstore.vn"

        return {
            "success": True,
            "data": {
                "id_chi_nhanh": str(r["id_chi_nhanh"]),
                "ten_chi_nhanh": r["ten_chi_nhanh"],
                "dia_chi": r["dia_chi"],
                "so_hotline": r["so_hotline"],
                "email": email,
                "trang_thai": r["trang_thai"]
            }
        }

    async def update_branch(self, id_chi_nhanh: str, body: BranchCreateRequest):
        # 1. Kiểm tra tồn tại
        existing = await self.repository.get_by_id(id_chi_nhanh)
        if not existing:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Chi nhánh không tồn tại hoặc đã bị xóa"
            )

        # 2. Kiểm tra trùng hotline (nếu thay đổi hotline)
        hotline = body.so_hotline or existing["so_hotline"]
        if hotline != existing["so_hotline"]:
            hotline_check = await self.repository.get_by_hotline(hotline)
            if hotline_check:
                raise AppException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    message=f"Số hotline {hotline} đã được sử dụng bởi chi nhánh khác"
                )

        # 3. Xác định các giá trị cập nhật
        name = body.ten_chi_nhanh or existing["ten_chi_nhanh"]
        trang_thai_val = body.trang_thai or existing["trang_thai"]

        # 4. Thực thi cập nhật
        res = await self.repository.update(
            id_chi_nhanh=id_chi_nhanh,
            ten_chi_nhanh=name,
            dia_chi=body.dia_chi,
            so_hotline=hotline,
            gio_lam_viec=body.gio_lam_viec or "08:00 - 22:00",
            trang_thai=trang_thai_val
        )

        return {
            "success": True,
            "data": {
                "id_chi_nhanh": str(res["id_chi_nhanh"]),
                "ten_chi_nhanh": res["ten_chi_nhanh"],
                "dia_chi": res["dia_chi"],
                "so_hotline": res["so_hotline"],
                "gio_lam_viec": res["gio_lam_viec"],
                "trang_thai": res["trang_thai"]
            }
        }


    def _slugify(self, text: str) -> str:
        import unicodedata
        import re
        text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')
        text = text.lower()
        text = re.sub(r'[^a-z0-9]', '_', text)
        text = re.sub(r'_+', '_', text)
        return text.strip('_')

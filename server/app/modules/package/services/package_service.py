from fastapi import status
from app.core.exceptions import AppException
from app.common.utils.uuid import generate_uuid7
from app.modules.package.repositories.package_repository import PackageRepository
from app.modules.package.schemas.package_schema import PackageCreateRequest

class PackageService:

    def __init__(self):
        self.repository = PackageRepository()

    async def create_package(self, body: PackageCreateRequest):
        # 1. Kiểm tra tên gói cước đã tồn tại chưa
        existing = await self.repository.find_by_name(body.ten_goi)
        if existing:
            raise AppException(
                status_code=status.HTTP_409_CONFLICT,
                message=f"Gói cước '{body.ten_goi}' đã tồn tại trong hệ thống"
            )

        # 2. Lưu vào database
        id_goi = generate_uuid7()
        res = await self.repository.create_package(
            id_goi=id_goi,
            ten_goi=body.ten_goi,
            mo_ta=body.mo_ta,
            gia_cuoc=body.gia_cuoc,
            dung_luong_gb=body.dung_luong_gb,
            thoi_han_ngay=body.thoi_han_ngay,
            so_phut_goi=body.so_phut_goi,
            so_sms=body.so_sms,
            trang_thai=body.trang_thai or "DangApDung"
        )

        return {
            "success": True,
            "data": {
                "id_goi": str(res["id_goi"]),
                "ten_goi": res["ten_goi"],
                "mo_ta": res["mo_ta"],
                "gia_cuoc": float(res["gia_cuoc"]),
                "dung_luong_gb": float(res["dung_luong_gb"]),
                "thoi_han_ngay": res["thoi_han_ngay"],
                "so_phut_goi": res["so_phut_goi"],
                "so_sms": res["so_sms"],
                "trang_thai": res["trang_thai"]
            }
        }

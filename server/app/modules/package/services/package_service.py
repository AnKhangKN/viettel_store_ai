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

    async def get_all_packages(self):
        records = await self.repository.get_all_packages()
        data = []
        for record in records:
            data.append({
                "id_goi": str(record["id_goi"]),
                "ten_goi": record["ten_goi"],
                "gia_cuoc": float(record["gia_cuoc"]),
                "thoi_han_ngay": record["thoi_han_ngay"],
                "dung_luong_gb": float(record["dung_luong_gb"]),
                "trang_thai": record["trang_thai"]
            })
        return {
            "success": True,
            "data": data
        }

    async def get_package_by_id(self, id_goi: str):
        record = await self.repository.get_package_by_id(id_goi)
        if not record:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Gói cước không tồn tại hoặc đã bị xóa"
            )
        return {
            "success": True,
            "data": {
                "id_goi": str(record["id_goi"]),
                "ten_goi": record["ten_goi"],
                "gia_cuoc": float(record["gia_cuoc"]),
                "thoi_han_ngay": record["thoi_han_ngay"],
                "dung_luong_gb": float(record["dung_luong_gb"]),
                "so_phut_goi": record["so_phut_goi"],
                "so_sms": record["so_sms"],
                "mo_ta": record["mo_ta"],
                "trang_thai": record["trang_thai"]
            }
        }

    async def update_package(self, id_goi: str, body: PackageCreateRequest):
        # 1. Kiểm tra tồn tại
        existing = await self.repository.get_package_by_id(id_goi)
        if not existing:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Gói cước không tồn tại hoặc đã bị xóa"
            )

        # 2. Kiểm tra trùng tên (nếu thay đổi tên)
        if existing["ten_goi"] != body.ten_goi:
            name_check = await self.repository.find_by_name(body.ten_goi)
            if name_check:
                raise AppException(
                    status_code=status.HTTP_409_CONFLICT,
                    message=f"Tên gói cước '{body.ten_goi}' đã tồn tại ở một gói cước khác"
                )

        # 3. Cập nhật dữ liệu
        res = await self.repository.update_package(
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


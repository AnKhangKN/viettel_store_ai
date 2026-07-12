from app.modules.package.services.package_service import PackageService
from app.modules.package.schemas.package_schema import PackageCreateRequest

class PackageController:

    def __init__(self):
        self.service = PackageService()

    async def create_package(self, body: PackageCreateRequest):
        return await self.service.create_package(body)

    async def get_all_packages(self):
        return await self.service.get_all_packages()

    async def get_package_details(self, id_goi: str):
        return await self.service.get_package_by_id(id_goi)

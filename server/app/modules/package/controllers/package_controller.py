from app.modules.package.services.package_service import PackageService
from app.modules.package.schemas.package_schema import PackageCreateRequest

class PackageController:

    def __init__(self):
        self.service = PackageService()

    async def create_package(self, body: PackageCreateRequest):
        return await self.service.create_package(body)

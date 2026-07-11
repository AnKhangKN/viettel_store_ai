from fastapi import APIRouter
from app.modules.package.controllers.package_controller import PackageController

class PackageRoutes:

    def __init__(self):
        self.router = APIRouter(
            prefix="/package",
            tags=["Package"]
        )
        controller = PackageController()

        self.router.post("")(controller.create_package)

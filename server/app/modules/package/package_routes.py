from fastapi import APIRouter, Depends
from app.modules.package.controllers.package_controller import PackageController
from app.common.dependencies.admin_dependency import get_current_admin

class PackageRoutes:

    def __init__(self):
        self.router = APIRouter(
            prefix="/package",
            tags=["Package"]
        )
        controller = PackageController()

        self.router.post("", dependencies=[Depends(get_current_admin)])(controller.create_package)
        self.router.get("")(controller.get_all_packages)
        self.router.get("/{id_goi}")(controller.get_package_details)

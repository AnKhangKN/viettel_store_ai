from fastapi import APIRouter, Depends
from app.modules.branch.controllers.branch_controller import BranchController
from app.common.dependencies.admin_dependency import get_current_admin

class BranchRoutes:

    def __init__(self):
        self.router = APIRouter(
            prefix="/branch",
            tags=["Branch"]
        )
        controller = BranchController()

        self.router.post("", dependencies=[Depends(get_current_admin)])(controller.create_branch)
        self.router.get("")(controller.get_all_branches)
        self.router.get("/{id_chi_nhanh}")(controller.get_branch_details)

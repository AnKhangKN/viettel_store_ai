from fastapi import APIRouter
from app.modules.branch.controllers.branch_controller import BranchController

class BranchRoutes:

    def __init__(self):
        self.router = APIRouter(
            prefix="/branch",
            tags=["Branch"]
        )
        controller = BranchController()

        self.router.post("")(controller.create_branch)
        self.router.get("")(controller.get_all_branches)
        self.router.get("/{id_chi_nhanh}")(controller.get_branch_details)

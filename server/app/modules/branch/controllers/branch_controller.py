from app.modules.branch.services.branch_service import BranchService
from app.modules.branch.schemas.branch_schema import BranchCreateRequest

class BranchController:

    def __init__(self):
        self.service = BranchService()

    async def create_branch(self, body: BranchCreateRequest):
        return await self.service.create_branch(body)

    async def get_all_branches(self):
        return await self.service.get_all_branches()

    async def get_branch_details(self, id_chi_nhanh: str):
        return await self.service.get_branch_details(id_chi_nhanh)

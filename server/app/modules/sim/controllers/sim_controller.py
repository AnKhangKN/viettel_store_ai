from app.modules.sim.services.sim_service import SimService
from app.modules.sim.schemas.sim_schema import SimCreateRequest

class SimController:

    def __init__(self):
        self.service = SimService()

    async def create_sim(self, body: SimCreateRequest):
        return await self.service.create_sim(body)

    async def get_sim_details(self, id_sim: str):
        return await self.service.get_sim_details(id_sim)

    async def get_sims_by_branch(self, id_chi_nhanh: str):
        return await self.service.get_sims_by_branch(id_chi_nhanh)

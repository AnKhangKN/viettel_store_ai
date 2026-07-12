from app.modules.sim.services.sim_service import SimService
from app.modules.sim.schemas.sim_schema import SimCreateRequest, LoaiSimCreateRequest

class SimController:

    def __init__(self):
        self.service = SimService()

    async def create_sim(self, body: SimCreateRequest):
        return await self.service.create_sim(body)

    async def get_sim_details(self, id_sim: str):
        return await self.service.get_sim_details(id_sim)

    async def get_sims_by_branch(self, id_chi_nhanh: str):
        return await self.service.get_sims_by_branch(id_chi_nhanh)

    async def get_all_sims(self):
        return await self.service.get_all_sims()

    async def update_sim(self, id_sim: str, body: SimCreateRequest):
        return await self.service.update_sim(id_sim, body)

    async def get_all_loai_sim(self):
        return await self.service.get_all_loai_sim()

    async def create_loai_sim(self, body: LoaiSimCreateRequest):
        return await self.service.create_loai_sim(body)

    async def update_loai_sim(self, id_loai_sim: str, body: LoaiSimCreateRequest):
        return await self.service.update_loai_sim(id_loai_sim, body)


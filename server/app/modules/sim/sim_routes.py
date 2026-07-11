from fastapi import APIRouter
from app.modules.sim.controllers.sim_controller import SimController

class SimRoutes:

    def __init__(self):
        self.router = APIRouter(
            prefix="/sim",
            tags=["Sim"]
        )
        controller = SimController()

        self.router.post("")(controller.create_sim)
        self.router.get("/{id_sim}")(controller.get_sim_details)
        self.router.get("/branch/{id_chi_nhanh}")(controller.get_sims_by_branch)

from fastapi import APIRouter, Depends
from app.modules.sim.controllers.sim_controller import SimController
from app.common.dependencies.admin_dependency import get_current_admin

class SimRoutes:

    def __init__(self):
        self.router = APIRouter(
            prefix="/sim",
            tags=["Sim"]
        )
        controller = SimController()

        self.router.post("", dependencies=[Depends(get_current_admin)])(controller.create_sim)
        self.router.get("", dependencies=[Depends(get_current_admin)])(controller.get_all_sims)
        self.router.get("/types")(controller.get_all_loai_sim)
        self.router.post("/types", dependencies=[Depends(get_current_admin)])(controller.create_loai_sim)
        self.router.patch("/types/{id_loai_sim}", dependencies=[Depends(get_current_admin)])(controller.update_loai_sim)
        self.router.get("/{id_sim}")(controller.get_sim_details)
        self.router.get("/branch/{id_chi_nhanh}")(controller.get_sims_by_branch)
        self.router.patch("/{id_sim}", dependencies=[Depends(get_current_admin)])(controller.update_sim)



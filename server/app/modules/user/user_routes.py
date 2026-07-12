from fastapi import APIRouter, Depends
from app.modules.user.controllers.user_controller import UserController
from app.common.dependencies.admin_dependency import get_current_admin
from app.common.dependencies.staff_dependency import get_current_staff

class UserRoutes:

    def __init__(self):
        self.router = APIRouter(
            prefix="/user",
            tags=["User"]
        )
        controller = UserController()

        self.router.post("/employee", dependencies=[Depends(get_current_admin)])(controller.create_employee)
        self.router.get("/employee", dependencies=[Depends(get_current_admin)])(controller.get_all_employees)
        self.router.get("/employee/{id_khach_hang}", dependencies=[Depends(get_current_admin)])(controller.get_employee_details)
        self.router.patch("/employee/{id_khach_hang}/approve", dependencies=[Depends(get_current_admin)])(controller.approve_employee)
        self.router.get("/customer", dependencies=[Depends(get_current_staff)])(controller.get_all_customers)
        self.router.get("/customer/{id_khach_hang}", dependencies=[Depends(get_current_staff)])(controller.get_customer_details)
        self.router.get("/account", dependencies=[Depends(get_current_admin)])(controller.get_all_accounts)
        self.router.patch("/account/{id_khach_hang}/role", dependencies=[Depends(get_current_admin)])(controller.update_account_role)

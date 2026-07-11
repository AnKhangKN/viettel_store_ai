from fastapi import APIRouter
from app.modules.user.controllers.user_controller import UserController

class UserRoutes:

    def __init__(self):
        self.router = APIRouter(
            prefix="/user",
            tags=["User"]
        )
        controller = UserController()

        self.router.post("/employee")(controller.create_employee)
        self.router.get("/employee")(controller.get_all_employees)
        self.router.get("/employee/{id_khach_hang}")(controller.get_employee_details)
        self.router.patch("/employee/{id_khach_hang}/approve")(controller.approve_employee)
        self.router.get("/customer")(controller.get_all_customers)
        self.router.get("/customer/{id_khach_hang}")(controller.get_customer_details)

from fastapi import Depends
from app.modules.user.services.user_service import UserService
from app.modules.user.schemas.user_schema import EmployeeCreateRequest, EmployeeApproveRequest, AccountRoleUpdateRequest, UserProfileUpdateRequest
from app.common.dependencies.user_dependency import get_current_user

class UserController:

    def __init__(self):
        self.service = UserService()

    async def create_employee(self, body: EmployeeCreateRequest):
        return await self.service.create_employee(body)

    async def get_all_employees(self):
        return await self.service.get_all_employees()

    async def get_employee_details(self, id_khach_hang: str):
        return await self.service.get_employee_details(id_khach_hang)

    async def approve_employee(self, id_khach_hang: str, body: EmployeeApproveRequest):
        return await self.service.approve_employee(id_khach_hang, body)

    async def get_all_customers(self):
        return await self.service.get_all_customers()

    async def get_customer_details(self, id_khach_hang: str):
        return await self.service.get_customer_details(id_khach_hang)

    async def get_all_accounts(self):
        return await self.service.get_all_accounts()

    async def update_account_role(self, id_khach_hang: str, body: AccountRoleUpdateRequest):
        return await self.service.update_account_role(id_khach_hang, body)

    async def update_profile(self, body: UserProfileUpdateRequest, current_user: dict = Depends(get_current_user)):
        return await self.service.update_profile(current_user, body)

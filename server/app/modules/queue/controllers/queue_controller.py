from fastapi import Depends
from app.modules.queue.services.queue_service import QueueService
from app.modules.queue.schemas.queue_schema import (
    ServiceCreateRequest, 
    ServiceUpdateRequest, 
    QueueTicketCreateRequest,
    TicketStatusUpdateRequest
)
from app.modules.queue.schemas.booth_schema import (
    BoothSelectRequest, 
    BoothReleaseRequest, 
    BoothAdminCreateRequest, 
    BoothAdminUpdateRequest
)
from app.common.dependencies.staff_dependency import get_current_staff
from app.common.dependencies.admin_dependency import get_current_admin

class QueueController:

    def __init__(self):
        self.service = QueueService()

    async def get_all_services(self):
        return await self.service.get_all_services()

    async def create_service(self, body: ServiceCreateRequest):
        return await self.service.create_service(body)

    async def update_service(self, id_loai_giao_dich: str, body: ServiceUpdateRequest):
        return await self.service.update_service(id_loai_giao_dich, body)

    async def delete_service(self, id_loai_giao_dich: str):
        return await self.service.delete_service(id_loai_giao_dich)

    async def create_queue_ticket(self, body: QueueTicketCreateRequest):
        return await self.service.create_queue_ticket(body)

    async def get_staff_queue_tickets(self, current_user: dict = Depends(get_current_staff)):
        return await self.service.get_staff_queue_tickets(current_user["id_khach_hang"])

    async def update_ticket_status(self, id_phieu: str, body: TicketStatusUpdateRequest, current_user: dict = Depends(get_current_staff)):
        return await self.service.update_ticket_status(id_phieu, body.trang_thai, current_user["id_khach_hang"])

    async def get_booths_status(self, current_user: dict = Depends(get_current_staff)):
        return await self.service.get_booths_status(current_user["id_khach_hang"])

    async def select_booth(self, body: BoothSelectRequest, current_user: dict = Depends(get_current_staff)):
        return await self.service.select_booth(current_user["id_khach_hang"], body.ten_quay)

    async def release_booth(self, body: BoothReleaseRequest | None = None, current_user: dict = Depends(get_current_staff)):
        ten_quay = body.ten_quay if body else None
        return await self.service.release_booth(current_user["id_khach_hang"], ten_quay)

    # --- ADMIN BOOTHS CRUD ---
    async def get_all_booths_admin(self):
        return await self.service.get_all_booths_admin()

    async def create_booth_admin(self, body: BoothAdminCreateRequest):
        return await self.service.create_booth_admin(body)

    async def update_booth_admin(self, id_quay: str, body: BoothAdminUpdateRequest):
        return await self.service.update_booth_admin(id_quay, body)

    async def delete_booth_admin(self, id_quay: str):
        return await self.service.delete_booth_admin(id_quay)


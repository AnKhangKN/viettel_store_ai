from fastapi import Depends
from app.modules.queue.services.queue_service import QueueService
from app.modules.queue.schemas.queue_schema import (
    ServiceCreateRequest, 
    ServiceUpdateRequest, 
    QueueTicketCreateRequest,
    TicketStatusUpdateRequest
)
from app.common.dependencies.staff_dependency import get_current_staff

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

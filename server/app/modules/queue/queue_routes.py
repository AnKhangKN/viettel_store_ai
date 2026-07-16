from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from app.modules.queue.controllers.queue_controller import QueueController
from app.common.dependencies.admin_dependency import get_current_admin
from app.common.dependencies.staff_dependency import get_current_staff
from app.core.websocket import websocket_manager

class QueueRoutes:

    def __init__(self):
        self.router = APIRouter(
            prefix="/queue",
            tags=["Queue & Counter Services"]
        )
        controller = QueueController()

        # Public APIs
        self.router.get("/services")(controller.get_all_services)
        self.router.post("/ticket")(controller.create_queue_ticket)

        # Staff APIs (Nhân viên cửa hàng & Admin) - Dependencies are handled directly in controller parameters
        self.router.get("/staff/tickets")(controller.get_staff_queue_tickets)
        self.router.patch("/tickets/{id_phieu}/status")(controller.update_ticket_status)

        # WebSocket endpoint for real-time notifications by branch (using general room format)
        @self.router.websocket("/ws/{id_chi_nhanh}")
        async def websocket_endpoint(websocket: WebSocket, id_chi_nhanh: str):
            room_name = f"queue:{id_chi_nhanh}"
            await websocket_manager.connect(websocket, room_name)
            try:
                while True:
                    # Keep connection alive, listen for any client messages (pings)
                    data = await websocket.receive_text()
                    await websocket.send_json({"event": "pong", "data": data})
            except WebSocketDisconnect:
                websocket_manager.disconnect(websocket, room_name)

        # Admin APIs
        self.router.post("/services", dependencies=[Depends(get_current_admin)])(controller.create_service)
        self.router.patch("/services/{id_loai_giao_dich}", dependencies=[Depends(get_current_admin)])(controller.update_service)
        self.router.delete("/services/{id_loai_giao_dich}", dependencies=[Depends(get_current_admin)])(controller.delete_service)

from fastapi import Depends
from app.modules.orders.services.order_service import OrderService
from app.common.dependencies.user_dependency import get_current_user



class OrderController:

    def __init__(self):
        self.service = OrderService()

    async def get_my_orders(self, current_user: dict = Depends(get_current_user)):
        """
        Controller lấy toàn bộ danh sách đơn hàng mua SIM của người dùng đang đăng nhập.
        """
        user_id = str(current_user["id_khach_hang"])
        return await self.service.get_my_orders(user_id)

    async def get_order_detail(self, order_id: str, current_user: dict = Depends(get_current_user)):
        """
        Controller lấy thông tin chi tiết một đơn hàng mua SIM của người dùng đang đăng nhập.
        """
        user_id = str(current_user["id_khach_hang"])
        return await self.service.get_order_detail(order_id, user_id)

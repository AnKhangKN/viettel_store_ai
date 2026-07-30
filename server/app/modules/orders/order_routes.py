from fastapi import APIRouter, Depends
from app.modules.orders.controllers.order_controller import OrderController
from app.common.dependencies.user_dependency import get_current_user



class OrderRoutes:

    def __init__(self):
        self.router = APIRouter(
            prefix="/v1/orders",
            tags=["Customer Orders & Invoice Tracking"]
        )
        controller = OrderController()

        # Customer Order APIs
        self.router.get(
            "/my-orders",
            dependencies=[Depends(get_current_user)]
        )(controller.get_my_orders)

        self.router.get(
            "/{order_id}",
            dependencies=[Depends(get_current_user)]
        )(controller.get_order_detail)

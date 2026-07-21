from fastapi import APIRouter
from app.modules.payment.controllers.payment_controller import PaymentController


class PaymentRoutes:

    def __init__(self):
        self.router = APIRouter(
            prefix="/payment",
            tags=["Payment"]
        )
        controller = PaymentController()

        self.router.post("/sim-order")(controller.create_sim_order)
        self.router.post("/vnpay/create-sim-payment")(controller.create_sim_payment)
        self.router.get("/vnpay/return")(controller.vnpay_return)
        self.router.get("/vnpay/ipn")(controller.vnpay_ipn)
        self.router.post("/confirm-received/{id_thanh_toan}")(controller.confirm_received)

        # Staff routes
        self.router.get("/staff/orders")(controller.get_staff_sim_orders)
        self.router.patch("/staff/orders/{id_don_hang}/confirm-received")(controller.confirm_staff_sim_received)

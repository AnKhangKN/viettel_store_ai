from fastapi import APIRouter
from app.modules.chatbot.controllers.chatbot_controller import ChatbotController

class ChatbotRoutes:
    def __init__(self):
        self.router = APIRouter(
            prefix="/chatbot",
            tags=["Chatbot"]
        )
        controller = ChatbotController()

        # Định nghĩa endpoint POST /api/chatbot
        self.router.post("", response_model=None)(controller.chat)

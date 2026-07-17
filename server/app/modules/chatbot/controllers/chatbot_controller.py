from app.modules.chatbot.services.chatbot_service import ChatbotService
from app.modules.chatbot.schemas.chatbot_schema import ChatbotRequest

class ChatbotController:
    def __init__(self):
        self.service = ChatbotService()

    async def chat(self, body: ChatbotRequest):
        return await self.service.generate_response(body)

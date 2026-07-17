from pydantic import BaseModel, Field
from typing import List, Optional

class ChatMessage(BaseModel):
    role: str = Field(..., description="Vai trò: 'user' hoặc 'model'")
    parts: str = Field(..., description="Nội dung tin nhắn")

class ChatbotRequest(BaseModel):
    message: str = Field(..., description="Tin nhắn hiện tại từ người dùng")
    history: Optional[List[ChatMessage]] = Field(default=None, description="Lịch sử các tin nhắn trước đó")

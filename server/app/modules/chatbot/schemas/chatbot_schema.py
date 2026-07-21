from pydantic import BaseModel, Field
from typing import List, Optional, Union

class ChatMessage(BaseModel):
    role: str = Field(..., description="Vai trò: 'user' hoặc 'model'")
    parts: Union[str, List[str]] = Field(..., description="Nội dung tin nhắn hoặc danh sách các đoạn nội dung")

class ChatbotRequest(BaseModel):
    message: str = Field(..., description="Tin nhắn hiện tại từ người dùng")
    history: Optional[List[ChatMessage]] = Field(default_factory=list, description="Lịch sử các tin nhắn trước đó")

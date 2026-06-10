from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional


@dataclass
class AIChatModel:
    id: Optional[int] = None
    user_input: str = ""
    ai_response: str = ""
    created_at: datetime = field(default_factory=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_input": self.user_input,
            "ai_response": self.ai_response,
            "created_at": self.created_at.isoformat(),
        }


AI_ChatModel = AIChatModel

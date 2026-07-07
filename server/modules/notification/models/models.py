from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional

@dataclass
class NotificationModel:
    id: Optional[int] = None
    user_id: Optional[int] = None
    title: str = ""
    message: str = ""
    is_read: bool = False
    created_at: datetime = field(default_factory=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "message": self.message,
            "is_read": self.is_read,
            "created_at": self.created_at.isoformat(),
        }

# Mock database since SQLAlchemy is not fully configured
mock_notifications = []

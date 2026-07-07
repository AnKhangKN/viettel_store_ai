from ..models.models import mock_notifications

class NotificationController:
    def get_notifications(self, request=None):
        # Return mock notifications
        return {"status": "success", "data": [n.to_dict() for n in mock_notifications]}

    def mark_read(self, notification_id):
        for n in mock_notifications:
            if n.id == notification_id:
                n.is_read = True
                return {"status": "success"}
        return {"status": "error", "message": "Not found"}

notification_controller = NotificationController()

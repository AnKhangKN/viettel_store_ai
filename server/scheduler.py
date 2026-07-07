from apscheduler.schedulers.background import BackgroundScheduler
from flask_mail import Mail, Message
from datetime import datetime
from modules.notification.models.models import mock_notifications, NotificationModel

scheduler = BackgroundScheduler()
mail = Mail()

def send_daily_notifications(app):
    with app.app_context():
        # Mock logic to send notifications to users
        print(f"[{datetime.now()}] Running daily notification job...")
        
        # In a real app, query users who opted in for emails
        # For now, we just add a mock notification
        new_notification = NotificationModel(
            id=len(mock_notifications) + 1,
            user_id=1, # Mock user id
            title="Ưu đãi mới!",
            message="Giảm 50% cho tất cả các gói cước trong hôm nay.",
            is_read=False
        )
        mock_notifications.insert(0, new_notification)
        
        # Example of sending email (requires real configuration to work)
        # msg = Message("Ưu đãi mới!", sender="noreply@viettelstore.vn", recipients=["user@example.com"])
        # msg.body = "Giảm 50% cho tất cả các gói cước trong hôm nay."
        # mail.send(msg)

def init_scheduler(app):
    mail.init_app(app)
    
    # Run the job every 1 days (or 24 hours). For testing, could be every 1 minute.
    scheduler.add_job(func=send_daily_notifications, args=[app], trigger="interval", days=1)
    
    if not scheduler.running:
        scheduler.start()

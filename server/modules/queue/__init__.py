from flask import Blueprint


queue_bp = Blueprint("queue", __name__, url_prefix="/queues")

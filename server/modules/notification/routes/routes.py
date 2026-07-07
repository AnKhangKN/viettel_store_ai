from flask import jsonify, request
from .. import notification_bp
from ..controllers.controllers import notification_controller

@notification_bp.route('/', methods=['GET'])
def get_notifications():
    return jsonify(notification_controller.get_notifications(request))

@notification_bp.route('/<int:notification_id>/read', methods=['PUT'])
def mark_read(notification_id):
    return jsonify(notification_controller.mark_read(notification_id))

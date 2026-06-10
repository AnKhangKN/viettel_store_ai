from flask import Blueprint


package_bp = Blueprint("package", __name__, url_prefix="/packages")

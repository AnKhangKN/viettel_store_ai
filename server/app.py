from flask import Flask, jsonify
from flask_cors import CORS

from modules.ai_chat import ai_bp
from modules.auth import auth_bp
from modules.branch import branch_bp
from modules.customer import customer_bp
from modules.package import package_bp
from modules.queue import queue_bp
from modules.sim import sim_bp
from modules.notification import notification_bp


app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_bp)
app.register_blueprint(customer_bp)
app.register_blueprint(package_bp)
app.register_blueprint(ai_bp)
app.register_blueprint(queue_bp)
app.register_blueprint(branch_bp)
app.register_blueprint(sim_bp)
app.register_blueprint(notification_bp)


from scheduler import init_scheduler

@app.get("/")
def index():
    return jsonify({"message": "Server is running"})

init_scheduler(app)

if __name__ == "__main__":
    app.run(debug=True)

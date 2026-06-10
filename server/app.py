from flask import Flask, jsonify

from modules.ai_chat import ai_bp
from modules.auth import auth_bp
from modules.branch import branch_bp
from modules.customer import customer_bp
from modules.package import package_bp
from modules.queue import queue_bp
from modules.sim import sim_bp


app = Flask(__name__)

app.register_blueprint(auth_bp)
app.register_blueprint(customer_bp)
app.register_blueprint(package_bp)
app.register_blueprint(ai_bp)
app.register_blueprint(queue_bp)
app.register_blueprint(branch_bp)
app.register_blueprint(sim_bp)


@app.get("/")
def index():
    return jsonify({"message": "Server is running"})


if __name__ == "__main__":
    app.run(debug=True)

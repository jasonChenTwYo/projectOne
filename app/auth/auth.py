from flask import Blueprint

bp = Blueprint("auth", __name__, url_prefix="/auth")

@bp.route("/register",methods=['POST','GET'])
def register():
    return {
        "username": "jason1",
        "theme": 123,
    }
# 如果想不要用flask_login 用flask管控登入登出可以參考 https://github.com/pallets/flask/blob/3.0.2/examples/tutorial/flaskr/auth.py

import functools
from .. import conn
from .. import db
from .. import user as userpy
from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, current_app,render_template_string
)
from werkzeug.security import check_password_hash, generate_password_hash
import flask_login

bp = Blueprint("auth", __name__, url_prefix="/auth")

@bp.before_app_request
def test():
    current_app.logger.info('before_app_request')

@bp.route('/')
def index():
    current_app.logger.info('ttt')
    dbhost = current_app.config['DB_SERVER']
    current_app.logger.info('dbhost:'+dbhost)

    conn = db.DBManager(password_file='/run/secrets/mysql_password')
 
    rec = conn.query_titles()
    response = ''
    for c in rec:
       response = response  + '<div>   Hello  ' + c + '</div>'
    return response

@bp.get("/login")
def login_get():
    current_app.logger.info(session)
    return """<form method=post>
      Email: <input name="email"><br>
      Password: <input name="password" type=password><br>
      <button>Log In</button>
    </form>"""

@bp.post("/login")
def login_post():
    user = userpy.users.get(request.form["email"])

    if user is None or user.password != request.form["password"]:
        return redirect(url_for("auth.login"))
    current_app.logger.info(session)
    flask_login.login_user(user)
    return redirect(url_for("auth.protected"))

@bp.route("/protected")
@flask_login.login_required
def protected():
    current_app.logger.info(session)
    return render_template_string(
        "Logged in as: id:{{ user.id }} password:{{user.password}}",
        user=flask_login.current_user
    )

@bp.route("/logout")
def logout():
    flask_login.logout_user()
    return "Logged out"


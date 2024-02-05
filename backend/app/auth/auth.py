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

# @bp.before_app_request
# def load_logged_in_user():
#     user_id = session.get('user_id')
    
#     if user_id is None:
#         g.user = None
#     else:
#         g.user = get_db().execute(
#             'SELECT * FROM user WHERE id = ?', (user_id,)
#         ).fetchone()

# @bp.route('/register', methods=('GET', 'POST'))
# def register():
#     if request.method == 'POST':
#         username = request.form['username']
#         password = request.form['password']
#         db = get_db()
#         error = None

#         if not username:
#             error = 'Username is required.'
#         elif not password:
#             error = 'Password is required.'

#         if error is None:
#             try:
#                 db.execute(
#                     "INSERT INTO user (username, password) VALUES (?, ?)",
#                     (username, generate_password_hash(password)),
#                 )
#                 db.commit()
#             except db.IntegrityError:
#                 error = f"User {username} is already registered."
#             else:
#                 return redirect(url_for("auth.login"))

#         flash(error)

#     return render_template('auth/register.html')

# @bp.route('/login', methods=('GET', 'POST'))
# def login():
#     if request.method == 'POST':
#         username = request.form['username']
#         password = request.form['password']
#         db = get_db()
#         error = None
#         user = db.execute(
#             'SELECT * FROM users WHERE username = ?', (username,)
#         ).fetchone()

#         if user is None:
#             error = 'Incorrect username.'
#         elif not check_password_hash(user['password'], password):
#             error = 'Incorrect password.'

#         if error is None:
#             session.clear()
#             session['user_id'] = user['id']
#             return redirect(url_for('index'))

#         flash(error)

#     return render_template('auth/login.html')

# @bp.route('/logout')
# def logout():
#     session.clear()
#     return redirect(url_for('index'))

# def login_required(view):
#     @functools.wraps(view)
#     def wrapped_view(**kwargs):
#         if g.user is None:
#             return redirect(url_for('auth.login'))

#         return view(**kwargs)

#     return wrapped_view
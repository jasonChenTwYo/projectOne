from flask import Flask
from .db import DBManager

conn = None

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
  
    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    @app.route('/hello')
    def hello():
        return 'Hello, World!'
    
    @app.route('/listBlog')
    def listBlog():
        global conn
        if not conn:
            conn = DBManager(password_file='/run/secrets/mysql_password')
            conn.populate_db()
        rec = conn.query_titles()

        response = ''
        for c in rec:
            response = response  + '<div>   Hello  ' + c + '</div>'
        return response
    
    from .auth import auth
    from . import blog

    app.register_blueprint(blog.bp)
    app.add_url_rule('/', endpoint='index')
   
    app.register_blueprint(auth.bp)
    
    return app
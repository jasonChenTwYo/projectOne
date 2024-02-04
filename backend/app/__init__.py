from flask import Flask
from .db import DBManager
from logging.config import dictConfig
#import json
conn = None

#參考: https://flask.palletsprojects.com/en/3.0.x/logging/
dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '[%(asctime)s] %(levelname)s in %(module)s:%(lineno)d: %(message)s',
    }},
    'handlers': {'wsgi': {
        'class': 'logging.StreamHandler',
        'stream': 'ext://flask.logging.wsgi_errors_stream',
        'formatter': 'default'
    }},
    'root': {
        'level': 'INFO',
        'handlers': ['wsgi']
    }
})

def create_app(test_config=None):
    # instance_relative_config=True 代表config.cfg可以放在instance目錄底下 參考:https://flask.palletsprojects.com/en/3.0.x/config/#instance-folders
    app = Flask(__name__, instance_relative_config=True)
  
    if test_config is None:
        # load the instance config, if it exists, when not testing

        # 載入配置檔也可以用json的格式範例如下 參考:https://flask.palletsprojects.com/en/3.0.x/config/#configuring-from-data-files
        # app.config.from_file("config.json", load=json.load)
        app.config.from_pyfile("config.cfg")
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    @app.route('/hello')
    def hello():
        app.logger.info('%s logged in successfully', "ddd")
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
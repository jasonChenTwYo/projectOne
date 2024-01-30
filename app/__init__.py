from flask import Flask

def create_app():
   
    app = Flask(__name__)

    @app.route('/hello')
    def hello():
        return 'Hello, World!'
    
    from .auth import auth
    from .video import video

    app.register_blueprint(auth.bp)
    app.register_blueprint(video.bp)

    return app
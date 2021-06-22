from flask import Flask
from config import Config
from flask_mail import Mail
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
userDB = None
migrate = Migrate(compare_type=True)
login = LoginManager()
mail = Mail()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    login.init_app(app)

    from app.api import bp as api_bp
    app.register_blueprint(api_bp)

    from app.models import bp as models_bp
    app.register_blueprint(models_bp)

    return app

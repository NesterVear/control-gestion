from flask import Flask
from flask_cors import CORS
from extensions import db, mail
from routes.captura_routes import captura_bp
from apscheduler.schedulers.background import BackgroundScheduler
from utils.notificaciones import init_scheduler
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/captura/*": {"origins": os.getenv('ALLOWED_ORIGINS', '').split(',')}})
app.config['CORS_HEADERS'] = 'Content-Type'

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['MAIL_SERVER'] = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('SMTP_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True') == 'True'
app.config['MAIL_USERNAME'] = os.getenv('SMTP_USER')
app.config['MAIL_PASSWORD'] = os.getenv('SMTP_PASSWORD')
app.config['ALERT_EMAIL'] = os.getenv('ALERT_EMAIL')

# Inicializa extensiones
db.init_app(app)
mail.init_app(app)

# Registrar blueprint
app.register_blueprint(captura_bp, url_prefix='/captura')
app.url_map.strict_slashes = False

with app.app_context():
    db.create_all()
    init_scheduler(app)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 5000)), debug=os.getenv('DEBUG', 'False') == 'True')

# Creado por: Nester Vear 🐻
# GitHub: github.com/NesterVear
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
app.config['SMTP_SERVER'] = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
app.config['SMTP_PORT'] = int(os.getenv('SMTP_PORT', 587))
app.config['SMTP_USER'] = os.getenv('SMTP_USER')
app.config['SMTP_PASSWORD'] = os.getenv('SMTP_PASSWORD')
app.config['MITZI_EMAIL'] = os.getenv('MITZI_EMAIL')
app.config['ROSY_EMAIL'] = os.getenv('ROSY_EMAIL')
app.config['EDGAR_EMAIL'] = os.getenv('EDGAR_EMAIL')
app.config['CHIQUI_EMAIL'] = os.getenv('CHIQUI_EMAIL')

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
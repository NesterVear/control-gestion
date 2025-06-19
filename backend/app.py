from flask import Flask, request, abort
from flask_cors import CORS
from flask_migrate import Migrate
from flask_mail import Mail
from extensions import db
from dotenv import load_dotenv
from apscheduler.schedulers.background import BackgroundScheduler
from routes.captura_routes import verificar_alertas
import os

#Carga variables del entorno desde .env
load_dotenv()

app = Flask(__name__)
CORS (app, origins=os.getenv('ALLOWED_ORIGINS', '').split(',')) #permite peticiones desde react

#Configuraciones de base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# configuracion de seguridad y debug
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'clave_por_defecto_super_segura')
app.config['DEBUG'] = os.getenv('DEBUG', 'True').lower() == 'true' #convierte a booleano

# Configuracion de correo
app.config['MAIL_SERVER'] = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('SMTP_PORT', 587))
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('SMTP_USER')
app.config['MAIL_PASSWORD'] = os.getenv('SMTP_PASSWORD')

db.init_app(app)
migrate = Migrate(app, db)
Mail = Mail(app)

#importar bluepoints
from routes.captura_routes import captura_bp
from routes.directorio_externo import directorio_ext_bp

app.register_blueprint(captura_bp, url_prefix='/captura')
app.register_blueprint(directorio_ext_bp, url_prefix='/directorio-externo')

# Lista de IPs permitidas, se definen en el .env separadas por una ,
ALLOWED_IPS = os.getenv('ALLOWED_IPS', '').split(',')

# filtacion de IPs antes de cada request
@app.before_request
def limit_remote_addr():
    if ALLOWED_IPS == ['']:
        return #si no esta en la lista no permitira el acceso(danger)
    client_ip = request.remote_addr
    if client_ip not in ALLOWED_IPS:
        abort(403) # FORBIDEN

# programar tarea diaria para alertas
scheduler = BackgroundScheduler()
scheduler.add_job(verificar_alertas, 'interval', days=1, start_date='2025-06-18 08:00:00')
scheduler.start()

if __name__=='__main__':
    with app.app_context():
        db.create_all()
    port = int (os.getenv('PORT', 5000)) 
    app.run(host='0.0.0.0', port=port, debug=app.config['DEBUG'])





# Creado por: Nester Vear 🐻
# GitHub: github.com/NesterVear
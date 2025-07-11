echo @"
from flask import Flask, jsonify, request
from flask_cors import CORS
from extensions import db, mail
from routes.captura_routes import captura_bp
from routes.usuario_routes import usuario_bp
from routes.directorio_externo_routes import directorio_externo_bp
from apscheduler.schedulers.background import BackgroundScheduler
from utils.notificaciones import init_scheduler
from models import Usuario
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": os.getenv('ALLOWED_ORIGINS', '').split(',')}})
app.config['CORS_HEADERS'] = 'Content-Type'

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default-secret-key')
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True') == 'True'
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')
app.config['MAIL_SUPPRESS_SEND'] = False
app.config['MAIL_DEBUG'] = True
app.config['MITZI_EMAIL'] = os.getenv('MITZI_EMAIL')
app.config['ROSY_EMAIL'] = os.getenv('ROSY_EMAIL')
app.config['EDGAR_EMAIL'] = os.getenv('EDGAR_EMAIL')
app.config['CHIQUI_EMAIL'] = os.getenv('CHIQUI_EMAIL')

# Middleware para verificar roles
@app.before_request
def check_role():
    role_requirements = {
        '/captura/': ['GET', 'PUT'], #LECTOR, PUEDE HACER GET Y PUT
        '/captura/<int:folio_acaac>': ['PUT'],
        '/captura/<int:folio_acaac>': ['POST'], #Administrador y SuperRoot
        '/captura/<int:folio_acaac>': ['DELETE'], #Solo SuperRoot
        '/captura/test-alertas': ['GET'], #Solo SuperRoot
        '/usuarios/usuarios': ['POST'], # Solo SuperRoot
        '/usuarios/login': ['POST'], #Todos
        '/directorio-externo/': ['GET', 'POST'], #Administrador y SuperRoot para POST
        '/directorio-externo/<int:id>': ['PUT', 'DELETE'], #Administrador (PUT), superRoot (PUT, DELETE)
    }
    endpoint =request.path
    method = request.method
    for path, methods in role_requirements.items():
        if endpoint.startswith(path.split('<')[0]) and method in methods:
            user_id = request.headers.get('User-ID')
            if not user_id:
                return jsonify({'error': 'Usuario no autenticado'}), 401
            usuario = db.session.get(Usuario, user_id)
            if not usuario:
                return jsonify({'eror': 'Usuario no encontrado'}), 401
            if endpoint == '/user/login':
                return #Permitir login sin restricciones
            if method == 'GET'and path == '/captura/':
                if usuario.rol not in ['Lector', 'Administrador', 'SuperRoot']:
                    return jsonify({'error': 'Acceso denegado'}), 403

# Inicializa extensiones
db.init_app(app)
mail.init_app(app)

# Registrar blueprint
app.register_blueprint(captura_bp, url_prefix='/captura')
app.register_blueprint(usuario_bp, url_prefix='/usuario')
app.url_map.strict_slashes = False

with app.app_context():
    db.create_all()
    init_scheduler(app)

# prueba correos
@app.route('/test-email', methods=['GET'])
def test_email():
    from flask_mail import Mail, Message
    mail = Mail(app)
    msg = Message (
        subject= 'prueba de correo',
        recipients=[app.config['MITZI_EMAIL']],
        body='Este es un correo del futuro solo para prueba, te ves toda hermosa hoy.'
    )
    try:
        mail.send(msg)
        return jsonify({'mensaje': 'Correo enviado correctamente'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 5000)), debug=os.getenv('DEBUG', 'False') == 'True')
    
# Creado por: Nester Vear 🐻
# GitHub: github.com/NesterVear
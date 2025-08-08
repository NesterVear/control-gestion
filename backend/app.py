import os
from dotenv import load_dotenv

# 1. Carga variables de entorno ANTES de todo
load_dotenv()
print("DATABASE_URL:", os.getenv('DATABASE_URL'))

from flask import Flask, jsonify, request
from flask_cors import CORS
from extensions import db, mail, limiter
from routes.captura_routes import captura_bp
from routes.usuario_routes import usuario_bp
from routes.directorio_externo_routes import directorio_externo_bp
from apscheduler.schedulers.background import BackgroundScheduler
from utils.notificaciones import init_scheduler
from models import Usuario

# 2. Crea la app
app = Flask(__name__)

# 3. Configura la app
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

# 4. Inicializa extensiones
db.init_app(app)
mail.init_app(app)
limiter.init_app(app)

# 5. Middleware para verificar roles
@app.before_request
def check_role():
    role_requeriments = {
        '/captura/': ['GET', 'POST'],
        '/captura/<int:folio_acaac>': ['PUT', 'DELETE'],
        '/captura/test-alertas': ['GET'],
        '/directorio-externo/': ['GET', 'POST'],
        '/directorio-externo/<int:id>': ['PUT','DELETE'],
    }
    endpoint = request.path
    method = request.method
    if endpoint.startswith('/usuarios'):
        return #deja que usuario_routes.py manejara las restricciones
    user_id = request.headers.get('User-ID')
    if not user_id:
        return jsonify({'error': 'No, no entraste TONOTONO'}), 401
    
    usuario = db.session.get(Usuario, user_id)
    if not usuario:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    
    # validar acceso basado en endpoint y metodo
    for path, methods in role_requeriments.items():
        path_prefix = path.split('<')[0]
        if endpoint.startswith(path_prefix) and method in methods:
            # reglas de combinacion metodo + endpoint
            if path == '/captura/' and method == 'GET':
                if usuario.rol not in ['Lector', 'Capturista', 'Administrador', 'SuperRoot']:
                    return jsonify({'error': 'Acceso Denegado'}), 403
                
            elif path == '/captura/' and method == 'POST':
                if usuario.rol not in ['Capturista', 'Administrador', 'SuperRoot']:
                    return jsonify({'error': 'Acceso Denegado'}), 403

            elif path == '/captura/<int:folio_acaac>' and method == 'PUT':
                if usuario.rol not in ['Capturista', 'Administrador', 'SuperRoot']:
                    return jsonify({'error': 'Acceso Denegado'}), 403

            elif path == '/captura/<int:folio_acaac>' and method == 'DELETE':
                if usuario.rol not in ['Administrador', 'SuperRoot']:
                    return jsonify({'error': 'Acceso Denegado'}), 403

            elif path == '/directorio-externo/' and method == 'GET':
                if usuario.rol not in ['Lector', 'Capturista', 'Administrador', 'SuperRoot']:
                    return jsonify({'error': 'Acceso Denegado'}), 403

            elif path == '/directorio-externo/' and method == 'POST':
                if usuario.rol not in ['Administrador', 'SuperRoot']:
                    return jsonify({'error': 'Acceso Denegado'}), 403

            elif path == '/directorio-externo/<int:id>' and method in ['PUT', 'DELETE']:
                if usuario.rol not in ['Administrador', 'SuperRoot']:
                    return jsonify({'error': 'Acceso Denegado'}), 403

            elif path == '/captura/test-alertas' and method == 'GET':
                if usuario.rol != 'SuperRoot':
                    return jsonify({'error': 'Acceso Denegado'}), 403

# 6. Registrar blueprints
app.register_blueprint(captura_bp, url_prefix='/captura')
app.register_blueprint(usuario_bp, url_prefix='/usuarios')
app.register_blueprint(directorio_externo_bp, url_prefix='/directorio-externo')
app.url_map.strict_slashes = False

# 7. Inicializa la base de datos y el scheduler
with app.app_context():
    db.create_all()
    init_scheduler(app)

# 8. Prueba de correo
@app.route('/test-email', methods=['GET'])
def test_email():
    from flask_mail import Mail, Message
    mail = Mail(app)
    msg = Message(
        subject='prueba de correo',
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
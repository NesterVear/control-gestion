from flask import Blueprint, jsonify, request
from extensions import db
from models import Usuario
import bcrypt
from functools import wraps

usuario_bp = Blueprint('usuario', __name__)

def require_role(roles):
    if isinstance(roles, str):
        roles = [roles]
    def decorator(f):
        @wraps(f)
        def wrapped_function(*args, **kwargs):
            user_id = request.headers.get('User-ID')
            if not user_id:
                return jsonify({'error': 'No autorizado'}), 401
            usuario = Usuario.query.get(user_id)
            if not usuario or usuario.rol not in roles:
                return jsonify({'error': 'Acceso denegado'}), 403
            return f(*args, **kwargs)
        return wrapped_function
    return decorator

@usuario_bp.route('/usuarios', methods=['POST'], endpoint='crear_usuario')
@require_role(['SuperRoot'])
def crear_usuario():
    data = request.get_json()
    usuario = data.get('usuario')
    contrasena = data.get('contrasena')
    rol = data.get('rol', 'Lector')
    if not usuario or not contrasena or rol not in ['Administrador', 'Lector', 'SuperRoot']:
        return jsonify({'error': 'Datos inválidos'}), 400
    if Usuario.query.filter_by(usuario=usuario).first():
        return jsonify({'error': 'El usuario ya existe'}), 409
    hashed = bcrypt.hashpw(contrasena.encode('utf-8'), bcrypt.gensalt())
    nuevo_usuario = Usuario(usuario=usuario, contrasena=hashed.decode('utf-8'), rol=rol)
    db.session.add(nuevo_usuario)
    db.session.commit()
    return jsonify({'mensaje': 'Usuario creado', 'id': nuevo_usuario.id}), 201

# Si usas Flask-Limiter, descomenta la siguiente línea y asegúrate de tenerlo en extensions.py
# from extensions import limiter

@usuario_bp.route('/login', methods=['POST'], endpoint='login')
# @limiter.limit("5 per minute")  # Descomenta si usas Flask-Limiter
def login():
    data = request.get_json()
    usuario = data.get('usuario')
    contrasena = data.get('contrasena')
    user = Usuario.query.filter_by(usuario=usuario).first()
    if user and bcrypt.checkpw(contrasena.encode('utf-8'), user.contrasena.encode('utf-8')):
        return jsonify({'mensaje': 'Login exitoso', 'id': user.id, 'rol': user.rol}), 200
    return jsonify({'error': 'Credenciales inválidas'}), 401

# Creado por: Nester Vear 🐻
# GitHub: github.com/NesterVear
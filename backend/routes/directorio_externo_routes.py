from flask import Blueprint, jsonify, request
from extensions import db
from models import DirectorioExterno, Usuario
from functools import wraps
from sqlalchemy.exc import SQLAlchemyError

directorio_externo_bp = Blueprint('directorio_externo', __name__)

def require_role(roles):
    def decorator(f):
        @wraps(f)
        def wrapped_function(*args, **kwargs):
            user_id = request.headers.get('User-ID')
            if not user_id:
                return jsonify({'error': 'No, no entraste tonotono'}), 401
            usuario = db.session.get(Usuario, user_id)
            if not usuario or usuario.rol not in roles:
                return jsonify({'error': 'Acceso denegado, dale un beso al Inge para poder acceder'}), 403
            return f(*args, **kwargs)
        return wrapped_function
    return decorator

@directorio_externo_bp.route('/', methods=['GET'], endpoint='get_directorios')
@require_role(['Lector', 'Capturista', 'Administrador', 'SuperRoot'])
def get_directorios():
    """
    Obtiene todos los directorios externos.
    """
    try:
        directorios = DirectorioExterno.query.all()
        return jsonify([
            {
                'id': d.id,
                'nombre': d.nombre,
                'cargo': d.cargo,
                'institucion': d.institucion
            } for d in directorios
        ])
    except SQLAlchemyError:
        return jsonify({'error': '¡Ay caramba! Algo salió mal buscando los directorios.'}), 500

@directorio_externo_bp.route('/', methods=['POST'], endpoint='crear_directorio')
@require_role(['Administrador', 'SuperRoot'])
def crear_directorio():
    """
    Crea un nuevo directorio externo.
    """
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No enviaste nada, Cachirula está confundida'}), 400
    if 'nombre' not in data or not data['nombre'].strip():
        return jsonify({'error': 'Falta el nombre, Cachirula está triste'}), 400
    try:
        nuevo_directorio = DirectorioExterno(
            nombre=data['nombre'].strip(),
            cargo=data.get('cargo', '').strip() if data.get('cargo') else None,
            institucion=data.get('institucion', '').strip() if data.get('institucion') else None
        )
        db.session.add(nuevo_directorio)
        db.session.commit()
        return jsonify({'mensaje': 'Directorio creado, Cachirula te ama', 'id': nuevo_directorio.id}), 201
    except SQLAlchemyError:
        db.session.rollback()
        return jsonify({'error': '¡Ups! Cachirula se tropezó creando el directorio.'}), 500

@directorio_externo_bp.route('/<int:id>', methods=['PUT'], endpoint='actualizar_directorio')
@require_role(['Administrador', 'SuperRoot'])
def actualizar_directorio(id):
    """
    Actualiza un directorio externo existente.
    """
    directorio = DirectorioExterno.query.get_or_404(id, description='Directorio no encontrado, ni modo.')
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No enviaste datos, Cachirula está confundida'}), 400
    try:
        for key, value in data.items():
            if hasattr(directorio, key) and value is not None:
                setattr(directorio, key, value.strip() if isinstance(value, str) else value)
        db.session.commit()
        return jsonify({'mensaje': 'Directorio actualizado, Cachirula te ama'})
    except SQLAlchemyError:
        db.session.rollback()
        return jsonify({'error': '¡Ay nanita! No se pudo actualizar el directorio.'}), 500

@directorio_externo_bp.route('/<int:id>', methods=['DELETE'], endpoint='eliminar_directorio')
@require_role(['Administrador', 'SuperRoot'])
def eliminar_directorio(id):
    """
    Elimina un directorio externo.
    """
    directorio = DirectorioExterno.query.get_or_404(id, description='Directorio no encontrado, ni modo.')
    try:
        db.session.delete(directorio)
        db.session.commit()
        return jsonify({'mensaje': 'Directorio Eliminado, Cachirula te ama'})
    except SQLAlchemyError:
        db.session.rollback()
        return jsonify({'error': '¡Nooo! Cachirula no pudo eliminar el directorio.'}), 500

# Creado por: Nester Vear 🐻
# GitHub: github.com/NesterVear
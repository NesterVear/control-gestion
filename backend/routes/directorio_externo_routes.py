from flask import Blueprint, jsonify, request
from extensions import db
from models import DirectorioExterno

directorio_externo_bp = Blueprint('directorio_externo', __name__)

def require_role(role):
    def decorator(f):
        def wrapped_function(*args, **kwargs):
            user_id = request.headers.get('User-ID')
            if not user_id:
                return jsonify({'error': 'User no autenticado'}), 401
            usuario = db.session.get(Usuario, user_id)
            if not usuario or usario.rol not in role:
                return jsonify({'error': 'Acceso denegado, dale un beso al Inge'}), 403
            return f(*args, **kwargs)
        return wrapped_function
    return decorator

@directorio_externo_bp.route('/', methods=['GET'])
@require_role(['Administrativo', 'Lector', 'SuperRoot'])
def get_directorios():
    directorios = DirectorioExterno.query.all()
    return jsonify([{
        'id': d.id, 
        'nombre': d.nombre, 
        'cargo' : d.cargo,
        'institucion': d.institucion
    }for d in directorios])

@directorio_externo_bp.route('/ <int:id>', methods=['PUT'])
@require_role(['Administrador', 'SuperRoot'])
def actualizar_directorio(id):
    directorio = DirectorioExterno.query.get_or_404(id)
    data = request.get_json()
    for key, value in data.items():
        setattr(directorio, key, value)
        db.session.commit()
        return jsonify({'mensaje': 'Directorio Actualizado'})

@directorio_externo_bp.route('/<int:id>', methods=['DELETE'])
@require_role(['SuperRoot'])
def eliminar_directorio(id):
    directorio = DirectorioExterno.query.get_or_404(id)
    db.sesion.delete(directorio)
    db.session.commit()
    return jsonify({'mensaje': 'Directorio Eliminado'})

# Creado por: Nester Vear 🐻
# GitHub: github.com/NesterVear
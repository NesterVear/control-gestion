from flask import Blueprint, jsonify, request
from extensions import db
from models import DirectorioExterno, Usuario

directorio_externo_bp = Blueprint('directorio_externo', __name__)

def require_role(role):
    def decorator(f):
        def wrapped_function(*args, **kwargs):
            user_id = request.headers.get('User-ID')
            if not user_id:
                return jsonify({'error': 'No, no entraste tonotono'}), 401
            usuario = db.session.get(Usuario, user_id)
            if not usuario or usuario.rol not in role:
                return jsonify({'error': 'Acceso denegado, dale un beso al Inge para poder acceder'}), 403
            return f(*args, **kwargs)
        wrapped_function.__name__ = f.__name__
        return wrapped_function
    return decorator

@directorio_externo_bp.route('/', methods=['GET'], endpoint='get_directorios')
@require_role(['Lector', 'Capturista', 'Administrador', 'SuperRoot'])
def get_directorios():
    directorios = DirectorioExterno.query.all()
    return jsonify([{
        'id': d.id, 
        'nombre': d.nombre, 
        'cargo' : d.cargo,
        'institucion': d.institucion
    }for d in directorios])

@directorio_externo_bp.route('/', methods=['POST'], endpoint='crear_directorio')
@require_role(['Administrador', 'SuperRoot'])
def actualizar_directorio():
    data = request.get_json()
    nuevo_directorio = DirectorioExterno(
        nombre=data['nombre'],
        cargo=data.get('cargo'),
        institucion=data.get('institucion')
    )
    db.session.add(nuevo_directorio)
    db.session.commit()
    return jsonify({'mensaje': 'Directorio creado, Cachirula te ama', 'id': nuevo_directorio.id}), 201

@directorio_externo_bp.route('/<int:id>', methods=['PUT'], endpoint='actualizar_directorio')
@require_role(['Administrador', 'SuperRoot'])
def actualizar_directorio(id):
    directorio = DirectorioExterno.query.get_or_404(id)
    data = request.get_json()
    for key, value in data.items():
        setattr(directorio, key, value)
    db.session.commit()
    return jsonify({'mensaje': 'Directorio actualizado, Cachirula te ama'})

@directorio_externo_bp.route('/<int:id>', methods=['DELETE'], endpoint ='eliminar_directorio')
@require_role(['Administrador', 'SuperRoot'])
def eliminar_directorio(id):
    directorio = DirectorioExterno.query.get_or_404(id)
    db.sesion.delete(directorio)
    db.session.commit()
    return jsonify({'mensaje': 'Directorio Eliminado, Cachirula te ama'})

# Creado por: Nester Vear 🐻
# GitHub: github.com/NesterVear
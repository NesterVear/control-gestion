from flask import Blueprint, request, jsonify
from models import DirectorioExterno
from extensions import db
from usuario_routes import require_role

directorio_ext_bp = Blueprint('directorio_ext_bp', __name__)

@directorio_ext_bp.route('/', methods=['GET'], endpoint='get_directorios')
def get_directorios():
    directorios = DirectorioExterno.query.all()
    return jsonify([{
        'id':d.id,
        'nombre':d.nombre,
        'cargo':d.cargo,
        'institucion':d.institucion
    } for d in directorios])

@directorio_ext_bp.route('/', methods=['POST'], endpoint='crear_directorio')
@require_role(['Administrador', 'SuperRoot'])
def crear_directorio():
    try:
        data = request.get_json()
        if not data.get('nombre'):
            return jsonify({'error': 'El nombre es requerido'}), 400
        
        nombre = data.get('nombre', '').strip()
        if not nombre:
            return jsonify({'error': 'El nombre es requerido'}), 400
        
        nuevo_directorio = DirectorioExterno(
            nombre=data.get('nombre'), 
            cargo=data.get('cargo'),
            institucion=data.get('institucion')
        )

        db.session.add(nuevo_directorio)
        db.session.commit()

        return jsonify({"mensaje": 'Contacto Agregado', 'id': nuevo_directorio.id}), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error al crear el contacto'}), 500


@directorio_ext_bp.route('/<int:id>', methods=['PUT'], endpoint='actualizar_directorio')
def actualizar_directorio(id):
    directorio = DirectorioExterno.query.get_or_404(id)
    data = request.get_json()
    campos_permitidos = ['nombre', 'cargo', 'institucion']
    for key, value in data.items():
        if key in campos_permitidos:
            setattr(directorio, key, value)
        db.session.commit()
        return jsonify({'mensaje': 'Directorio actualizado'})

@directorio_ext_bp.route('/<int:id>', methods=['DELETE'], endoint='eliminar_directorio')
def eliminar_directorio(id):
    directorio = DirectorioExterno.query.get_or_404(id)
    db.session.delete(directorio)
    db.sesion.commit()
    return jsonify({'mensaje': 'Directorio eliminado'})

# Creado por: Nester Vear 🐻
# GitHub: github.com/NesterVear
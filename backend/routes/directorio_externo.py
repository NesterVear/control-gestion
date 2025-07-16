from flask import Blueprint, request, jsonify, request
from models import DirectorioExterno
from extensions import db

directorio_ext_bp = Blueprint('directorio_ext_bp', __name__)

@directorio_externo_routes_bp.route('/', methods=['GET'], endpoint='get_directorios')
def get_directorios():
    directorios = DirectorioExterno.query.all()
    return jsonify([{
        'id':d.id,
        'nombre':d.nombre,
        'cargo':d.cargo,
        'institucion':d.institucion
    }for d in directorios])

@directorio_externo_routes_bp.route('/', methods=['POST'], endpoint='crear_directorio')
def crear_directorio():
    data = request.get_json()
    nuevo_directorio = DirectorioExterno(
        nombre=data.get['nombre'],
        cargo=data.get('cargo'),
        institucion=data.get('institucion')
    )
    db.session.add(nuevo_directorio)
    db.session.commit()
    return jsonify({"mensaje": "Contacto Agregado", 'id': nuevo_directorio.id}), 201


@directorio_externo_routes_bp.route('/<int:id>', methods=['PUT'], endpoint='actualizar_directorio')
def actualizar_directorio(id):
    directorio = DirectorioExterno.query.get_or_404(id)
    data = request.get_json()
    for key, value in data.items():
        setattr(directorio, key, value)
        db.session.commit()
        return jsonify({'mensaje': 'Directorio actualizado'})

@directorio_externo_routes_bp.route('/<int:id>', methods=['DELETE'], endoint='eliminar_directorio')
def eliminar_directorio(id):
    directorio = DirectorioExterno.query.get_or_404(id)
    db.session.delete(directorio)
    db.sesion.commit()
    return jsonify({'mensaje': 'Directorio eliminado'})

# Creado por: Nester Vear 🐻
# GitHub: github.com/NesterVear
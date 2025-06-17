from flask import Blueprint, request, jsonify
from models import DirectorioExterno
from extensions import db

directorio_ext_bp = Blueprint('directorio_ext_bp', __name__)

@directorio_ext_bp.route('/api/directorio-externo', methods=['GET'])
def obetener_directorio_externo():
    registros = DirectorioExterno.query.all()
    resultado = [
        {"id": r.id, "nombre": r.nombre, "cargo": r.cargo, "institucion": r.institucion}
        for r in registros
    ]
    return jsonify(resultado)

@directorio_ext_bp.route('/', methods=['POST'])
def agregar_contacto_externo():
    data = request.json
    nuevo_contacto = DirectorioExterno(
        nombre=data.get("nombre"),
        cargo=data.get("cargo"),
        institucion=data.get("institucion")
    )
    db.session.add(nuevo_contacto)
    db.session.commit()
    return jsonify({"mensaje": "Contacto Agregado"}), 201
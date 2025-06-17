from flask import Blueprint, request, jsonify
from extensions import db
from models import Captura
from datetime import datetime


captura_bp = Blueprint('captura_bp', __name__)

@captura_bp.route('/', methods=['GET'])
def listar_capturas():
    capturas = Captura.query.all()
    resultados = []
    for c in capturas:
        resultados.append({
            'folio_acaac': c.folio_acaac,
            'fecha_elaboracion': c.fecha_elaboracion.strftime('%d-%m-%Y'),
            'fecha_recepcion': c.fecha_recepcion.strftime('%Y-%m-%d'),
            'numero_oficio': c.numero_oficio,
            'asunto': c.asunto,
            'remitente': c.remitente,
            'destinatario': c.destinatario,
            'prioridad': c.prioridad,
            'observacion': c.observacion,
            'atendio': c.atendio
        })
    return jsonify(resultados)


@captura_bp.route('/', methods=['POST'])
def crear_captura():
    data = request.json
    try:
        captura = Captura(
            fecha_elaboracion=datetime.strptime(data['fecha_elaboracion'], '%d-%m-%Y'),
            fecha_recepcion=datetime.strptime(data['fecha_recepcion'], '%d-%m-%Y'),
            numero_oficio=data['numero_oficio'],
            asunto=data.get('asunto'),
            remitente=data.get('remitente'),
            destinatario=data.get('destinatario'),
            prioridad=data.get('prioridad'),
            observacion=data.get('observacion'),
            atendio=data.get('atendio')
        )
        db.session.add(captura)
        db.session.commit()
        return jsonify({'message': 'Captura Guardada Correctamente', 'Folio Acaac': captura.folio_acaac}), 201
    except Exception as e:
        return jsonify ({'Error': str(e)}), 400
from flask import Blueprint, request, jsonify
from extensions import db
from models import Captura, Usuario
from datetime import datetime

captura_bp = Blueprint('captura_bp', __name__)

VALID_ATENDIO = ['Mitzi', 'Rosy', 'Edgar', 'Chiqui']
VALID_PRIORIDAD = ['Extraurgente', 'Urgente', 'Ordinario']
VALID_TIPO = ['Entrada', 'Salida']

@captura_bp.route('/', methods=['GET'])
def listar_capturas():
 capturas = Captura.query.filter_by(eliminado=False).all()
 resultados = []
 for c in capturas:
     resultados.append({
         'folio_acaac': c.folio_acaac,
         'usuario_id': c.usuario_id,
         'fecha_elaboracion': c.fecha_elaboracion.strftime('%d-%m-%Y'),
         'fecha_recepcion': c.fecha_recepcion.strftime('%d-%m-%Y'),
         'numero_oficio': c.numero_oficio,
         'asunto': c.asunto,
         'remitente': c.remitente,
         'destinatario': c.destinatario,
         'prioridad': c.prioridad,
         'observacion': c.observacion,
         'atendio': c.atendio,
         'pdf_url': c.pdf_url,
         'eliminado': c.eliminado,
         'tipo': c.tipo,
         'status': c.status,
         'respuesta_pdf_url': c.respuesta_pdf_url,
         'completado': c.completado
     })
 return jsonify(resultados)

@captura_bp.route('/', methods=['POST'])
def crear_captura():
 data = request.json
 try:
     atendio = data.get('atendio')
     if atendio not in VALID_ATENDIO:
         return jsonify({'Error': f"El campo atendio debe ser uno de: {', '.join(VALID_ATENDIO)}"}), 400
     prioridad = data.get('prioridad')
     if prioridad not in VALID_PRIORIDAD:
         return jsonify({'Error': f"La prioridad debe ser uno de: {', '.join(VALID_PRIORIDAD)}"}), 400
     tipo = data.get('tipo')
     if tipo not in VALID_TIPO:
         return jsonify({'Error': f"El campo tipo debe ser uno de: {', '.join(VALID_TIPO)}"}), 400
     # Determinar estado completado según tipo
     completado = False
     if tipo == 'Entrada':
         completado = bool(data.get('respuesta_pdf_url'))
     elif tipo == 'Salida':
         completado = bool(data.get('pdf_url'))
     captura = Captura(
         usuario_id=data.get('usuario_id', 1),
         fecha_elaboracion=datetime.strptime(data['fecha_elaboracion'], '%d-%m-%Y').date(),
         fecha_recepcion=datetime.strptime(data['fecha_recepcion'], '%d-%m-%Y').date(),
         numero_oficio=data['numero_oficio'],
         asunto=data.get('asunto'),
         remitente=data.get('remitente'),
         destinatario=data.get('destinatario'),
         prioridad=prioridad,
         observacion=data.get('observacion'),
         atendio=atendio,
         pdf_url=data.get('pdf_url'),
         eliminado=False,
         tipo=tipo,
         status=data.get('status'),
         respuesta_pdf_url=data.get('respuesta_pdf_url'),
         completado=completado
     )
     db.session.add(captura)
     db.session.commit()
     return jsonify({'message': 'Captura Guardada Correctamente', 'Folio Acaac': captura.folio_acaac}), 201
 except Exception as e:
     db.session.rollback()
     return jsonify({'Error': str(e)}), 400

@captura_bp.route('/<int:folio_acaac>', methods=['PUT'])
def actualizar_captura(folio_acaac):
 captura = Captura.query.get_or_404(folio_acaac)
 data = request.json
 try:
     atendio = data.get('atendio', captura.atendio)
     if atendio not in VALID_ATENDIO:
         return jsonify({'Error': f"El campo atendio debe ser uno de: {', '.join(VALID_ATENDIO)}"}), 400
     prioridad = data.get('prioridad', captura.prioridad)
     if prioridad not in VALID_PRIORIDAD:
         return jsonify({'Error': f"La prioridad debe ser uno de: {', '.join(VALID_PRIORIDAD)}"}), 400
     tipo = data.get('tipo', captura.tipo)
     if tipo not in VALID_TIPO:
         return jsonify({'error': f"El campo tipo debe ser uno de: {', '.join(VALID_TIPO)}"}), 400
     # Actualizar estado completado
     if tipo == 'Entrada':
         captura.completado = bool(data.get('respuesta_pdf_url', captura.respuesta_pdf_url))
     elif tipo == 'Salida':
         captura.completado = bool(data.get('pdf_url', captura.pdf_url))
     captura.usuario_id = data.get('usuario_id', captura.usuario_id)
     captura.fecha_elaboracion = datetime.strptime(data['fecha_elaboracion'], '%d-%m-%Y').date() if data.get('fecha_elaboracion') else captura.fecha_elaboracion
     captura.fecha_recepcion = datetime.strptime(data.get('fecha_recepcion'), '%d-%m-%Y').date() if data.get('fecha_recepcion') else captura.fecha_recepcion
     captura.numero_oficio = data.get('numero_oficio', captura.numero_oficio)
     captura.asunto = data.get('asunto', captura.asunto)
     captura.remitente = data.get('remitente', captura.remitente)
     captura.destinatario = data.get('destinatario', captura.destinatario)
     captura.prioridad = prioridad
     captura.observacion = data.get('observacion', captura.observacion)
     captura.atendio = atendio
     captura.pdf_url = data.get('pdf_url', captura.pdf_url)
     captura.tipo = tipo
     captura.status = data.get('status', captura.status)
     captura.respuesta_pdf_url = data.get('respuesta_pdf_url', captura.respuesta_pdf_url)
     db.session.commit()
     return jsonify({'message': 'Captura Actualizada Correctamente'})
 except Exception as e:
     db.session.rollback()
     return jsonify({'error': str(e)}), 400

@captura_bp.route('/<int:folio_acaac>', methods=['DELETE'])
def eliminar_captura(folio_acaac):
 captura = Captura.query.get_or_404(folio_acaac)
 data = request.json
 try:
     eliminado_por = data.get('eliminado_por')
     if not eliminado_por:
         return jsonify({'error': 'Se requiere eliminado_por'}), 400
     usuario = Usuario.query.filter_by(usuario=eliminado_por, es_super_usuario=True).first()
     if not usuario:
         return jsonify({'error': 'Solo un super usuario puede eliminar capturas'}), 403
     captura.eliminado = True
     captura.eliminado_por = usuario.id
     db.session.commit()
     return jsonify({'message': 'Captura Marcada como Eliminada Correctamente'})
 except Exception as e:
     db.session.rollback()
     return jsonify({'error': str(e)}), 400

@captura_bp.route('/test-alertas', methods=['GET'])
def test_alertas():
 from utils.notificaciones import verificar_alertas
 from app import app
 verificar_alertas(app, app.config)
 return jsonify({'mensaje': 'Alertas verificadas correctamente'})

# Creado por: Nester Vear 🐻
# GitHub: github.com/NesterVear
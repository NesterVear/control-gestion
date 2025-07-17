from flask import Blueprint, jsonify, request
from extensions import db
from models import Captura
from datetime import datetime
from utils.notificaciones import verificar_alertas

captura_bp = Blueprint('captura', __name__)

@captura_bp.route('/', methods=['GET'], endpoint='get_capturas')
def get_capturas():
   capturas = Captura.query.filter_by(eliminado=False).all()
   return jsonify([{
      'folio_acaac': c.folio_acaac, 
      'usuario_id': c.usuario_id,
      'fecha_elaboracion': c.fecha_elaboracion.strftime ('%d-%m-%Y'),
      'fecha_recepcion': c.fecha_recepcion.strftime ('%d-%m-%Y'),
      'numero_oficio': c.numero_oficio,
      'asunto': c.asunto,
      'remitente': c.remitente,
      'destinatario': c.destinatario,
      'prioridad': c.prioridad,
      'pdf_url': c.pdf_url,
      'tipo': c.tipo,
      'status': c.status,
      'respuesta_pdf_url': c.respuesta_pdf_url,
      'completado': c.completado
   }for c in capturas])
 

@captura_bp.route('/', methods=['POST'], endpoint='crear_captura')
def crear_captura():
    data = request.get_json()
    try:
       fecha_elaboracion = datetime.strptime(data['fecha_elaboracion'], '%d-%m-%Y').date()
       fecha_recepcion = datetime.strptime(data['fecha_recepcion'], '%d-%m-%Y').date() 
    except ValueError:
        return jsonify({'error': 'Formato de fecha invalido tonoto'}), 400
    if 'tipo' not in data or data['tipo'] not in ['Entrada', 'Salida']:
       return jsonify({'error': 'Tipo es obligatorio y debe ser Entrada o Salida'}), 400
    nueva_captura = Captura(
       usuario_id =data['usuario_id'],
       fecha_elaboracion=fecha_elaboracion,
       fecha_recepcion=fecha_recepcion,
       numero_oficio=data['numero_oficio'],
       asunto=data.get('asunto'),
       remitente=data.get('remitente'),
       destinatario=data.get('destinatario'),
       prioridad=data['prioridad'],
       observacion=data.get('observacion'),
       atendio=data.get('atendio'),
       pdf_url=data.get('pdf_url'),
       tipo=data['tipo'],
       status=data.get('status'),
       respuesta_pdf_url=data.get('respuesta_pdf_url'),
       completado=data.get('completado', False)
    )
    db.session.add(nueva_captura)
    db.session.commit()
    return jsonify({'message': 'Captura Guardada Correctamente', 'Folio Acaac': nueva_captura.folio_acaac}), 201

@captura_bp.route('/<int:folio_acaac>', methods=['PUT'], endpoint='actualizar_captura')
def actualizar_captura(folio_acaac):
   captura = Captura.query.get_or_404(folio_acaac)
   data = request.get_json()
   if captura.eliminado:
      return jsonify ({'error': 'Captura eliminada'}), 400
   for key, value in data.items():
      if key in ['fecha_elaboracion', 'fecha_recepcion']:
        try:
           value = datetime.strptime(value, '%d-%m-%Y').date()
        except ValueError:
           return jsonify({'error': 'Formato de fecha invalido'}), 400
        setattr(captura, key, value)
      if captura.tipo == 'Entrada' and captura.respuesta_pdf_url:
         captura.completado = True
      elif captura.tipo == 'Salida' and captura.pdf_url:
         captura.completado = True
      db.session.commit()
      return jsonify({'mensaje': 'Captura actualizada'})

    
@captura_bp.route('/<int:folio_acaac>', methods=['DELETE'], endpoint='eliminar_captura')
def eliminar_captura(folio_acaac):
   captura = Captura.query.get_or_404(folio_acaac)
   captura.eliminado = True
   captura.eliminado_por = request.headers.get('User-ID')
   db.session.commit()
   return jsonify({'mensaje': 'Captura eliminada'})

@captura_bp.route('/test-alertas', methods=['GET'], endpoint='test_alertas')
def test_alertas():
   from utils.notificaciones import verificar_alertas
   from app import app
   verificar_alertas(app, app.config)
   return jsonify({'mensaje': 'Alertas verificadas correctamente te ganaste un beso de Arisdelsi'})

# Creado por: Nester Vear 🐻
# GitHub: github.com/NesterVear
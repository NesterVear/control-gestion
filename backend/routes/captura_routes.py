from flask import Blueprint, request, jsonify
from extensions import db, mail
from models import Captura, Usuario
from datetime import datetime, date, timedelta
from app import app #necesario importar app para acceder a la config
import os 

captura_bp = Blueprint('captura_bp', __name__)

VALID_ATENDIO = ['Mitzi', 'Rosy', 'Edgar', 'Chiqui']
VALID_PRIORIDAD = ['Extraurgente', 'Urgente', 'Ordinario']

# mapa de correos desde .env (sin valores por defecto)
EMAIL_MAP = {
    'Mitzi': os.getenv('MITZI_EMAIL'),
    'Rosy': os.getenv('ROSY_EMAIL'),
    'Edgar': os.getenv('EDGAR_EMAIL'),
    'Chiqui': os.getenv('CHIQUI_EMAIL')
}

@captura_bp.route('/', methods=['GET'])
def listar_capturas():
    capturas = Captura.query.filter_by(eliminado=False).all()
    resultados = []
    for c in capturas:
        resultados.append({
            'folio_acaac': c.folio_acaac,
            'usuario_id' : c. usurio_id,
            'fecha_elaboracion': c.fecha_elaboracion.strftime('%d-%m-%Y'),
            'fecha_recepcion': c.fecha_recepcion.strftime('%d-%m-%Y'),
            'numero_oficio': c.numero_oficio,
            'asunto': c.asunto,
            'remitente': c.remitente,
            'destinatario': c.destinatario,
            'prioridad': c.prioridad,
            'observacion': c.observacion,
            'atendio': c.atendio
            'pdf_url': c.pdf_url,
            'eliminado': c.eliminado,
            'tipo' : c.tipo,
            'status': c.status,
            'respuesta_pdf_url' : c.respuesta_pdf_url,
            'completado' : c.completado
        })
    return jsonify(resultados)


@captura_bp.route('/', methods=['POST'])
def crear_captura():
    data = request.json
    try:
        # Validar atendio
        atendio = data.get('atendio')
        if atendio not in VALID_ATENDIO:
            return jsonify({'Error': f"El campo atendio debe de ser uno de: {', '.join(VALID_ATENDIO)}"}), 400
        # Validar prioridad
        prioridad = data.get('prioridad')
        if prioridad not in VALID_PRIORIDAD:
            return jsonify ({'Error': f"La prioridad debe ser uno de: {', '.join(VALID_PRIORIDAD)}"}), 400
        
        captura = Captura(
            usuario_id=data.get('usuario_id', 1), #valor por defecto para pruebas
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
            eliminado=False
            tipo=data.get('tipo'),
            status=data.get('status'),
            respuesta_pdf_url=data.get('respuesta_pdf_url'),
            completado=data.get('completado', False)
            )
        db.session.add(captura)
        db.session.commit()
        return jsonify({'message': 'Captura Guardada Correctamente', 'Folio Acaac': captura.folio_acaac}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify ({'Error': str(e)}), 400
    
@captura_bp.route('/<int:folio_acaac>', methods=['PUT'])
def actualizar_captura(folio_acaac):
    captura = Captura.query.get_or_404(folio_acaac)
    data = request.json
    try:
        #validar atendio
        atendio = data.get('atendio', captura.atendio)
        if atendio not in VALID_ATENDIO:
            return jsonify({'Error': f"El campo atendio debe de ser uno de {', '.join (VALID_ATENDIO)}"}), 400
        #validar prioridad
        prioridad= data.get('prioridad', captura.atendio)
        if prioridad not in VALID_PRIORIDAD:
            return jsonify({'Error': f"La prioridaad debe de ser uno de:{', '.join(VALID_PRIORIDAD)}"}), 400
        captura.usuario_id = data.get('usuario_id', captura.usuario_id)
        captura.fecha_elaboracion = datetime.strptime(data['fecha_elaboracion'], '%d-%m-%Y').date() if data.get
        ('fecha_elaboracion') else captura.fecha_elaboracion
        captura.fecha_recepcion  = datetime.strptime(data['fecha_recepcion'], '%d-%m-%Y').date() if data.get('fecha_recepcion') else
        captura.fecha_recepcion
        captura.numero_oficio = data.get('numero_oficio', captura.numero_oficio)
        captura.asunto = data.get('asunto', captura.asunto)
        captura.remitente = data.get('reminte', captura.remitente)
        captura.destinatrio = data.get('destinatario', captura.destinatario)
        captura.prioridad = prioridad
        captura.observacion = data.get('observacion', captura.observacion)
        captura.atendio = atendio
        captura.pdf_url = data.get('pdf_url', captura.pdf_url)
        captura.tipo = data.get('tipo', captura.tipo)
        captura.status = data.get('status', captura.status)
        captura.respuesta_pdf_url = data.get('respuesta_pdf_url', captura.respuesta_pdf_url)
        captura.completado = data.get('completado', captura.completado)
        db.sesion.commit()
        return jsonify({'message': 'Captura Actualizada Correctamente'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'Error': str(e)}), 400

@captura_bp.route('/<int:folio_acaac>', methods=['DELETE'])
def eliminar_captura(folio_acaac):
    captura = Captura.query.get_or_404(folio_acaac)
    data = request.json
    try:
        #validar super usuario
        eliminado_por = data.get(eliminado_por)
        if not eliminado_por:
            return jsonify({'Error': 'Se requiere eliminado_por'}), 400
        usuario = Usuario.query.filter_by(usuario=eliminado_por, es_super_usuario=True).first()
        if not usuario:
            return jsonify({'Error': 'Solo un super usuario puede eliminar capturas'}), 403        
        captura.eliminado = True
        captura.eliminado_por = eliminado_por
        db.session.commit()
        return jsonify({'message': 'Captura Eliminada'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'Error': str(e)}), 400

def verificar_alertas():
    today = date.today()
    capturas_pendientes = Captura.query.filter_by(eliminado=False, completado=False).all()
    for captura in captura_pendientes:
        atendio = captura.atendio
        if not atendio or atendio not in VALID_ATENDIO:
            print(f"Captura #{captura.folio_acaac} ignorada: atendio ({atendio}) no valido")
            continue
        days_since_recepcion = (today - captura.fecha_recepcion).days
        #Reglas de notificacion
        should_notify = False
        if atendio == 'Mitzi' and days_since_recepcion >= 15:
            should_notify = True
        elif atendio in ['Edgar', 'Chiqui', 'Rosy'] and days_since_recepcion >=5:
            should_notify = True
        if should_notify:
        msg = Message(
            subject=f"Alerta: Captura pendiente #{captura.folio_acaac}",
            sender=app.config{'MAIL_USERNAME'},
            recipients=[recipient],
            body-f"""
            Captura #{captura.folio_acaac} esta pendiente. 
            Asunto: {captura.asunto}
            Remitente: {captura.remitente}
            Fecha de recepcion: {captura.fecha_recepcion.strftime('%d-%m-%Y')}
            Prioridad: {captura.prioridad}
            Atendido por:{atendio}
            """
        ) 
        try
            mail.send(msg)
            print(f"Correo enviado a {recipient} para captura #{captura.folio_acaac}")
        except Exception as e:
            print(f"Error enviando correo para captura #{captura.folio_acaac}: {str(e)}")


# Creado por: Nester Vear 🐻
# GitHub: github.com/NesterVear        
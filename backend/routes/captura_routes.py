from flask import Blueprint, jsonify, request
from extensions import db
from models import Captura, Usuario
from datetime import datetime
from utils.notificaciones import verificar_alertas
from functools import wraps
from sqlalchemy.exc import SQLAlchemyError

captura_bp = Blueprint('captura', __name__)

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

@captura_bp.route('/', methods=['GET'], endpoint='get_capturas')
@require_role(['Lector', 'Capturista', 'Administrador', 'SuperRoot'])
def get_capturas():
    """
    Obtiene todas las capturas no eliminadas.
    """
    try:
        capturas = Captura.query.filter_by(eliminado=False).all()
        return jsonify([{
            'folio_acaac': c.folio_acaac, 
            'usuario_id': c.usuario_id,
            'fecha_elaboracion': c.fecha_elaboracion.strftime('%d-%m-%Y') if c.fecha_elaboracion else None,
            'fecha_recepcion': c.fecha_recepcion.strftime('%d-%m-%Y') if c.fecha_recepcion else None,
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
        } for c in capturas])
    except SQLAlchemyError:
        return jsonify({'error': '¡Ay caramba! Algo salió mal buscando las capturas.'}), 500

@captura_bp.route('/', methods=['POST'], endpoint='crear_captura')
@require_role(['Capturista', 'Administrador', 'SuperRoot'])
def crear_captura():
    """
    Crea una nueva captura.
    """
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No enviaste nada, Cachirula está confundida'}), 400
    
    # Validaciones obligatorias
    campos_obligatorios = ['usuario_id', 'fecha_elaboracion', 'fecha_recepcion', 'numero_oficio', 'prioridad', 'tipo']
    for campo in campos_obligatorios:
        if campo not in data or not str(data[campo]).strip():
            return jsonify({'error': f'El campo {campo} es obligatorio, Cachirula está triste'}), 400
    
    # Validar tipo
    if data['tipo'] not in ['Entrada', 'Salida']:
        return jsonify({'error': 'Tipo debe ser Entrada o Salida, no inventes tonoto'}), 400
    
    # Validar fechas
    try:
        fecha_elaboracion = datetime.strptime(data['fecha_elaboracion'], '%d-%m-%Y').date()
        fecha_recepcion = datetime.strptime(data['fecha_recepcion'], '%d-%m-%Y').date() 
    except ValueError:
        return jsonify({'error': 'Formato de fecha inválido tonoto, usa DD-MM-YYYY'}), 400
    
    try:
        nueva_captura = Captura(
            usuario_id=data['usuario_id'],
            fecha_elaboracion=fecha_elaboracion,
            fecha_recepcion=fecha_recepcion,
            numero_oficio=data['numero_oficio'].strip(),
            asunto=data.get('asunto', '').strip() if data.get('asunto') else None,
            remitente=data.get('remitente', '').strip() if data.get('remitente') else None,
            destinatario=data.get('destinatario', '').strip() if data.get('destinatario') else None,
            prioridad=data['prioridad'],
            observacion=data.get('observacion', '').strip() if data.get('observacion') else None,
            atendio=data.get('atendio', '').strip() if data.get('atendio') else None,
            pdf_url=data.get('pdf_url'),
            tipo=data['tipo'],
            status=data.get('status'),
            respuesta_pdf_url=data.get('respuesta_pdf_url'),
            completado=data.get('completado', False)
        )
        db.session.add(nueva_captura)
        db.session.commit()
        
        # Verificar alertas después de crear
        try:
            from app import app
            verificar_alertas(app, app.config)
        except Exception:
            pass  # No fallar si las alertas no funcionan
            
        return jsonify({
            'mensaje': 'Captura guardada correctamente, Cachirula te ama', 
            'folio_acaac': nueva_captura.folio_acaac
        }), 201
    except SQLAlchemyError:
        db.session.rollback()
        return jsonify({'error': '¡Ups! Cachirula se tropezó guardando la captura.'}), 500

@captura_bp.route('/<int:folio_acaac>', methods=['PUT'], endpoint='actualizar_captura')
@require_role(['Capturista', 'Administrador', 'SuperRoot'])
def actualizar_captura(folio_acaac):
    """
    Actualiza una captura existente.
    """
    captura = Captura.query.get_or_404(folio_acaac, description='Captura no encontrada, ni modo.')
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No enviaste datos, Cachirula está confundida'}), 400
    
    if captura.eliminado:
        return jsonify({'error': 'No puedes actualizar una captura eliminada, tonoto'}), 400
    
    try:
        for key, value in data.items():
            if not hasattr(captura, key):
                continue
                
            if key in ['fecha_elaboracion', 'fecha_recepcion'] and value:
                try:
                    value = datetime.strptime(value, '%d-%m-%Y').date()
                except ValueError:
                    return jsonify({'error': f'Formato de fecha inválido en {key}, usa DD-MM-YYYY'}), 400
            elif key == 'tipo' and value not in ['Entrada', 'Salida']:
                return jsonify({'error': 'Tipo debe ser Entrada o Salida'}), 400
            elif isinstance(value, str):
                value = value.strip() if value else None
                
            setattr(captura, key, value)
        
        # Lógica de completado automático
        if captura.tipo == 'Entrada' and captura.respuesta_pdf_url:
            captura.completado = True
        elif captura.tipo == 'Salida' and captura.pdf_url:
            captura.completado = True
            
        db.session.commit()
        return jsonify({'mensaje': 'Captura actualizada, Cachirula te ama'})
    except SQLAlchemyError:
        db.session.rollback()
        return jsonify({'error': '¡Ay nanita! No se pudo actualizar la captura.'}), 500

@captura_bp.route('/<int:folio_acaac>', methods=['DELETE'], endpoint='eliminar_captura')
@require_role(['Administrador', 'SuperRoot'])
def eliminar_captura(folio_acaac):
    """
    Elimina (marca como eliminado) una captura.
    """
    captura = Captura.query.get_or_404(folio_acaac, description='Captura no encontrada, ni modo.')
    
    if captura.eliminado:
        return jsonify({'error': 'Esta captura ya está eliminada, tonoto'}), 400
    
    try:
        captura.eliminado = True
        captura.eliminado_por = request.headers.get('User-ID')
        captura.fecha_eliminacion = datetime.now()
        db.session.commit()
        return jsonify({'mensaje': 'Captura eliminada, Cachirula te perdona'})
    except SQLAlchemyError:
        db.session.rollback()
        return jsonify({'error': '¡Nooo! Cachirula no pudo eliminar la captura.'}), 500

@captura_bp.route('/test-alertas', methods=['GET'], endpoint='test_alertas')
@require_role(['Administrador', 'SuperRoot'])
def test_alertas():
    """
    Endpoint de prueba para verificar alertas.
    """
    try:
        from app import app
        verificar_alertas(app, app.config)
        return jsonify({'mensaje': 'Alertas verificadas correctamente, te ganaste un beso de Arisdelsi 💋'})
    except Exception as e:
        return jsonify({'error': f'¡Ay no! Las alertas fallaron: {str(e)}'}), 500

# Creado por: Nester Vear 🐻
# GitHub: github.com/NesterVear
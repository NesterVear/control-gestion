from flask_mail import Mail, Message
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
from models import Captura
from extensions import db

import logging

def verificar_alertas(app, app_config):
    with app.app_context():
        logging.info("Iniciando Verificacion de alertas...")
        # Notificaciones para capturas de Entrada
        capturas_pendientes = Captura.query.filter_by(
            eliminado=False,
            completado=False
            ).all()
        for captura in capturas_pendientes:
            dias_transcurridos = (datetime.now().date() - captura.fecha_recepcion).days
            recipient = obtener_destinatario(captura, dias_transcurridos, app_config)
            if recipient:
                enviar_correo(app, app_config, captura, recipient)

def obtener_destinatario(captura, dias_transcurridos, app_config):
    """Determina el destinatario segun el tipo y dias transcurridos"""
    if captura.tipo == 'Entrada':
        if captura.atendio == 'Mitzi' and dias_transcurridos >= 15:
            return app_config['MITZI_EMAIL']
        elif captura.atendio in ['Rosy', 'Edgar', 'Chiqui'] and dias_transcurridos >= 5:
            return app_config.get(f'{captura.atendio.upper()}_EMAIL')
        
    elif captura.tipo == 'Salida' and dias_transcurridos >= 5:
        return app_config['CHIQUI_EMAIL']
    return None

def enviar_correo(app, app_config, captura, recipient):
    try:
        mail = Mail(app)
        msg = Message(
            subject=f'Alerta: Captura {captura.folio_acaac}, {captura.numero_oficio} pendiente',
            sender=app_config['MAIL_USERNAME'],
            recipients=[recipient],
            body=f'Captura {captura.folio_acaac} con numero de oficio {captura.numero_oficio}, ({captura.tipo}) marcado como {captura.prioridad}, se encuentra pendiente desde {captura.fecha_recepcion.strftime("%d-%m-%Y")} y no ha sido atendido, por favor atender de INMEDIATO.'
            )
        mail.send(msg)
        print (f"Email enviado a {recipient} para captura {captura.folio_acaac}")
    except Exception as e:
        print (f"Error enviado email: {e}")

def init_scheduler(app):
    scheduler = BackgroundScheduler()
    scheduler.add_job(lambda: verificar_alertas(app, app.config), 'interval', hours=24)
    scheduler.start()


# Creado por: Nester Vear 🐻
# GitHub: github.com/NesterVear
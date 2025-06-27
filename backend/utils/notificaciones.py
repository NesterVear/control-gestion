from flask_mail import Mail, Message
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
from models import Captura
from extensions import db

def verificar_alertas(app, app_config):
    with app.app_context():
        # Notificaciones para capturas de Entrada
        capturas_entrada = Captura.query.filter_by(tipo='Entrada', eliminado=False, completado=False).all()
        for captura in capturas_entrada:
            dias_transcurridos = (datetime.now().date() - captura.fecha_recepcion).days
            recipient = None
            if captura.atendio == 'Mitzi' and dias_transcurridos >= 15:
                recipient = app_config['MITZI_EMAIL']
            elif captura.atendio in ['Rosy', 'Edgar', 'Chiqui'] and dias_transcurridos >= 5:
                if captura.atendio == 'Rosy':
                    recipient = app_config['ROSY_EMAIL']
                elif captura.atendio == 'Edgar':
                    recipient = app_config['EDGAR_EMAIL']
                elif captura.atendio == 'Chiqui':
                    recipient = app_config['CHIQUI_EMAIL']
            if recipient:
                enviar_correo(app, app_config, captura, recipient)

        # Notificaciones para capturas de Salida
        capturas_salida = Captura.query.filter_by(tipo='Salida', eliminado=False, completado=False).all()
        for captura in capturas_salida:
            dias_transcurridos = (datetime.now().date() - captura.fecha_recepcion).days
            if dias_transcurridos >= 5:
                recipient = app_config['CHIQUI_EMAIL']
                enviar_correo(app, app_config, captura, recipient)

def enviar_correo(app, app_config, captura, recipient):
    mail = Mail(app)
    msg = Message(
        subject=f'Alerta: Captura {captura.folio_acaac}, {captura.numero_oficio} pendiente',
        sender=app_config['MAIL_USERNAME'],
        recipients=[recipient],
        body=f'Captura {captura.folio_acaac} con numero de oficio {captura.numero_oficio}, ({captura.tipo}) marcado como {captura.prioridad}, se encuentra pendiente desde {captura.fecha_recepcion.strftime("%d-%m-%Y")} y no ha sido atendido, por favor atender de INMEDIATO.'
    )
    mail.send(msg)

def init_scheduler(app):
    scheduler = BackgroundScheduler()
    scheduler.add_job(lambda: verificar_alertas(app, app.config), 'interval', hours=24)
    scheduler.start()

# Creado por: Nester Vear 🐻
# GitHub: github.com/NesterVear
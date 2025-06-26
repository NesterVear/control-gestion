from flask_mail import Mail, Message
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
from models import Captura
from extensions import db

def verificar_alertas(app, app_config):
    with app.app_context():
        capturas = Captura.query.filter_by(eliminado=False, completado=False).all()
        for captura in capturas:
            dias_transcurridos = (datetime.now().date() - captura.fecha_recepcion).days
            if captura.prioridad == 'Extraurgente' and dias_transcurridos >= 2:
                enviar_correo(app, app_config, captura)
            elif captura.prioridad == 'Urgente' and dias_transcurridos >= 5:
                enviar_correo(app, app_config, captura)

def enviar_correo(app, app_config, captura):
    mail = Mail(app)
    msg = Message(
        subject=f'Alerta: Captura {captura.folio_acaac} pendiente',
        sender=app_config['MAIL_USERNAME'],
        recipients=[app_config['ALERT_EMAIL']],
        body=f'Captura {captura.folio_acaac} ({captura.prioridad}) pendiente desde {captura.fecha_recepcion.strftime("%d-%m-%Y")}.'
    )
    mail.send(msg)

def init_scheduler(app):
    scheduler = BackgroundScheduler()
    scheduler.add_job(lambda: verificar_alertas(app, app.config), 'interval', hours=24)
    scheduler.start()


# Creado por: Nester Vear 🐻
# GitHub: github.com/NesterVear
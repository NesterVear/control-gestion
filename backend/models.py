from extensions import db

# define base como db.Model para que env.py lo pueda leer
Base = db.Model

class Usuario(Base):
    __tablename__ = 'usuarios'
    id= db.Column(db.Integer, primary_key=True)
    usuario = db.Column(db.String(250), nullable=False)
    contrasena = db.Column(db.String(250), nullable=False)
    capturas = db.relationship('Captura', backref='usuario', lazy=True)

class DirectorioInterno (Base):
    __tablename__ = 'directorio_interno'
    id = db.Column(db.Integer, primary_key = True)
    nombre = db.Column(db.String(250))
    cargo = db.Column(db.String(250))

class Captura(Base):
    __tablename__ = 'captura'
    folio_acaac = db.Column (db.Integer, primary_key=True, autoincrement=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    fecha_elaboracion = db.Column(db.Date, nullable=False)
    fecha_recepcion = db.Column(db.Date, nullable = False)
    numero_oficio = db.Column(db.String(250), nullable = False)
    asunto = db.Column(db.String(300))
    remitente = db.Column(db.String(100))
    destinatario = db.Column(db.String(200))
    prioridad = db.Column(db.String(100))
    observacion = db.Column(db.String(100))
    atendio =  db.Column(db.String(50))
    pdf_url = db.Column(db.String(200), nullable=True)

class DirectorioExterno(db.Model):
    __tablename__ = 'directorio_externo'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(250), nullable = False)
    cargo = db.Column(db.String(250))
    institucion = db.Column(db.String(250))

from extensions import db

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    id= db.Column(db.Integer, primary_key=True)
    usuario = db.Column(db.String(250), nullable=False)
    contrasena = db.Column(db.String(250), nullable=False)

class DirectorioInterno (db.Model):
    __tablename__ = 'directorio_interno'
    id = db.Column(db.Integer, primary_key = True)
    nombre = db.Column(db.String(250))
    cargo = db.Column(db.String(250))

class Captura(db.Model):
    __tablename__ = 'captura'
    folio_acaac = db.Column (db.Integer, primary_key=True, autoincrement=True)
    fecha_elaboracion = db.Column(db.Date, nullable=False)
    fecha_recepcion = db.Column(db.Date, nullable = False)
    numero_oficio = db.Column(db.String(250), nullable = False)
    asunto = db.Column(db.String(300))
    remitente = db.Column(db.String(100), db.ForeignKey('directorio_interno.nombre'))
    destinatario = db.Column(db.String(200))
    prioridad = db.Column(db.String(100))
    observacion = db.Column(db.String(100))
    atendio =  db.Column(db.String(50))
    usuario = db.relationship ('Usuario', backref='capturas')

    remitente_rel = db.relationship(
        'DirectorioInterno', 
        foreign_keys=[remitente], 
        primaryjoin="Captura.remitente=-DirectorioInterno.nombre", 
        backref='capturas'
        )

class DirectorioExterno(db.Model):
    __tablename__ = 'directorio_externo'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(250), nullable = False)
    cargo = db.Column(db.String(250))
    institucion = db.Column(db.String(250))

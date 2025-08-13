import os
from dotenv import load_dotenv
from extensions import db
from models import Usuario
import bcrypt
from flask import Flask

# Carga variables de entorno
load_dotenv()

# Crea la app Flask y configura la base de datos
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

def actualizar_contrasenas():
    with app.app_context():
        while True:
            usuario_nombre = input("Ingresa el nombre de usuario (o 'salir' para terminar): ")
            if usuario_nombre.lower() == 'salir':
                print("Proceso terminado.")
                break
            nueva_contrasena = input(f"Ingresa la nueva contraseña para '{usuario_nombre}': ")
            usuario = Usuario.query.filter_by(usuario=usuario_nombre).first()
            if not usuario:
                print(f"Usuario '{usuario_nombre}' no encontrado.")
                continue
            hashed = bcrypt.hashpw(nueva_contrasena.encode('utf-8'), bcrypt.gensalt())
            usuario.contrasena = hashed.decode('utf-8')
            db.session.commit()
            print(f"Contraseña actualizada para usuario '{usuario_nombre}'.")

if __name__ == '__main__':
    actualizar_contrasenas()
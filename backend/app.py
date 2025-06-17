from flask import Flask
from flask_cors import CORS
from extensions import db
from dotenv import load_dotenv
import os

#Carga variables del entorno desde .env
load_dotenv()

app = Flask(__name__)
CORS (app) #permite peticiones desde react

#Configuraciones de base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

#importar bluepoints
from routes.captura_routes import captura_bp
from routes.directorio_externo import directorio_ext_bp

app.register_blueprint(captura_bp, url_prefix='/captura')
app.register_blueprint(directorio_ext_bp, url_prefix='/directorio-externo')

if __name__=='__main__':
    with app.app_context():
        db.create_all() 
    app.run(debug=True)

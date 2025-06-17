from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
#from routes.directorio_externo import directorio_ext_bp

#app.register_blueprint(directorio_ext_bp)

app = Flask(__name__)
CORS (app) #permite peticiones desde react

app.config['SQLALCEHMY_DATABASE_URI'] = 'mysql+pymysql://root:Karen1312@localhost/archivo'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy (app)

#importar bluepoints
from routes.captura_routes import captura_bp
app.register_blueprint(captura_bp, url_prefix='/captura')

if __name__=='__main__':
    with app.app_context():
        db.create_all() 
    app.run(debuger=True)

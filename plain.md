project-root/
├── backend/
│   ├── migrations/
│   │   ├── versions/
│   │   │   ├── <hash>_initial_migration.py  # Migración inicial para crear tablas
│   │   │   ├── bc919978f54f_rename_tema_to_status.py  # Migración para renombrar tema a status
│   │   ├── __init__.py
│   │   ├── env.py  # Configuración de Alembic
│   │   ├── README
│   │   ├── script.py.mako  # Plantilla de migraciones
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── captura_routes.py  # Rutas para gestionar capturas, autenticación y reportes
│   │   ├── directorio_externo.py  # Rutas para el directorio externo
│   ├── Uploads/
│   │   ├── # Archivos PDF subidos se almacenan aquí
│   ├── __init__.py
│   ├── app.py  # Configuración principal del servidor Flask
│   ├── extensions.py  # Inicialización de SQLAlchemy y Flask-Mail
│   ├── models.py  # Modelos de la base de datos
│   ├── requirements.txt  # Dependencias del backend
│   ├── .env  # Variables de entorno (ejemplo)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthContext.js  # Contexto para autenticación
│   │   │   ├── CapturaForm.js  # Formulario para crear/editar capturas
│   │   │   ├── CapturaList.js  # Lista de capturas activas con filtros
│   │   │   ├── CapturasEliminadas.js  # Lista de capturas eliminadas para admin
│   │   │   ├── Login.js  # Formulario de login
│   │   ├── App.jsx  # Rutas principales del frontend
│   │   ├── index.css  # Estilos globales
│   │   ├── main.jsx  # Punto de entrada del frontend
│   ├── package.json  # Dependencias y scripts del frontend
│   ├── vite.config.js  # Configuración de Vite
├── README.md  # Documentación general del proyecto


Notas


backend/migrations/versions/: Los archivos de migración específicos (como <hash>_initial_migration.py) tienen nombres generados automáticamente por Alembic. Sustituye <hash> con el identificador real generado en tu sistema.


backend/Uploads/: Esta carpeta se crea dinámicamente para almacenar los archivos PDF subidos. No contiene archivos iniciales, pero debe existir o crearse al iniciar el servidor.


frontend/src/index.css: Este archivo no se incluyó previamente, pero se asume que contiene estilos globales (puedes usar Tailwind CSS o estilos personalizados).


README.md: Contiene instrucciones para configurar y ejecutar el proyecto, pero no se detalló su contenido en las implementaciones previas.

Esta estructura organiza el proyecto de manera modular, separando claramente el backend y el frontend, con rutas y componentes bien definidos para cumplir con las funcionalidades de autenticación, gestión de capturas, directorio, alertas y reportes.
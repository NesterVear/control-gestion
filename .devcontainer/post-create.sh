#!/usr/bin/env bash
set -e

VENV_DIR="backend/venv"

create_and_install () {
  echo "[Init] Creando entorno virtual en $VENV_DIR"
  python -m venv "$VENV_DIR"
  "$VENV_DIR/bin/pip" install --upgrade pip
  echo "[Init] Instalando dependencias de backend/requirements.txt"
  "$VENV_DIR/bin/pip" install -r backend/requirements.txt
}

# 1. Crea el venv si no existe (válido para Codespaces y local)
if [ ! -d "$VENV_DIR" ]; then
  create_and_install
else
  echo "[Skip] venv ya existe: no se reinstalan dependencias"
fi

# 2. Muestra versión de Python para confirmar
"$VENV_DIR/bin/python" --version

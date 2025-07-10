# Copilot Instructions for Control-Gestion

## Project Overview
- **Monorepo** with three main parts:
  - `frontend/`: Next.js (React, TypeScript, Tailwind, NextUI)
  - `backend/`: Flask API (Python, Flask-SQLAlchemy, MySQL, CORS, JWT, dotenv)
  - `C+/`, `PYTHON/`, `JAVA/`, etc.: Standalone code samples, not part of main app

## Architecture & Data Flow
- **Frontend** (`frontend/`):
  - Uses Next.js App Router (`src/app/`), main entry: `page.tsx`
  - Authenticates via `/usuarios/login` (POST, JSON, returns `{id, rol}`)
  - Fetches data from backend using REST endpoints, passing `User-ID` in headers
  - UI components in `src/components/`, forms in `CapturaForm.tsx`
- **Backend** (`backend/`):
  - Flask app in `backend/app.py`, routes in `backend/routes/`
  - Models in `backend/models.py`, DB migrations in `backend/migrations/`
  - Uses MySQL, connection via SQLAlchemy, config in `.env` (not committed)
  - Auth: Basic login, role-based access, user info in JWT or session

## Developer Workflows
- **Frontend**:
  - Start dev server: `npm run dev` in `frontend/`
  - Main file: `src/app/page.tsx` (auto-reloads)
  - Uses NextUI and Tailwind for styling
- **Backend**:
  - Install Python deps: `pip install -r requirements.txt` in `backend/`
  - Run: `flask run` (ensure `.env` is set up)
  - DB migrations: `alembic upgrade head` in `backend/migrations/`
- **Build/Compile**:
  - C++: Use VSCode task `C/C++: g++.exe compilar archivo activo` for files in `C+/`

## Project Conventions
- **Frontend**:
  - Always use `User-ID` header for authenticated requests
  - Use React hooks (`useState`, `useEffect`) for state/data fetching
  - Place new UI components in `src/components/`
- **Backend**:
  - Add new API endpoints in `routes/`, register in `app.py`
  - Use SQLAlchemy models for DB tables
  - Store config/secrets in `.env` (never commit)
- **General**:
  - Spanish is used for variable names, comments, and some messages
  - License: CC BY-NC-SA 4.0 (see root `LICENSE.txt`)

## Integration Points
- **Frontend <-> Backend**: Communicate via REST, always on `localhost` ports (3000 for frontend, 5000 for backend by default)
- **DB**: MySQL, credentials/config in `.env` (not in repo)

## Examples
- Login (frontend):
  ```ts
  const res = await fetch('http://localhost:5000/usuarios/login', { ... })
  ```
- Fetch data (frontend):
  ```ts
  fetch('http://localhost:5000/captura/', { headers: { 'User-ID': user.id.toString() } })
  ```
- Add API route (backend):
  ```py
  # backend/routes/usuario_routes.py
  @app.route('/usuarios/login', methods=['POST'])
  ```

## Key Files/Dirs
- `frontend/src/app/page.tsx`: Main page logic
- `frontend/src/components/`: UI components
- `backend/app.py`: Flask app entry
- `backend/routes/`: API endpoints
- `backend/models.py`: DB models
- `backend/migrations/`: Alembic migrations

---
For questions, check the relevant `README.md` in each subfolder.

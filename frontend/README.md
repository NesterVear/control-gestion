
# Sistema ACAAC - Frontend React

Interfaz React completa para el sistema de capturas ACAAC integrado con el backend Flask.

## Características

- ✅ **Autenticación** con modal animado del oso polar 🐻‍❄️
- ✅ **Transición zoom-in** después del login
- ✅ **Tema Material-UI oscuro** minimalista
- ✅ **Estructura por características** escalable
- ✅ **Control de acceso por roles**: Lector, Capturista, Administrador, SuperRoot
- ✅ **CRUD completo** para:
  - Capturas (documentos con PDF)
  - Directorio Externo
  - Usuarios (solo SuperRoot)
- ✅ **Dashboard** con estadísticas
- ✅ **React Router** con rutas protegidas
- ✅ **Animaciones Framer Motion**

## Estructura del Proyecto

```
src/
├── features/           # Componentes por característica
│   ├── auth/          # Login modal con oso polar
│   ├── capturas/      # CRUD capturas
│   ├── directorioExterno/  # Gestión directorio
│   └── usuarios/      # Gestión usuarios
├── components/        # Componentes compartidos
│   └── Layout/        # AppBar, Sidebar, MainLayout
├── pages/            # Páginas principales
├── routes/           # Router y rutas protegidas
├── services/         # API calls con Axios
├── contexts/         # Auth context
├── theme/           # Material-UI tema oscuro
└── types/           # TypeScript interfaces
```

## Instalación y Uso

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
```bash
# .env
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=Sistema de Capturas ACAAC
```

3. **Iniciar servidor de desarrollo:**
```bash
npm run dev
```

4. **Construir para producción:**
```bash
npm run build
```

## Integración con Backend Flask

### Autenticación
- Usa header `User-ID` (no JWT tokens)
- Login: `POST /usuarios/login`
- Almacena userId, userRole, userName en localStorage

### API Endpoints
- **Capturas**: `/captura/` (GET, POST), `/captura/<folio>` (PUT, DELETE)
- **Directorio**: `/directorio-externo/` (GET, POST), `/directorio-externo/<id>` (PUT, DELETE)  
- **Usuarios**: `/usuarios/login` (POST), `/usuarios/usuarios` (POST)

### Roles y Permisos
- **SuperRoot**: Acceso completo + gestión usuarios
- **Administrador**: Gestión completa capturas/directorio + alertas
- **Capturista**: Crear/editar capturas
- **Lector**: Solo lectura

## Funcionalidades Clave

### 🐻‍❄️ Login con Oso Polar
- Modal animado con oso polar
- Validación de credenciales
- Transición zoom-in al dashboard

### 📄 Gestión de Capturas
- Lista con búsqueda y filtros
- Formulario completo con fechas
- Soporte para PDF (entrada/respuesta)
- Tipos: Entrada/Salida
- Status: Conocimiento/Respuesta
- Sistema de prioridades

### 📇 Directorio Externo  
- CRUD completo con modals
- Búsqueda por nombre/cargo/institución
- Solo Administrador/SuperRoot pueden modificar

### 👥 Gestión de Usuarios
- Solo SuperRoot puede crear usuarios
- Roles: Lector, Administrador, SuperRoot
- Contraseñas encriptadas (bcrypt en backend)

### 🔔 Test de Alertas
- Endpoint para probar notificaciones
- Sistema de emails automáticos para capturas pendientes

## Tecnologías

- **React 18** con TypeScript
- **Vite** como bundler
- **Material-UI v5** con tema oscuro
- **React Router v6** para navegación
- **Framer Motion** para animaciones
- **Axios** para API calls
- **Date-fns** para manejo de fechas

## Comandos Disponibles

```bash
npm run dev        # Servidor desarrollo
npm run build      # Build producción
npm run preview    # Preview build
npm run lint       # ESLint
```

## Notas del Backend

⚠️ **Inconsistencia detectada**: El modelo `Usuario` en models.py tiene campo `es_super_usuario` (boolean) pero los routes usan `usuario.rol` (string). La app React asume que existe el campo `rol`.

## Creado por 🐻

Sistema desarrollado con amor polar por el equipo ACAAC.

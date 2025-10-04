# TechSolutions Integral

Aplicación web completa que incluye frontend desarrollado en Angular 17, backend API en Node.js/Express y usando PostgreSQL como base de datos. Sistema integral para gestión de usuarios y servicios con autenticación JWT.

##  Arquitectura del Proyecto

El proyecto está dividido en dos partes principales:
- **Frontend**: Angular 17 con TypeScript, Bootstrap 5 y Bootstrap Icons
- **Backend**: Node.js/Express API con autenticación JWT
- **Base de datos**: PostgreSQL

## Frontend (Angular 17)

Aplicación web moderna enfocada en ofrecer una experiencia limpia y consistente con tipografía Spline Sans, Bootstrap 5 y Bootstrap Icons. Incluye página principal con slideshow de servicios, login, panel (dashboard) y módulos administrativos de Usuarios y Servicios. Preparada para despliegue en contenedores con Docker y Nginx.

##  Características
- Home con presentación y slideshow de servicios (4 visibles, autoavance).
- Detalle de servicio con imagen dinámica (Bootstrap Icons o URL).
- Login con navegación hacia el Dashboard.
- Dashboard con accesos a Usuarios y Servicios.
- Módulos de administración:
  - Usuarios: CRUD.
  - Servicios: CRUD.
- Componentes standalone reutilizables: Header y Footer.
- Rutas de respaldo y comodín para evitar pantallas en blanco.

##  Rutas principales
- `/` → Home
- `/login` → Login
- `/dashboard` → Panel principal
- `/usuarios` → Administración de usuarios
- `/servicios` → Administración de servicios
- `/servicio` → Detalle de servicio (demo)


##  Tecnologías
- Angular 17 + TypeScript
- Bootstrap 5 + Bootstrap Icons
- Google Fonts (Spline Sans)
- Docker + Nginx 
- NodeJs + Express
- PostgreSQL

##  Cómo ejecutar

Producción con Docker
1) Construir imagen
	docker build -t techsolutions-frontend .
2) Ejecutar contenedor
	docker run --rm -p 8080:80 techsolutions-frontend
	(o) docker compose up --build
3) Abrir en el navegador: http://localhost:8080

##  Estructura relevante
- `src/app/home/` → Página principal
- `src/app/login/` → Pantalla de inicio de sesión
- `src/app/dashboard/` → Panel principal
- `src/app/usuarios/` → CRUD en memoria de usuarios
- `src/app/servicios/` → CRUD en memoria de servicios
- `src/app/servicio-detalle/` → Detalle de servicio
- `src/app/header/` y `src/app/footer/` → Componentes standalone
- `src/app/servicio-slideshow/` → Slideshow de servicios


## Backend (Node.js/Express)

API REST desarrollada en Node.js con Express

###  Características del Backend
- **Autenticación JWT**: Sistema seguro de login y registro
- **CRUD Usuarios**: Gestión completa de usuarios del dashboard
- **CRUD Servicios**: Gestión completa de servicios del dashboard
- **Validación de datos**: Validación robusta con express-validator
- **Seguridad**: Middleware de seguridad con helmet, cors y rate limiting
- **Logging**: Sistema de logs con morgan

###  Endpoints Principales

#### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/auth/verify` - Verificar token

#### Usuarios
- `GET /api/usuarios` - Obtener usuarios
- `POST /api/usuarios` - Crear usuario
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario

#### Servicios
- `GET /api/servicios` - Obtener servicios
- `POST /api/servicios` - Crear servicio
- `PUT /api/servicios/:id` - Actualizar servicio
- `DELETE /api/servicios/:id` - Eliminar servicio

###  Usuarios por Defecto
- **Admin**: `admin@techsolutions.com` / `admin123`
- **Usuario**: `usuario@techsolutions.com` / `admin123`

##  Instalación y Configuración

### Frontend
```bash
# Navegar al directorio frontend
cd techsolutions_integral

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
# Abrir: http://localhost:4200
```

### Backend
```bash
# Navegar al directorio backend
cd ../backend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
# API disponible en: http://localhost:3000
```

### Con Docker
```bash
# Para desarrollo completo
docker-compose up --build
```

##  Configuración

### Variables de Entorno (Backend)
Crear archivo `backend/.env`:
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=tu_secreto_jwt_muy_seguro_aqui
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:4200
```

##  Estructura del Proyecto

```
techsolutions_integral/
├── techsolutions_integral/     # Frontend Angular
│   ├── src/app/
│   ├── docker-compose.yml
│   └── Dockerfile
└── backend/                    # Backend Node.js
    ├── routes/                # Rutas de la API
    ├── middleware/            # Middlewares
    ├── utils/                # Utilidades
    ├── tests/                # Tests
    └── server.js             # Servidor principal
```


##  Desarrollo

Este proyecto fue realizado como parte de la asignatura **Front-end**, correspondiente al **Grupo B01 - Subgrupo 4**, bajo la orientación del profesor **John Olarte**, en el marco del programa académico de la **Facultad de Ingeniería, Diseño e Innovación** del **Instituto Politécnico Grancolombiano**.

###  Integrantes del equipo

- Cristian Camilo Correa Cuesta  
- Mauricio Figueredo Torres  
- Luis Miguel Castañeda Arciniegas  
- Jorge David Torres Muñoz  
- Jefferson Arenas Zea

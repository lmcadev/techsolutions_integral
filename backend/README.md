# TechSolutions Backend API

Backend API desarrollado en Node.js/Express para la aplicación TechSolutions Integral.

## Características

- **Autenticación JWT**: Sistema de login y registro seguro
- **CRUD Usuarios**: Gestión completa de usuarios del dashboard
- **CRUD Servicios**: Gestión completa de servicios del dashboard
- **Validación de datos**: Validación robusta con express-validator
- **Seguridad**: Middleware de seguridad con helmet, cors y rate limiting
- **Logging**: Sistema de logs con morgan
- **Variables de entorno**: Configuración mediante archivos .env

##  Requisitos

- Node.js >= 14.0.0
- npm >= 6.0.0

## 🛠 Instalación

1. Navegar al directorio del backend:
```bash
cd backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
# Copiar el archivo .env y configurar las variables
cp .env.example .env
```

4. Iniciar el servidor:
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

##  Variables de Entorno

Crear un archivo `.env` en la raíz del directorio backend con:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=tu_secreto_jwt_muy_seguro_aqui
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:4200
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📚 API Endpoints

### Autenticación

#### POST /api/auth/login
Iniciar sesión
```json
{
  "email": "admin@techsolutions.com",
  "password": "admin123"
}
```

#### POST /api/auth/register
Registrar nuevo usuario
```json
{
  "email": "nuevo@techsolutions.com",
  "password": "password123",
  "nombre": "Nuevo Usuario"
}
```

#### GET /api/auth/verify
Verificar token JWT (requiere Authorization Header)

### Usuarios

#### GET /api/usuarios
Obtener todos los usuarios (requiere autenticación)

#### GET /api/usuarios/:id
Obtener usuario por ID (requiere autenticación)

#### POST /api/usuarios
Crear nuevo usuario (requiere autenticación)
```json
{
  "nombre": "Juan Pérez",
  "correo": "juan@example.com"
}
```

#### PUT /api/usuarios/:id
Actualizar usuario (requiere autenticación)
```json
{
  "nombre": "Juan Pérez Actualizado",
  "correo": "juan.actualizado@example.com"
}
```

#### DELETE /api/usuarios/:id
Eliminar usuario (requiere autenticación)

### Servicios

#### GET /api/servicios
Obtener todos los servicios (requiere autenticación)

#### GET /api/servicios/:id
Obtener servicio por ID (requiere autenticación)

#### POST /api/servicios
Crear nuevo servicio (requiere autenticación)
```json
{
  "nombre": "Nuevo Servicio",
  "descripcion": "Descripción del nuevo servicio"
}
```

#### PUT /api/servicios/:id
Actualizar servicio (requiere autenticación)
```json
{
  "nombre": "Servicio Actualizado",
  "descripcion": "Descripción actualizada del servicio"
}
```

#### DELETE /api/servicios/:id
Eliminar servicio (requiere autenticación)

### Salud del Sistema

#### GET /api/health
Verificar estado del servidor
```json
{
  "message": "TechSolutions Backend API funcionando correctamente",
  "timestamp": "2025-09-30T10:00:00.000Z",
  "environment": "development"
}
```

##  Autenticación

La API utiliza JWT (JSON Web Tokens) para la autenticación. Para acceder a rutas protegidas:

1. Hacer login en `/api/auth/login`
2. Incluir el token en el header Authorization: `Bearer <token>`

### Usuarios por defecto:

- **Admin**: `admin@techsolutions.com` / `admin123`
- **Usuario**: `usuario@techsolutions.com` / `admin123`

## Estructura del Proyecto

```
backend/
├── middleware/          # Middlewares personalizados
│   └── auth.js         # Middleware de autenticación JWT
├── routes/             # Definición de rutas
│   ├── auth.js        # Rutas de autenticación
│   ├── usuarios.js    # Rutas CRUD de usuarios
│   └── servicios.js   # Rutas CRUD de servicios
├── utils/              # Utilidades
│   ├── passwordUtils.js  # Utilidades para contraseñas
│   └── responseUtils.js  # Utilidades para respuestas HTTP
├── .env               # Variables de entorno
├── .gitignore        # Archivos ignorados por Git
├── package.json      # Dependencias y scripts
└── server.js         # Punto de entrada de la aplicación
```

##  Seguridad

- **Helmet**: Protección contra vulnerabilidades comunes
- **CORS**: Configurado para permitir solo el frontend
- **Rate Limiting**: Límite de requests por IP
- **JWT**: Tokens seguros para autenticación
- **Validación**: Validación estricta de inputs con express-validator
- **Bcrypt**: Hashing seguro de contraseñas

##  Desarrollo

Este proyecto fue realizado como parte de la asignatura **Front-end**, correspondiente al **Grupo B01 - Subgrupo 4**, bajo la orientación del profesor **John Olarte**, en el marco del programa académico de la **Facultad de Ingeniería, Diseño e Innovación** del **Instituto Politécnico Grancolombiano**.

###  Integrantes del equipo

- Cristian Camilo Correa Cuesta  
- Mauricio Figueredo Torres  
- Luis Miguel Castañeda Arciniegas  
- Jorge David Torres Muñoz  
- Jefferson Arenas Zea

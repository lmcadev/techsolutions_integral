# TechSolutions Integral – Frontend (Angular 17)

Aplicación web moderna construida con Angular 17, enfocada en ofrecer una experiencia limpia y consistente con tipografía Spline Sans, Bootstrap 5 y Bootstrap Icons. Incluye página principal con slideshow de servicios, login, panel (dashboard) y módulos administrativos de Usuarios y Servicios. Preparada para despliegue en contenedores con Docker y Nginx.

##  Características
- Home con presentación y slideshow de servicios (4 visibles, autoavance).
- Detalle de servicio con imagen/ícono dinámico (Bootstrap Icons o URL).
- Login con navegación hacia el Dashboard.
- Dashboard con accesos a Usuarios y Servicios.
- Módulos de administración:
  - Usuarios: alta/edición/eliminación en memoria.
  - Servicios: alta/edición/eliminación en memoria.
- Componentes standalone reutilizables: Header y Footer.
- Rutas de respaldo y comodín para evitar pantallas en blanco.

##  Rutas principales
- `/` → Home
- `/login` → Login
- `/dashboard` → Panel principal
- `/usuarios` → Administración de usuarios
- `/servicios` → Administración de servicios
- `/servicio` → Detalle de servicio (demo)
- `/*` → Redirección a `/`

##  Tecnologías
- Angular 17 + TypeScript
- Bootstrap 5 + Bootstrap Icons
- Google Fonts (Spline Sans)
- Docker + Nginx (multi-stage build)

##  Cómo ejecutar

Desarrollo
- Requisitos: Node.js 20+
1) Instalar dependencias
	npm install
2) Levantar el servidor de desarrollo
	npm start
3) Abrir en el navegador: http://localhost:4200

Producción con Docker
1) Construir imagen
	docker build -t techsolutions-frontend .
2) Ejecutar contenedor
	docker run --rm -p 8080:80 techsolutions-frontend
	(o) docker compose up --build
3) Abrir en el navegador: http://localhost:8080

##  Estructura relevante
- `src/app/home/` → Página principal (Home)
- `src/app/login/` → Pantalla de inicio de sesión
- `src/app/dashboard/` → Panel principal
- `src/app/usuarios/` → CRUD en memoria de usuarios
- `src/app/servicios/` → CRUD en memoria de servicios
- `src/app/servicio-detalle/` → Detalle de servicio con imagen/ícono
- `src/app/header/` y `src/app/footer/` → Componentes standalone
- `src/app/servicio-slideshow/` → Slideshow de servicios (importado en Home)

##  Estilos y UI
- Estilo base con Bootstrap 5.
- Íconos mediante Bootstrap Icons.
- Tipografía Spline Sans aplicada globalmente.
- Sombra y bordes redondeados para tarjetas y contenedores.

##  Configuración de Docker/Nginx
- `Dockerfile` multi-stage: build de Angular y runtime con Nginx.
- `nginx.conf` preparado para SPA: `try_files` con fallback a `index.html`.
- `.dockerignore` para builds más rápidos.
- `docker-compose.yml` para orquestar el servicio web en `:8080`.

##  Notas de desarrollo
- Componentes standalone: `HeaderComponent`, `FooterComponent`, `HomeComponent`, slideshow, etc.
- Router configurado con rutas de fallback para evitar pantallas vacías.
- Formularios simples con `ngModel` (FormsModule).

##  Próximos pasos sugeridos
- Conectar Usuarios y Servicios a una API real (HTTPClient).
- Manejo de estado y feedback (toasts/spinners/errores).
- Autenticación real y guardas de ruta para `/dashboard` y módulos admin.
- Parametrizar detalle de servicio (`/servicio/:id`).

---

##  Desarrollo

Este proyecto fue realizado como parte de la asignatura **Front-end**, correspondiente al **Grupo B01 - Subgrupo 4**, bajo la orientación del profesor **John Olarte**, en el marco del programa académico de la **Facultad de Ingeniería, Diseño e Innovación** del **Instituto Politécnico Grancolombiano**.

###  Integrantes del equipo

- Cristian Camilo Correa Cuesta  
- Mauricio Figueredo Torres  
- Luis Miguel Castañeda Arciniegas  
- Jorge David Torres Muñoz  
- Jefferson Arenas Zea

# Build multi-etapa para aplicación Angular
# Etapa 1: Compilar aplicación Angular
FROM node:18-alpine AS build
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar codigo fuente y compilar
COPY . .
# Ejecutar build de produccion
RUN npm run build -- --configuration=production

# Etapa 2: Servir con Nginx
FROM nginx:1.25-alpine AS runtime
# Copiar configuracion de Nginx para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copiar aplicacion compilada
COPY --from=build /app/dist/techsolutions-login /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

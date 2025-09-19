# Multi-stage build for Angular app
# 1) Build stage: compile Angular app
FROM node:20-alpine AS build
WORKDIR /app

# Install deps (layered for better caching)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
# Use project script which runs: ng build
RUN npm run build -- --configuration=production

# 2) Runtime stage: serve with Nginx
FROM nginx:1.25-alpine AS runtime
# Copy SPA-friendly nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy built app
COPY --from=build /app/dist/techsolutions-login /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

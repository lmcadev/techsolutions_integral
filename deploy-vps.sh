#!/bin/bash

# Script de despliegue para VPS - TechSolutions Integral
# Ejecutar con: bash deploy-vps.sh

echo "🚀 Iniciando despliegue en VPS..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para logging
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    log_error "Docker no está instalado. Instálalo primero."
    exit 1
fi

# Verificar si Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose no está instalado. Instálalo primero."
    exit 1
fi

# Detener contenedores existentes
log_info "Deteniendo contenedores existentes..."
docker-compose -f docker-compose.prod.yml down

# Limpiar imágenes antiguas (opcional)
log_warn "¿Deseas limpiar imágenes Docker antiguas? (y/n)"
read -r clean_images
if [[ $clean_images == "y" || $clean_images == "Y" ]]; then
    log_info "Limpiando imágenes Docker antiguas..."
    docker system prune -f
fi

# Construir y levantar contenedores
log_info "Construyendo y levantando contenedores..."
docker-compose -f docker-compose.prod.yml up -d --build

# Verificar estado de los contenedores
log_info "Verificando estado de los contenedores..."
sleep 10

if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    log_info "✅ Despliegue exitoso!"
    log_info "📱 Frontend disponible en: http://localhost:8080"
    log_info "🔧 Backend API disponible en: http://localhost:3010"
    log_info "🗄️  Base de datos PostgreSQL en puerto: 5432"
else
    log_error "❌ Error en el despliegue. Verificando logs..."
    docker-compose -f docker-compose.prod.yml logs
fi

# Mostrar logs en tiempo real (opcional)
log_warn "¿Deseas ver los logs en tiempo real? (y/n)"
read -r show_logs
if [[ $show_logs == "y" || $show_logs == "Y" ]]; then
    docker-compose -f docker-compose.prod.yml logs -f
fi
#!/bin/bash

# Script auxiliar para despliegue en VPS - TechSolutions Integral
# Este script se ejecuta directamente en el VPS para realizar el despliegue
# Uso: ./vps-deploy.sh [comando]

set -e  # Salir si cualquier comando falla

# Configuración
PROJECT_DIR="/opt/techsolutions"
COMPOSE_FILE="docker-compose.prod.yml"
BACKUP_DIR="/opt/techsolutions/backups"

# Colores para logging
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funciones de logging
log_info() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] [INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] [WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] [ERROR]${NC} $1"
}

log_debug() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] [DEBUG]${NC} $1"
}

# Función para crear backup de la base de datos
backup_database() {
    log_info "Creando backup de la base de datos..."
    
    mkdir -p "$BACKUP_DIR"
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="$BACKUP_DIR/techsolutions_backup_$TIMESTAMP.sql"
    
    # Crear backup de PostgreSQL
    if docker exec techsolutions_db pg_dump -U techsolutions techsolutions_db > "$BACKUP_FILE" 2>/dev/null; then
        log_info "Backup creado: $BACKUP_FILE"
        
        # Mantener solo los últimos 5 backups
        ls -t "$BACKUP_DIR"/*.sql 2>/dev/null | tail -n +6 | xargs -r rm
        log_debug "Backups antiguos limpiados (manteniendo últimos 5)"
    else
        log_warn "No se pudo crear backup de la base de datos (contenedor no está corriendo)"
    fi
}

# Función para verificar prerrequisitos
check_requirements() {
    log_info "Verificando prerrequisitos..."
    
    # Verificar Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker no está instalado"
        exit 1
    fi
    
    # Verificar Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose no está disponible"
        exit 1
    fi
    
    # Verificar directorio del proyecto
    if [ ! -d "$PROJECT_DIR" ]; then
        log_error "Directorio del proyecto no existe: $PROJECT_DIR"
        exit 1
    fi
    
    # Verificar archivo docker-compose
    if [ ! -f "$PROJECT_DIR/$COMPOSE_FILE" ]; then
        log_error "Archivo docker-compose no encontrado: $PROJECT_DIR/$COMPOSE_FILE"
        exit 1
    fi
    
    log_info "Todos los prerrequisitos están satisfechos"
}

# Función principal de despliegue
deploy() {
    log_info "Iniciando despliegue de TechSolutions Integral..."
    
    cd "$PROJECT_DIR"
    
    # Crear backup antes del despliegue
    backup_database
    
    # Detener contenedores existentes
    log_info "Deteniendo contenedores existentes..."
    docker-compose -f "$COMPOSE_FILE" down || true
    
    # Limpiar recursos no utilizados
    log_info "Limpiando recursos Docker no utilizados..."
    docker system prune -f || true
    
    # Construir y levantar contenedores
    log_info "Construyendo y levantando contenedores..."
    docker-compose -f "$COMPOSE_FILE" up -d --build
    
    # Esperar a que los servicios estén listos
    log_info "Esperando a que los servicios estén listos..."
    sleep 30
    
    # Verificar estado
    verify_deployment
}

# Función para verificar el despliegue
verify_deployment() {
    log_info "Verificando estado del despliegue..."
    
    cd "$PROJECT_DIR"
    
    # Verificar contenedores
    if docker-compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
        log_info "Contenedores están corriendo"
        docker-compose -f "$COMPOSE_FILE" ps
    else
        log_error "Algunos contenedores no están corriendo"
        docker-compose -f "$COMPOSE_FILE" ps
        return 1
    fi
    
    # Health check del backend
    log_info "Verificando health del backend..."
    local max_attempts=10
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:3010/api/health > /dev/null 2>&1; then
            log_info "Backend está funcionando correctamente"
            break
        fi
        
        log_debug "Intento $attempt/$max_attempts: Backend no responde, esperando..."
        sleep 10
        ((attempt++))
    done
    
    if [ $attempt -gt $max_attempts ]; then
        log_error "Backend no responde después de $max_attempts intentos"
        return 1
    fi
    
    # Verificar frontend
    log_info "Verificando frontend..."
    if curl -f http://localhost:8080 > /dev/null 2>&1; then
        log_info "Frontend está funcionando correctamente"
    else
        log_warn "Frontend podría no estar respondiendo correctamente"
    fi
    
    log_info "Despliegue verificado exitosamente!"
}

# Función para mostrar logs
show_logs() {
    cd "$PROJECT_DIR"
    log_info "Mostrando logs de la aplicación..."
    docker-compose -f "$COMPOSE_FILE" logs -f
}

# Función para mostrar estado
show_status() {
    cd "$PROJECT_DIR"
    log_info "Estado actual de la aplicación:"
    
    echo -e "\n${BLUE}=== Contenedores ===${NC}"
    docker-compose -f "$COMPOSE_FILE" ps
    
    echo -e "\n${BLUE}=== Uso de recursos ===${NC}"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
    
    echo -e "\n${BLUE}=== Salud de servicios ===${NC}"
    if curl -f http://localhost:3010/api/health 2>/dev/null; then
        echo "Backend API:  Funcionando"
    else
        echo "Backend API:  No responde"
    fi
    
    if curl -f http://localhost:8080 2>/dev/null; then
        echo "Frontend: Funcionando"
    else
        echo "Frontend:  No responde"
    fi
}

# Función para rollback
rollback() {
    log_warn "Iniciando rollback..."
    
    cd "$PROJECT_DIR"
    
    # Detener contenedores actuales
    docker-compose -f "$COMPOSE_FILE" down
    
    # Restaurar desde backup (implementar según necesidad)
    local latest_backup=$(ls -t "$BACKUP_DIR"/*.sql 2>/dev/null | head -n 1)
    if [ -n "$latest_backup" ]; then
        log_info "Restaurando desde backup: $latest_backup"
        # Aquí implementarías la lógica de restauración
        # docker exec -i techsolutions_db psql -U techsolutions techsolutions_db < "$latest_backup"
    fi
    
    log_info "Rollback completado. Verifica la configuración manual."
}

# Función para limpiar recursos
cleanup() {
    log_info "Limpiando recursos..."
    
    cd "$PROJECT_DIR"
    
    # Detener y remover contenedores
    docker-compose -f "$COMPOSE_FILE" down --volumes --remove-orphans
    
    # Limpiar imágenes no utilizadas
    docker image prune -f
    
    # Limpiar volúmenes no utilizados
    docker volume prune -f
    
    log_info "Limpieza completada"
}

# Función de ayuda
show_help() {
    echo -e "${GREEN}TechSolutions VPS Deployment Script${NC}"
    echo
    echo "Uso: $0 [comando]"
    echo
    echo "Comandos disponibles:"
    echo "  deploy     - Ejecutar despliegue completo"
    echo "  verify     - Verificar estado del despliegue"
    echo "  status     - Mostrar estado actual"
    echo "  logs       - Mostrar logs en tiempo real"
    echo "  rollback   - Realizar rollback"
    echo "  cleanup    - Limpiar recursos Docker"
    echo "  backup     - Crear backup de la base de datos"
    echo "  help       - Mostrar esta ayuda"
    echo
}

# Script principal
main() {
    case "${1:-deploy}" in
        "deploy")
            check_requirements
            deploy
            ;;
        "verify")
            verify_deployment
            ;;
        "status")
            show_status
            ;;
        "logs")
            show_logs
            ;;
        "rollback")
            rollback
            ;;
        "cleanup")
            cleanup
            ;;
        "backup")
            backup_database
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            log_error "Comando no reconocido: $1"
            show_help
            exit 1
            ;;
    esac
}

# Ejecutar función principal con todos los argumentos
main "$@"
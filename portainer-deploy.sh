#!/bin/bash

# Script de Gestión Portainer - TechSolutions Integral
# Uso: ./portainer-deploy.sh [comando]

set -e

# Configuración
STACK_NAME="techsolutions-integral"
COMPOSE_FILE="docker-compose.portainer.yml"
DOMAIN="techsolutions.lmcadev.com"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Funciones de logging
log_info() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')]   $1${NC}"
}

log_warn() {
    echo -e "${YELLOW}[$(date +'%H:%M:%S')]  $1${NC}"
}

log_error() {
    echo -e "${RED}[$(date +'%H:%M:%S')]  $1${NC}"
}

log_success() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')]  $1${NC}"
}

log_debug() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]  $1${NC}"
}

log_header() {
    echo -e "${PURPLE}[$(date +'%H:%M:%S')]  $1${NC}"
}

#  Función para obtener token de Portainer
get_portainer_token() {
    if [ -z "$PORTAINER_URL" ] || [ -z "$PORTAINER_USERNAME" ] || [ -z "$PORTAINER_PASSWORD" ]; then
        log_error "Variables de Portainer no configuradas. Configura:"
        echo "export PORTAINER_URL=\"https://tu-ip:9443\""
        echo "export PORTAINER_USERNAME=\"admin\""
        echo "export PORTAINER_PASSWORD=\"tu-password\""
        exit 1
    fi

    log_info "Obteniendo token de autenticación de Portainer..."
    
    TOKEN=$(curl -s -X POST "$PORTAINER_URL/api/auth" \
        -H "Content-Type: application/json" \
        -d "{\"Username\": \"$PORTAINER_USERNAME\", \"Password\": \"$PORTAINER_PASSWORD\"}" \
        | jq -r .jwt 2>/dev/null)
    
    if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
        log_error "No se pudo obtener token de Portainer"
        log_error "Verifica las credenciales y que Portainer esté accesible"
        exit 1
    fi
    
    log_success "Token obtenido exitosamente"
    echo $TOKEN
}

#  Función para listar stacks
list_stacks() {
    log_header "Listando stacks de Portainer"
    
    TOKEN=$(get_portainer_token)
    
    log_info "Obteniendo lista de stacks..."
    STACKS=$(curl -s -X GET "$PORTAINER_URL/api/stacks" \
        -H "Authorization: Bearer $TOKEN")
    
    echo -e "\n${BLUE}=== Stacks en Portainer ===${NC}"
    echo "$STACKS" | jq -r '.[] | "ID: \(.Id) | Nombre: \(.Name) | Estado: \(.Status) | Endpoint: \(.EndpointId)"' 2>/dev/null || echo "No se pudieron obtener los stacks"
}

#  Función para mostrar información del stack
show_stack_info() {
    log_header " Información del stack TechSolutions"
    
    TOKEN=$(get_portainer_token)
    
    STACK_ID=$(curl -s -X GET "$PORTAINER_URL/api/stacks" \
        -H "Authorization: Bearer $TOKEN" \
        | jq -r ".[] | select(.Name == \"$STACK_NAME\") | .Id" 2>/dev/null)
    
    if [ "$STACK_ID" = "" ]; then
        log_warn "Stack '$STACK_NAME' no encontrado"
        return 1
    fi
    
    log_info "Stack encontrado con ID: $STACK_ID"
    
    # Obtener detalles del stack
    STACK_DETAILS=$(curl -s -X GET "$PORTAINER_URL/api/stacks/$STACK_ID" \
        -H "Authorization: Bearer $TOKEN")
    
    echo -e "\n${BLUE}=== Detalles del Stack ===${NC}"
    echo "$STACK_DETAILS" | jq -r '"Nombre: " + .Name, "Estado: " + (.Status // "N/A"), "Endpoint: " + (.EndpointId | tostring)' 2>/dev/null
    
    # Verificar contenedores
    log_info "Verificando contenedores..."
    
    # Health check de la aplicación
    check_application_health
}

#  Función para verificar salud de la aplicación
check_application_health() {
    log_header "Verificando salud de la aplicación"
    
    log_info "Verificando frontend en https://$DOMAIN"
    if curl -f -s "https://$DOMAIN" > /dev/null; then
        log_success "Frontend funcionando correctamente"
    else
        log_warn "Frontend no responde o no está accesible"
    fi
    
    log_info "Verificando API en https://$DOMAIN/api/health"
    if curl -f -s "https://$DOMAIN/api/health" > /dev/null; then
        log_success "API funcionando correctamente"
    else
        log_warn "API no responde o no está accesible"
    fi
}

#  Función para desplegar stack
deploy_stack() {
    log_header " Desplegando TechSolutions en Portainer"
    
    if [ ! -f "$COMPOSE_FILE" ]; then
        log_error "Archivo $COMPOSE_FILE no encontrado"
        exit 1
    fi
    
    TOKEN=$(get_portainer_token)
    ENDPOINT_ID=${PORTAINER_ENDPOINT_ID:-1}
    
    # Verificar si el stack existe
    STACK_ID=$(curl -s -X GET "$PORTAINER_URL/api/stacks" \
        -H "Authorization: Bearer $TOKEN" \
        | jq -r ".[] | select(.Name == \"$STACK_NAME\") | .Id" 2>/dev/null)
    
    # Preparar contenido del docker-compose
    COMPOSE_CONTENT=$(cat "$COMPOSE_FILE" | jq -Rs .)
    
    if [ "$STACK_ID" = "" ]; then
        log_info "Creando nuevo stack..."
        
        RESPONSE=$(curl -s -X POST "$PORTAINER_URL/api/stacks" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "{
                \"Name\": \"$STACK_NAME\",
                \"StackFileContent\": $COMPOSE_CONTENT,
                \"EndpointId\": $ENDPOINT_ID
            }")
        
        NEW_STACK_ID=$(echo $RESPONSE | jq -r .Id 2>/dev/null)
        
        if [ "$NEW_STACK_ID" != "null" ] && [ -n "$NEW_STACK_ID" ]; then
            log_success "Stack creado exitosamente con ID: $NEW_STACK_ID"
        else
            log_error "Error creando stack: $RESPONSE"
            exit 1
        fi
    else
        log_info "Actualizando stack existente (ID: $STACK_ID)..."
        
        RESPONSE=$(curl -s -X PUT "$PORTAINER_URL/api/stacks/$STACK_ID" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "{
                \"StackFileContent\": $COMPOSE_CONTENT,
                \"EndpointId\": $ENDPOINT_ID
            }")
        
        log_success "Stack actualizado exitosamente"
    fi
    
    # Esperar un poco para que el stack se inicie
    log_info "Esperando a que el stack se inicie..."
    sleep 30
    
    # Verificar el despliegue
    check_application_health
    
    log_success " Despliegue completado!"
    echo -e "\n${GREEN}📱 Accede a tu aplicación:${NC}"
    echo -e " Frontend: ${BLUE}https://$DOMAIN${NC}"
    echo -e " API: ${BLUE}https://$DOMAIN/api/health${NC}"
    echo -e " Portainer: ${BLUE}$PORTAINER_URL${NC}"
}

#  Función para detener stack
stop_stack() {
    log_header "Deteniendo stack TechSolutions"
    
    TOKEN=$(get_portainer_token)
    
    STACK_ID=$(curl -s -X GET "$PORTAINER_URL/api/stacks" \
        -H "Authorization: Bearer $TOKEN" \
        | jq -r ".[] | select(.Name == \"$STACK_NAME\") | .Id" 2>/dev/null)
    
    if [ "$STACK_ID" = "" ]; then
        log_warn "Stack '$STACK_NAME' no encontrado"
        return 1
    fi
    
    log_info "Deteniendo stack (ID: $STACK_ID)..."
    
    curl -s -X POST "$PORTAINER_URL/api/stacks/$STACK_ID/stop" \
        -H "Authorization: Bearer $TOKEN" > /dev/null
    
    log_success "Stack detenido exitosamente"
}

# Función para reiniciar stack
restart_stack() {
    log_header "Reiniciando stack TechSolutions"
    
    stop_stack
    sleep 10
    deploy_stack
}

#  Función para eliminar stack
remove_stack() {
    log_header " Eliminando stack TechSolutions"
    
    log_warn " Esta acción eliminará completamente el stack y sus datos"
    read -p "¿Estás seguro? (y/N): " confirm
    
    if [[ $confirm != "y" && $confirm != "Y" ]]; then
        log_info "Operación cancelada"
        return 0
    fi
    
    TOKEN=$(get_portainer_token)
    
    STACK_ID=$(curl -s -X GET "$PORTAINER_URL/api/stacks" \
        -H "Authorization: Bearer $TOKEN" \
        | jq -r ".[] | select(.Name == \"$STACK_NAME\") | .Id" 2>/dev/null)
    
    if [ "$STACK_ID" = "" ]; then
        log_warn "Stack '$STACK_NAME' no encontrado"
        return 1
    fi
    
    log_info "Eliminando stack (ID: $STACK_ID)..."
    
    curl -s -X DELETE "$PORTAINER_URL/api/stacks/$STACK_ID" \
        -H "Authorization: Bearer $TOKEN" > /dev/null
    
    log_success "Stack eliminado exitosamente"
}

#  Función para mostrar logs
show_logs() {
    log_header "Logs de la aplicación"
    log_info "Para ver logs detallados, usa Portainer Web UI:"
    echo -e " ${BLUE}$PORTAINER_URL${NC}"
    echo -e " Busca el stack: ${YELLOW}$STACK_NAME${NC}"
    echo -e " Ve a cada contenedor y revisa los logs"
}

#  Función de ayuda
show_help() {
    echo -e "${PURPLE} TechSolutions Portainer Management${NC}"
    echo
    echo -e "${BLUE}Gestión de deployment para Hostinger VPS + CloudPanel + Portainer${NC}"
    echo
    echo "Uso: $0 [comando]"
    echo
    echo "Comandos disponibles:"
    echo "  deploy     - Desplegar/actualizar stack en Portainer"
    echo "  info       - Mostrar información del stack"
    echo "  health     - Verificar salud de la aplicación"
    echo "  list       - Listar todos los stacks"
    echo "  stop       - Detener el stack"
    echo "  restart    - Reiniciar el stack"
    echo "  remove     - Eliminar el stack (CUIDADO)"
    echo "  logs       - Información sobre logs"
    echo "  help       - Mostrar esta ayuda"
    echo
    echo -e "${YELLOW}Variables de entorno necesarias:${NC}"
    echo "  PORTAINER_URL        - URL de Portainer (ej: https://tu-ip:9443)"
    echo "  PORTAINER_USERNAME   - Usuario de Portainer"
    echo "  PORTAINER_PASSWORD   - Contraseña de Portainer"
    echo "  PORTAINER_ENDPOINT_ID- ID del endpoint Docker (opcional, default: 1)"
    echo
    echo -e "${GREEN}Ejemplos:${NC}"
    echo "  export PORTAINER_URL=\"https://192.168.1.100:9443\""
    echo "  export PORTAINER_USERNAME=\"admin\""
    echo "  export PORTAINER_PASSWORD=\"mi-password\""
    echo "  ./portainer-deploy.sh deploy"
}

#  Función principal
main() {
    case "${1:-help}" in
        "deploy")
            deploy_stack
            ;;
        "info")
            show_stack_info
            ;;
        "health")
            check_application_health
            ;;
        "list")
            list_stacks
            ;;
        "stop")
            stop_stack
            ;;
        "restart")
            restart_stack
            ;;
        "remove")
            remove_stack
            ;;
        "logs")
            show_logs
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            log_error "Comando no reconocido: $1"
            echo
            show_help
            exit 1
            ;;
    esac
}

#  Ejecutar función principal
main "$@"
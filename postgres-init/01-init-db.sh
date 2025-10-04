#!/bin/bash
set -e

# Script de inicialización de PostgreSQL para TechSolutions Integral
# Este script se ejecuta automáticamente cuando se crea el contenedor por primera vez

echo "🚀 Inicializando base de datos TechSolutions Integral..."

# Crear extensiones necesarias
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Crear extensión para UUID (si la necesitas)
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    -- Crear extensión para funciones adicionales de texto
    CREATE EXTENSION IF NOT EXISTS "unaccent";
    
    -- Configurar zona horaria por defecto
    SET timezone = 'America/Bogota';
    
    -- Mostrar información de la base de datos
    SELECT 'Base de datos TechSolutions Integral inicializada correctamente' as status;
    SELECT current_database() as database_name;
    SELECT current_user as current_user;
    SELECT version() as postgresql_version;
EOSQL

echo "✅ Base de datos inicializada correctamente"
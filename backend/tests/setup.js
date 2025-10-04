const db = require('../db');

let isDbInitialized = false;

// Función para limpiar y reinicializar la base de datos
async function resetDatabase() {
  try {
    // Limpiar tablas existentes
    await db.query('DROP TABLE IF EXISTS usuarios CASCADE');
    await db.query('DROP TABLE IF EXISTS servicios CASCADE');
    
    console.log('Tablas limpiadas');
    
    // Solo crear tablas (sin datos iniciales para tests)
    await db.createTables();
    console.log('Tablas creadas para tests');
    
  } catch (error) {
    console.error('Error reinicializando base de datos:', error);
    throw error;
  }
}

// Setup global para los tests - una sola vez al inicio
beforeAll(async () => {
  console.log('Configurando entorno de pruebas...');
  
  if (!isDbInitialized) {
    await resetDatabase();
    isDbInitialized = true;
  }
});

// Limpiar datos entre cada test file para evitar conflictos
beforeEach(async () => {
  try {
    // Solo limpiar datos, no recrear tablas
    await db.query('TRUNCATE TABLE usuarios RESTART IDENTITY CASCADE');
    await db.query('TRUNCATE TABLE servicios RESTART IDENTITY CASCADE');
    
    // Recrear usuario admin para cada test
    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash('admin123', 10);
    await db.query(
      'INSERT INTO usuarios (nombre, correo, password, rol) VALUES ($1, $2, $3, $4)',
      ['Administrador', 'admin@techsolutions.com', passwordHash, 'admin']
    );
    
    // Crear algunos servicios básicos para los tests
    await db.query(
      'INSERT INTO servicios (nombre, descripcion, precio, icono) VALUES ($1, $2, $3, $4)',
      ['Servicio Test', 'Descripción de prueba', 99.99, 'bi-gear']
    );
    
  } catch (error) {
    console.error('Error preparando datos para test:', error);
  }
});

afterAll(async () => {
  // Limpiar recursos después de todos los tests
  console.log('Limpiando recursos de pruebas...');
  
  try {
    if (db.pool) {
      await db.pool.end();
      console.log('Conexión a base de datos cerrada');
    }
  } catch (error) {
    console.error('Error cerrando conexión:', error);
  }
});
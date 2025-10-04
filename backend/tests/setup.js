const db = require('../db');

let isDbInitialized = false;

// Setup global para los tests - una sola vez al inicio
beforeAll(async () => {
  console.log('Configurando entorno de pruebas...');
  
  if (!isDbInitialized) {
    try {
      // Inicializar base de datos normal (crea tablas y datos iniciales)
      await db.init();
      console.log('Base de datos de pruebas inicializada');
      isDbInitialized = true;
    } catch (error) {
      console.error('Error inicializando base de datos de pruebas:', error);
      throw error;
    }
  }
});

// Limpiar datos entre cada test para evitar conflictos
beforeEach(async () => {
  try {
    // Solo limpiar datos, manteniendo la estructura
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
    // No lanzar error aquí para que los tests puedan continuar
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
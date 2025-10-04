const db = require('../db');

// Setup global para los tests
beforeAll(async () => {
  // Configurar base de datos para tests
  console.log('Configurando entorno de pruebas...');
  
  try {
    await db.init();
    console.log('Base de datos de pruebas inicializada');
  } catch (error) {
    console.error('Error inicializando base de datos de pruebas:', error);
    throw error;
  }
});

afterAll(async () => {
  // Limpiar recursos después de los tests
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
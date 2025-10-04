const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Prefer DATABASE_URL (Docker env), otherwise individual PG_* vars
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE
});

async function createTables() {
  // Create tables if they don't exist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      nombre TEXT NOT NULL,
      correo TEXT UNIQUE NOT NULL,
      password TEXT,
      rol TEXT DEFAULT 'user'
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS servicios (
      id SERIAL PRIMARY KEY,
      nombre TEXT UNIQUE NOT NULL,
      descripcion TEXT NOT NULL,
      precio DECIMAL(10,2) DEFAULT 0,
      stock BOOLEAN DEFAULT true,
      icono TEXT DEFAULT 'bi-gear',
      activo BOOLEAN DEFAULT true,
      fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function init() {
  // Create tables first
  await createTables();

  // Seed admin user if no users exist
  const userRes = await pool.query('SELECT COUNT(*) AS count FROM usuarios');
  if (userRes.rows[0].count === '0') {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await pool.query(
      'INSERT INTO usuarios (nombre, correo, password, rol) VALUES ($1,$2,$3,$4)',
      ['Administrador', 'admin@techsolutions.com', passwordHash, 'admin']
    );
    console.log('Usuario administrador creado: admin@techsolutions.com (password: admin123)');
  }

  // Seed services if no services exist
  const servicioRes = await pool.query('SELECT COUNT(*) AS count FROM servicios');
  if (servicioRes.rows[0].count === '0') {
    const serviciosIniciales = [
      { nombre: 'Servicio de nube', descripcion: 'Soluciones completas de computación en la nube para su empresa', precio: 300000, icono: 'bi-cloud' },
      { nombre: 'Servicio de seguridad', descripcion: 'Protección avanzada contra amenazas cibernéticas y vulnerabilidades', precio: 200000, icono: 'bi-gear' },
      { nombre: 'Servicio aplicativos', descripcion: 'Desarrollo de aplicaciones móviles y web personalizadas', precio: 800000, icono: 'bi-phone' },
      { nombre: 'Servicio de diseño web', descripcion: 'Diseño y desarrollo de páginas web modernas y responsivas', precio: 600000, icono: 'bi-display' },
      { nombre: 'Hosting dedicado', descripcion: 'Servidores dedicados con alta disponibilidad y rendimiento', precio: 150000, icono: 'bi-hdd-network' },
      { nombre: 'Correo corporativo', descripcion: 'Soluciones de correo empresarial seguro y profesional', precio: 30000, icono: 'bi-envelope' },
      { nombre: 'Servidores VPS', descripcion: 'Servidores privados virtuales escalables y confiables', precio: 90000, icono: 'bi-server' },
      { nombre: 'Dominio web', descripcion: 'Registro y gestión de dominios web con soporte completo', precio: 20000, icono: 'bi-globe' },
      { nombre: 'Bases de datos', descripcion: 'Gestión y mantenimiento de bases de datos empresariales', precio: 250000, icono: 'bi-database' },
      { nombre: 'Certificados SSL', descripcion: 'Certificados de seguridad para proteger su sitio web', precio: 50000, icono: 'bi-lock' },
      { nombre: 'Analítica web', descripcion: 'Análisis detallado del tráfico y rendimiento de su sitio web', precio: 130000, icono: 'bi-bar-chart' },
      { nombre: 'Soporte técnico', descripcion: 'Soporte técnico especializado 24/7 para su infraestructura', precio: 100000, icono: 'bi-people' },
      { nombre: 'Desarrollo a medida', descripcion: 'Desarrollo de software personalizado según sus necesidades', precio: 1300000, icono: 'bi-laptop' },
      { nombre: 'Pasarelas de pago', descripcion: 'Integración segura de métodos de pago en su plataforma', precio: 200000, icono: 'bi-credit-card' },
      { nombre: 'Redes y conectividad', descripcion: 'Diseño e implementación de redes empresariales', precio: 400000, icono: 'bi-wifi' },
      { nombre: 'Consultoría TI', descripcion: 'Asesoría especializada en tecnologías de la información', precio: 180000, icono: 'bi-briefcase' },
      { nombre: 'Backups automáticos', descripcion: 'Respaldos automatizados y recuperación de datos', precio: 70000, icono: 'bi-clipboard-data' },
      { nombre: 'Auditoría de seguridad', descripcion: 'Evaluación completa de la seguridad de su infraestructura', precio: 300000, icono: 'bi-bug' },
      { nombre: 'Optimización web', descripcion: 'Mejora del rendimiento y velocidad de su sitio web', precio: 350000, icono: 'bi-rocket' },
      { nombre: 'Infraestructura cloud', descripcion: 'Diseño y gestión de infraestructura en la nube', precio: 450000, icono: 'bi-lightning' }
    ];

    for (const servicio of serviciosIniciales) {
      await pool.query(
        'INSERT INTO servicios (nombre, descripcion, precio, icono, stock) VALUES ($1, $2, $3, $4, $5)',
        [servicio.nombre, servicio.descripcion, servicio.precio, servicio.icono, true]
      );
    }
    console.log('Servicios iniciales creados en la base de datos');
  }
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  init,
  createTables
};

// Servidor principal de TechSolutions Integral
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importar rutas de la API
const authRoutes = require('./routes/auth');
const usuariosRoutes = require('./routes/usuarios');
const serviciosRoutes = require('./routes/servicios');

const app = express();
const PORT = process.env.PORT || 3000; // Puerto del servidor

// Configurar seguridad con Helmet
app.use(helmet());

// Limitar requests para prevenir ataques
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // Ventana de 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Máximo 100 requests
  message: {
    error: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.'
  }
});

app.use('/api', limiter); // Aplicar rate limiting a todas las rutas API

// Configurar CORS para permitir requests desde el frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true
}));

// Logger para requests HTTP
app.use(morgan('combined'));

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configurar rutas de la API
app.use('/api/auth', authRoutes); // Rutas de autenticación
app.use('/api/usuarios', usuariosRoutes); // Rutas de usuarios
app.use('/api/servicios', serviciosRoutes); // Rutas de servicios

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.status(200).json({
    message: 'TechSolutions Backend API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe en este servidor`
  });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});

const db = require('./db');

// Iniciar servidor después de inicializar DB
(async () => {
  try {
    await db.init();
    console.log('📦 Base de datos inicializada');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API disponible en: http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error('Fallo inicializando la base de datos:', err);
    process.exit(1);
  }
})();

module.exports = app;
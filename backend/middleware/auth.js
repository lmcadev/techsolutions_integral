const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticación JWT
 * Verifica que el token sea válido y extrae la información del usuario
 */
const authMiddleware = (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        error: 'Token no proporcionado',
        message: 'Se requiere autenticación para acceder a este recurso'
      });
    }

    // Verificar formato "Bearer <token>"
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        error: 'Formato de token inválido',
        message: 'El token debe estar en formato Bearer'
      });
    }

    // Verificar y decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Agregar información del usuario al request
    req.usuario = {
      id: decoded.id,
      correo: decoded.correo,
      rol: decoded.rol
    };

    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token inválido',
        message: 'El token proporcionado no es válido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado',
        message: 'El token ha expirado, por favor inicia sesión nuevamente'
      });
    }

    return res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error durante la verificación de autenticación'
    });
  }
};

module.exports = authMiddleware;
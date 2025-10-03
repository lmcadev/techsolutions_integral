/**
 * Utilidades para respuestas HTTP estandarizadas
 */
class ResponseUtils {
  /**
   * Respuesta exitosa
   * @param {Object} res - Objeto response de Express
   * @param {*} data - Datos a retornar
   * @param {string} message - Mensaje descriptivo
   * @param {number} statusCode - Código de estado HTTP
   */
  static success(res, data = null, message = 'Operación exitosa', statusCode = 200) {
    const response = {
      success: true,
      message,
      timestamp: new Date().toISOString()
    };

    if (data !== null) {
      response.data = data;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Respuesta de error
   * @param {Object} res - Objeto response de Express
   * @param {string} error - Tipo de error
   * @param {string} message - Mensaje descriptivo del error
   * @param {number} statusCode - Código de estado HTTP
   * @param {Array} details - Detalles adicionales del error
   */
  static error(res, error = 'Error', message = 'Ha ocurrido un error', statusCode = 500, details = null) {
    const response = {
      success: false,
      error,
      message,
      timestamp: new Date().toISOURL()
    };

    if (details) {
      response.details = details;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Respuesta de validación fallida
   * @param {Object} res - Objeto response de Express
   * @param {Array} errors - Array de errores de validación
   */
  static validationError(res, errors) {
    return this.error(
      res,
      'Errores de validación',
      'Los datos proporcionados no son válidos',
      400,
      errors
    );
  }

  /**
   * Respuesta de no autorizado
   * @param {Object} res - Objeto response de Express
   * @param {string} message - Mensaje personalizado
   */
  static unauthorized(res, message = 'No autorizado') {
    return this.error(res, 'No autorizado', message, 401);
  }

  /**
   * Respuesta de no encontrado
   * @param {Object} res - Objeto response de Express
   * @param {string} resource - Recurso no encontrado
   */
  static notFound(res, resource = 'Recurso') {
    return this.error(res, 'No encontrado', `${resource} no encontrado`, 404);
  }

  /**
   * Respuesta de conflicto
   * @param {Object} res - Objeto response de Express
   * @param {string} message - Mensaje de conflicto
   */
  static conflict(res, message = 'El recurso ya existe') {
    return this.error(res, 'Conflicto', message, 409);
  }
}

module.exports = ResponseUtils;
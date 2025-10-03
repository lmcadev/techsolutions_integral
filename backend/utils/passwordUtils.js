const bcrypt = require('bcryptjs');

/**
 * Utilidades para manejo de contraseñas
 */
class PasswordUtils {
  /**
   * Hashea una contraseña
   * @param {string} password - Contraseña en texto plano
   * @returns {Promise<string>} - Contraseña hasheada
   */
  static async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Compara una contraseña con su hash
   * @param {string} password - Contraseña en texto plano
   * @param {string} hash - Hash de la contraseña
   * @returns {Promise<boolean>} - True si coinciden
   */
  static async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Valida la fortaleza de una contraseña
   * @param {string} password - Contraseña a validar
   * @returns {Object} - Resultado de la validación
   */
  static validatePassword(password) {
    const errors = [];
    
    if (password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra minúscula');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra mayúscula');
    }
    
    if (!/\d/.test(password)) {
      errors.push('La contraseña debe contener al menos un número');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = PasswordUtils;
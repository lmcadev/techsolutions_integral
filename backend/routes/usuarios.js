const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middleware/auth');
const db = require('../db');
const router = express.Router();

// Validaciones
const usuarioValidation = [
  body('nombre')
    .isLength({ min: 2 })
    .withMessage('El nombre debe tener al menos 2 caracteres')
    .trim(),
  body('correo')
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
    .normalizeEmail()
];

const crearUsuarioValidation = [
  body('nombre')
    .isLength({ min: 2 })
    .withMessage('El nombre debe tener al menos 2 caracteres')
    .trim(),
  body('correo')
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('rol')
    .isIn(['admin', 'user'])
    .withMessage('El rol debe ser admin o user')
];

const actualizarUsuarioValidation = [
  body('nombre')
    .isLength({ min: 2 })
    .withMessage('El nombre debe tener al menos 2 caracteres')
    .trim(),
  body('correo')
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),
  body('rol')
    .isIn(['admin', 'user'])
    .withMessage('El rol debe ser admin o user')
];

// GET /api/usuarios
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await db.query('SELECT id, nombre, correo, rol FROM usuarios ORDER BY id');
    res.json({ message: 'Usuarios obtenidos exitosamente', data: result.rows, total: result.rows.length });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor', message: 'Error al obtener los usuarios' });
  }
});

// GET /api/usuarios/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await db.query('SELECT id, nombre, correo, rol FROM usuarios WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado', message: `No existe un usuario con ID ${id}` });
    res.json({ message: 'Usuario obtenido exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor', message: 'Error al obtener el usuario' });
  }
});

// POST /api/usuarios
router.post('/', authMiddleware, crearUsuarioValidation, async (req, res) => {
  try {
    // Verificar que el usuario que hace la petición sea admin
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado', message: 'Solo los administradores pueden crear usuarios' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Datos de entrada inválidos', details: errors.array() });

    const { nombre, correo, password, rol } = req.body;
    const exists = await db.query('SELECT id FROM usuarios WHERE correo = $1', [correo]);
    if (exists.rows.length > 0) return res.status(409).json({ error: 'Usuario ya existe', message: 'Ya existe un usuario con este correo electrónico' });

    const passwordHash = await bcrypt.hash(password, 10);
    const insert = await db.query('INSERT INTO usuarios (nombre, correo, password, rol) VALUES ($1,$2,$3,$4) RETURNING id, nombre, correo, rol', [nombre, correo, passwordHash, rol]);
    res.status(201).json({ message: 'Usuario creado exitosamente', data: insert.rows[0] });
  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor', message: 'Error al crear el usuario' });
  }
});

// PUT /api/usuarios/:id
router.put('/:id', authMiddleware, actualizarUsuarioValidation, async (req, res) => {
  try {
    // Verificar que el usuario que hace la petición sea admin
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado', message: 'Solo los administradores pueden actualizar usuarios' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Datos de entrada inválidos', details: errors.array() });

    const id = parseInt(req.params.id);
    const { nombre, correo, rol } = req.body;

    const found = await db.query('SELECT id FROM usuarios WHERE id = $1', [id]);
    if (found.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado', message: `No existe un usuario con ID ${id}` });

    const conflict = await db.query('SELECT id FROM usuarios WHERE correo = $1 AND id <> $2', [correo, id]);
    if (conflict.rows.length > 0) return res.status(409).json({ error: 'Correo ya en uso', message: 'Ya existe otro usuario con este correo electrónico' });

    const update = await db.query('UPDATE usuarios SET nombre=$1, correo=$2, rol=$3 WHERE id=$4 RETURNING id, nombre, correo, rol', [nombre, correo, rol, id]);
    res.json({ message: 'Usuario actualizado exitosamente', data: update.rows[0] });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor', message: 'Error al actualizar el usuario' });
  }
});

// DELETE /api/usuarios/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Verificar que el usuario que hace la petición sea admin
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado', message: 'Solo los administradores pueden eliminar usuarios' });
    }

    const id = parseInt(req.params.id);
    
    // Evitar que el admin se elimine a sí mismo
    if (req.usuario.id === id) {
      return res.status(400).json({ error: 'Operación no permitida', message: 'No puedes eliminar tu propia cuenta' });
    }

    const result = await db.query('DELETE FROM usuarios WHERE id = $1 RETURNING id, nombre, correo, rol', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado', message: `No existe un usuario con ID ${id}` });
    res.json({ message: 'Usuario eliminado exitosamente', data: result.rows[0] });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor', message: 'Error al eliminar el usuario' });
  }
});

module.exports = router;
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const router = express.Router();

// Validaciones
const loginValidation = [
  body('correo').isEmail().withMessage('Debe proporcionar un email válido').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

const registerValidation = [
  body('correo').isEmail().withMessage('Debe proporcionar un email válido').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('nombre').isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres').trim()
];

// POST /api/auth/login
router.post('/login', loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Datos de entrada inválidos', details: errors.array() });

    const { correo, password } = req.body;
    const result = await db.query('SELECT id, nombre, correo, password, rol FROM usuarios WHERE correo = $1', [correo]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Credenciales inválidas', message: 'Email o contraseña incorrectos' });

    const usuario = result.rows[0];
    if (!usuario.password) return res.status(401).json({ error: 'Credenciales inválidas', message: 'Email o contraseña incorrectos' });

    const valid = await bcrypt.compare(password, usuario.password);
    if (!valid) return res.status(401).json({ error: 'Credenciales inválidas', message: 'Email o contraseña incorrectos' });

    const token = jwt.sign({ id: usuario.id, correo: usuario.correo, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

    res.json({ message: 'Login exitoso', token, usuario: { id: usuario.id, correo: usuario.correo, nombre: usuario.nombre, rol: usuario.rol } });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor', message: 'Error durante el proceso de autenticación' });
  }
});

// POST /api/auth/register
router.post('/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Datos de entrada inválidos', details: errors.array() });
    const { correo, password, nombre } = req.body;
    const exists = await db.query('SELECT id FROM usuarios WHERE correo = $1', [correo]);
    if (exists.rows.length > 0) return res.status(409).json({ error: 'Usuario ya existe', message: 'Ya existe un usuario con este email' });

    const passwordHash = await bcrypt.hash(password, 10);
    const insert = await db.query('INSERT INTO usuarios (nombre, correo, password, rol) VALUES ($1,$2,$3,$4) RETURNING id, nombre, correo, rol', [nombre, correo, passwordHash, 'user']);

    const usuario = insert.rows[0];

    const token = jwt.sign({ id: usuario.id, correo: usuario.correo, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

    res.status(201).json({ message: 'Usuario registrado exitosamente', token, usuario: { id: usuario.id, correo: usuario.correo, nombre: usuario.nombre, rol: usuario.rol } });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor', message: 'Error durante el proceso de registro' });
  }
});

// GET /api/auth/verify
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token no proporcionado', message: 'Se requiere autenticación' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await db.query('SELECT id, nombre, correo, rol FROM usuarios WHERE id = $1', [decoded.id]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Usuario no encontrado', message: 'Token inválido' });

    const usuario = result.rows[0];
    res.json({ valid: true, usuario: { id: usuario.id, correo: usuario.correo, nombre: usuario.nombre, rol: usuario.rol } });
  } catch (error) {
    console.error('Error verificando token:', error);
    res.status(401).json({ error: 'Token inválido', message: 'El token proporcionado no es válido' });
  }
});

module.exports = router;
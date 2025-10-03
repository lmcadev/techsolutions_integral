const express = require('express');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const db = require('../db');
const router = express.Router();

// Validaciones
const servicioValidation = [
	body('nombre')
		.isLength({ min: 3 })
		.withMessage('El nombre debe tener al menos 3 caracteres')
		.trim(),
	body('descripcion')
		.isLength({ min: 10 })
		.withMessage('La descripción debe tener al menos 10 caracteres')
		.trim(),
	body('precio')
		.isFloat({ min: 0 })
		.withMessage('El precio debe ser un número mayor o igual a 0'),
	body('icono')
		.matches(/^bi-[\w-]+$/)
		.withMessage('El icono debe ser un ícono válido de Bootstrap (formato: bi-nombre)'),
	body('stock')
		.isBoolean()
		.withMessage('El campo stock debe ser verdadero o falso'),
	body('activo')
		.optional()
		.isBoolean()
		.withMessage('El campo activo debe ser verdadero o falso')
];

// GET /api/servicios - Sin autenticación para el slideshow público
router.get('/', async (req, res) => {
	try {
		const result = await db.query('SELECT id, nombre, descripcion, precio, stock, icono, activo FROM servicios WHERE activo = true ORDER BY id');
		res.json({ message: 'Servicios obtenidos exitosamente', data: result.rows, total: result.rows.length });
	} catch (error) {
		console.error('Error obteniendo servicios:', error);
		res.status(500).json({ error: 'Error interno del servidor', message: 'Error al obtener los servicios' });
	}
});

// GET /api/servicios/:id - Sin autenticación para ver detalles públicos
router.get('/:id', async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const result = await db.query('SELECT id, nombre, descripcion, precio, stock, icono, activo FROM servicios WHERE id = $1 AND activo = true', [id]);
		if (result.rows.length === 0) return res.status(404).json({ error: 'Servicio no encontrado', message: `No existe un servicio con ID ${id}` });
		res.json({ message: 'Servicio obtenido exitosamente', data: result.rows[0] });
	} catch (error) {
		console.error('Error obteniendo servicio:', error);
		res.status(500).json({ error: 'Error interno del servidor', message: 'Error al obtener el servicio' });
	}
});

// POST /api/servicios - Solo para administradores
router.post('/', authMiddleware, servicioValidation, async (req, res) => {
	try {
		// Verificar que el usuario que hace la petición sea admin
		if (req.usuario.rol !== 'admin') {
			return res.status(403).json({ error: 'Acceso denegado', message: 'Solo los administradores pueden crear servicios' });
		}

		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ error: 'Datos de entrada inválidos', details: errors.array() });

		const { nombre, descripcion, precio, icono, stock } = req.body;
		const exists = await db.query('SELECT id FROM servicios WHERE LOWER(nombre) = LOWER($1)', [nombre]);
		if (exists.rows.length > 0) return res.status(409).json({ error: 'Servicio ya existe', message: 'Ya existe un servicio con este nombre' });

		const insert = await db.query('INSERT INTO servicios (nombre, descripcion, precio, icono, stock) VALUES ($1,$2,$3,$4,$5) RETURNING id, nombre, descripcion, precio, icono, stock, activo', [nombre, descripcion, precio, icono, stock]);
		res.status(201).json({ message: 'Servicio creado exitosamente', data: insert.rows[0] });
	} catch (error) {
		console.error('Error creando servicio:', error);
		res.status(500).json({ error: 'Error interno del servidor', message: 'Error al crear el servicio' });
	}
});

// PUT /api/servicios/:id - Solo para administradores
router.put('/:id', authMiddleware, servicioValidation, async (req, res) => {
	try {
		// Verificar que el usuario que hace la petición sea admin
		if (req.usuario.rol !== 'admin') {
			return res.status(403).json({ error: 'Acceso denegado', message: 'Solo los administradores pueden actualizar servicios' });
		}

		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ error: 'Datos de entrada inválidos', details: errors.array() });

		const id = parseInt(req.params.id);
		const { nombre, descripcion, precio, icono, stock, activo } = req.body;

		const found = await db.query('SELECT id FROM servicios WHERE id = $1', [id]);
		if (found.rows.length === 0) return res.status(404).json({ error: 'Servicio no encontrado', message: `No existe un servicio con ID ${id}` });

		const conflict = await db.query('SELECT id FROM servicios WHERE LOWER(nombre) = LOWER($1) AND id <> $2', [nombre, id]);
		if (conflict.rows.length > 0) return res.status(409).json({ error: 'Nombre ya en uso', message: 'Ya existe otro servicio con este nombre' });

		const update = await db.query(
			'UPDATE servicios SET nombre=$1, descripcion=$2, precio=$3, icono=$4, stock=$5, activo=$6, fecha_actualizacion=CURRENT_TIMESTAMP WHERE id=$7 RETURNING id, nombre, descripcion, precio, icono, stock, activo', 
			[nombre, descripcion, precio, icono, stock, activo !== undefined ? activo : true, id]
		);
		res.json({ message: 'Servicio actualizado exitosamente', data: update.rows[0] });
	} catch (error) {
		console.error('Error actualizando servicio:', error);
		res.status(500).json({ error: 'Error interno del servidor', message: 'Error al actualizar el servicio' });
	}
});

// GET /api/servicios/admin - Solo para administradores (obtener todos incluyendo inactivos)
router.get('/admin/all', authMiddleware, async (req, res) => {
	try {
		// Verificar que el usuario que hace la petición sea admin
		if (req.usuario.rol !== 'admin') {
			return res.status(403).json({ error: 'Acceso denegado', message: 'Solo los administradores pueden ver todos los servicios' });
		}

		const result = await db.query('SELECT id, nombre, descripcion, precio, stock, icono, activo, fecha_creacion, fecha_actualizacion FROM servicios ORDER BY id');
		res.json({ message: 'Servicios obtenidos exitosamente', data: result.rows, total: result.rows.length });
	} catch (error) {
		console.error('Error obteniendo servicios:', error);
		res.status(500).json({ error: 'Error interno del servidor', message: 'Error al obtener los servicios' });
	}
});

// DELETE /api/servicios/:id - Solo para administradores
router.delete('/:id', authMiddleware, async (req, res) => {
	try {
		// Verificar que el usuario que hace la petición sea admin
		if (req.usuario.rol !== 'admin') {
			return res.status(403).json({ error: 'Acceso denegado', message: 'Solo los administradores pueden eliminar servicios' });
		}

		const id = parseInt(req.params.id);
		const result = await db.query('DELETE FROM servicios WHERE id = $1 RETURNING id, nombre, descripcion, precio, icono, stock, activo', [id]);
		if (result.rows.length === 0) return res.status(404).json({ error: 'Servicio no encontrado', message: `No existe un servicio con ID ${id}` });
		res.json({ message: 'Servicio eliminado exitosamente', data: result.rows[0] });
	} catch (error) {
		console.error('Error eliminando servicio:', error);
		res.status(500).json({ error: 'Error interno del servidor', message: 'Error al eliminar el servicio' });
	}
});

module.exports = router;
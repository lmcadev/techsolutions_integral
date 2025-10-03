const request = require('supertest');
const app = require('../server');

describe('Usuarios Endpoints', () => {
  let token;

  beforeAll(async () => {
    // Obtener token de autenticación
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@techsolutions.com',
        password: 'admin123'
      });
    token = loginRes.body.token;
  });

  describe('GET /api/usuarios', () => {
    it('should get all usuarios with valid token', async () => {
      const res = await request(app)
        .get('/api/usuarios')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('total');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should reject request without token', async () => {
      const res = await request(app)
        .get('/api/usuarios');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /api/usuarios', () => {
    it('should create new usuario with valid data', async () => {
      const nuevoUsuario = {
        nombre: 'Test Usuario',
        correo: 'test@example.com'
      };

      const res = await request(app)
        .post('/api/usuarios')
        .set('Authorization', `Bearer ${token}`)
        .send(nuevoUsuario);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data.nombre).toBe(nuevoUsuario.nombre);
      expect(res.body.data.correo).toBe(nuevoUsuario.correo);
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/usuarios')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nombre: 'A' // Muy corto
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/usuarios/:id', () => {
    it('should update existing usuario', async () => {
      const usuarioActualizado = {
        nombre: 'Usuario Actualizado',
        correo: 'actualizado@example.com'
      };

      const res = await request(app)
        .put('/api/usuarios/1')
        .set('Authorization', `Bearer ${token}`)
        .send(usuarioActualizado);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.nombre).toBe(usuarioActualizado.nombre);
    });

    it('should return 404 for non-existent usuario', async () => {
      const res = await request(app)
        .put('/api/usuarios/999')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nombre: 'Test',
          correo: 'test@example.com'
        });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/usuarios/:id', () => {
    it('should delete existing usuario', async () => {
      const res = await request(app)
        .delete('/api/usuarios/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('data');
    });

    it('should return 404 for non-existent usuario', async () => {
      const res = await request(app)
        .delete('/api/usuarios/999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });
  });
});
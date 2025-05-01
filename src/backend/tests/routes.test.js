import request from 'supertest';
import app from '../app.js'; // Certifique-se de apontar para seu app express
import { deleteTestUser } from './utils/testUtils.js';

let accessToken;
let refreshToken;
const testEmail = 'jose@example.com';
const testPassword = 'Test@1234';

describe('User Routes API', () => {
  beforeAll(async () => {
    await deleteTestUser(testEmail);
  });

  afterAll(async () => {
    await deleteTestUser(testEmail);
  });

  test('POST /api/users/create - Deve criar um novo usuário', async () => {
    const res = await request(app).post('/api/users/create').send({
      name: 'Test User',
      email: testEmail,
      password: testPassword,
      role: 'musician',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('email', testEmail);
  });

  test('POST /api/login - Deve autenticar e retornar tokens', async () => {
    const res = await request(app).post('/api/login').send({
      email: testEmail,
      password: testPassword,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  test('GET /api/user - Deve retornar dados do usuário com token válido', async () => {
    const res = await request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', testEmail);
  });

  test('GET /api/user - Deve falhar sem token (401)', async () => {
    const res = await request(app).get('/api/user');
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/refresh-token - Deve retornar novos tokens', async () => {
    const res = await request(app)
      .get('/api/refresh-token')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });

  test('GET /api/refresh-token - Deve falhar sem token (401)', async () => {
    const res = await request(app).get('/api/refresh-token');
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/logout - Deve desconectar com sucesso', async () => {
    const res = await request(app)
      .post('/api/logout')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(204); // Atualizado conforme o Swagger
  });

  test('POST /api/logout - Deve falhar sem token (401)', async () => {
    const res = await request(app).post('/api/logout');
    expect(res.statusCode).toBe(401);
  });
});

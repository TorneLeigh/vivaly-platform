// server/__tests__/auth.test.ts
import request from 'supertest';
import express from 'express';
import session from 'express-session';
import { registerRoutes } from '../routes';
import MemoryStore from 'memorystore';

describe('Auth & Registration Flows', () => {
  let app: express.Express;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    
    // Use memory store for testing
    const MemStore = MemoryStore(session);
    app.use(session({
      secret: 'test-secret',
      store: new MemStore(),
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }
    }));
    
    await registerRoutes(app);
  });

  it('should return 401 for unauthenticated user requests', async () => {
    const res = await request(app)
      .get('/api/auth/user');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Authentication required');
  });

  it('should validate registration input', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ email: 'test@example.com' }); // Missing required fields
    expect(res.status).toBe(400);
  });

  it('should register a new user successfully', async () => {
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test1@vivaly.com',
      phone: '0400000000',
      password: 'Password123!',
      isNanny: false,
      suburb: 'Sydney',
      postcode: '2000'
    };

    const res = await request(app)
      .post('/api/register')
      .send(userData);
    
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(userData.email);
    expect(res.body.firstName).toBe(userData.firstName);
  });

  it('should login with valid credentials', async () => {
    // First register a user
    const userData = {
      firstName: 'Login',
      lastName: 'Test',
      email: 'login@vivaly.com',
      phone: '0400000001',
      password: 'Password123!',
      isNanny: true,
      suburb: 'Melbourne',
      postcode: '3000'
    };

    await request(app)
      .post('/api/register')
      .send(userData);

    // Then login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: userData.email,
        password: userData.password
      });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.email).toBe(userData.email);
    expect(loginRes.body.roles).toContain('caregiver');
  });

  it('should reject login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@vivaly.com',
        password: 'wrongpassword'
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid email or password');
  });
});
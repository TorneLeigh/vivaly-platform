// server/__tests__/api.test.ts
import request from 'supertest';
import express from 'express';
import session from 'express-session';
import { registerRoutes } from '../routes';
import MemoryStore from 'memorystore';

describe('API Endpoints', () => {
  let app: express.Express;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    
    const MemStore = MemoryStore(session);
    app.use(session({
      secret: 'test-secret',
      store: new MemStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      }),
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }
    }));
    
    await registerRoutes(app);
  });

  describe('Nanny Endpoints', () => {
    it('should fetch featured nannies', async () => {
      const res = await request(app)
        .get('/api/nannies/featured');
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should search nannies with filters', async () => {
      const res = await request(app)
        .get('/api/nannies/search')
        .query({
          location: 'Sydney',
          serviceType: 'childcare'
        });
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('Job Endpoints', () => {
    it('should require authentication for job posting', async () => {
      const jobData = {
        title: 'Test Job',
        startDate: '2025-07-01',
        numChildren: 1,
        rate: '25',
        hoursPerWeek: '10',
        positionType: 'Part-time',
        availabilityNeeded: 'Weekdays',
        description: 'Test job description'
      };

      const res = await request(app)
        .post('/api/postJob')
        .send(jobData);
      
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Authentication required');
    });
  });
});
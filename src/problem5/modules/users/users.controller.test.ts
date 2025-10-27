import express from 'express';
import request from 'supertest';

// Mock the service layer used by the controller
jest.mock('./users.service', () => ({
  getAllUsers: jest.fn().mockResolvedValue([{ _id: { toString: () => 'id1' }, email: 'a@b.com' }]),
  createUser: jest.fn().mockResolvedValue({ _id: { toString: () => 'id2' }, email: 'c@d.com' }),
  getUser: jest.fn().mockResolvedValue({ _id: { toString: () => 'id3' }, email: 'e@f.com' }),
  updateUser: jest.fn().mockResolvedValue({ _id: { toString: () => 'id4' }, email: 'g@h.com' }),
  deleteUser: jest.fn().mockResolvedValue(undefined),
  restoreUser: jest.fn().mockResolvedValue({ _id: { toString: () => 'id5' }, email: 'i@j.com' }),
}));

import userRoutes from './users.controller';
import errorMiddleware from '../../middlewares/error.middleware';

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use('/users', userRoutes);
  app.use(errorMiddleware);
  return app;
}

describe('users.controller', () => {
  it('GET /users returns list with count', async () => {
    const app = makeApp();
    const res = await request(app).get('/users').query({ limit: '1' }).send({});
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0]).toEqual(expect.objectContaining({ email: 'a@b.com', id: 'id1' }));
  });

  it('POST /users validates and returns created', async () => {
    const app = makeApp();
    const res = await request(app)
      .post('/users')
      .send({ firstName: 'John', lastName: 'Doe', email: 'john@example.com' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(expect.objectContaining({ email: 'c@d.com', id: 'id2' }));
  });
});

const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User.model');

let mongoServer;
let adminToken;
let scholar;
let supervisor;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret';

  if (process.env.MONGO_URI_TEST) {
    await mongoose.connect(process.env.MONGO_URI_TEST);
  } else {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  }

  await mongoose.connection.dropDatabase();

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@test.rms',
    password: 'admin123',
    role: 'admin',
    dept: 'Administration',
    status: 'Active',
    joined: '2026-08-18'
  });

  scholar = await User.create({
    name: 'Scholar User',
    email: 'scholar@test.rms',
    password: 'scholar123',
    role: 'scholar',
    dept: 'Computer Science',
    status: 'Active',
    joined: '2026-08-18'
  });

  supervisor = await User.create({
    name: 'Supervisor User',
    email: 'supervisor@test.rms',
    password: 'super123',
    role: 'supervisor',
    dept: 'Computer Science',
    status: 'Active',
    joined: '2026-08-18'
  });

  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({ email: admin.email, password: 'admin123', role: 'admin' })
    .expect(200);

  adminToken = loginResponse.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

test('auth login returns a JWT and profile', async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@test.rms', password: 'admin123', role: 'admin' })
    .expect(200);

  expect(response.body.token).toBeTruthy();
  expect(response.body.user.role).toBe('admin');
});

test('admin can create a protected research project', async () => {
  const response = await request(app)
    .post('/api/research')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      scholar: scholar.name,
      topic: 'Reliable AI Review Management',
      supervisor: supervisor.name,
      dept: 'Computer Science',
      startDate: '2026-08-18',
      stage: 'Course Work',
      progress: 10,
      status: 'Active'
    })
    .expect(201);

  expect(response.body.topic).toBe('Reliable AI Review Management');
  expect(response.body.scholarId).toBe(String(scholar._id));
  expect(response.body.supervisorId).toBe(String(supervisor._id));
});

test('authorized users can list research projects', async () => {
  const response = await request(app)
    .get('/api/research')
    .set('Authorization', `Bearer ${adminToken}`)
    .expect(200);

  expect(Array.isArray(response.body)).toBe(true);
  expect(response.body.length).toBeGreaterThanOrEqual(1);
});

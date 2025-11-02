// tests/app.test.js
const request = require('supertest');
const app = require('../server');           // <-- your Express app
const { sequelize, User, Medication } = require('../models');

let token;
let adminUser;
let medId;

beforeAll(async () => {
  // Force-recreate test DB
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Auth', () => {
  it('POST /api/users/register → creates admin', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({ email: 'admin@test.com', password: 'admin123' });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    token = res.body.token;

    adminUser = await User.findOne({ where: { email: 'admin@test.com' } });
    expect(adminUser.role).toBe('admin');
  });

  it('POST /api/users/login → returns token', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'admin@test.com', password: 'admin123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });
});

describe('Medications', () => {
  it('POST /api/medications → creates (admin)', async () => {
    const res = await request(app)
      .post('/api/medications')
      .set('Authorization', `Bearer ${token}`)
      .send({
        medsName: 'Paracetamol',
        description: 'Fever reducer',
        dosage: '500mg',
        quantity: 200,
        available: 200,
        price: 2.5
      });

    expect(res.status).toBe(201);
    expect(res.body.medsName).toBe('Paracetamol');
    medId = res.body.id;
  });

  it('GET /api/medications → lists', async () => {
    const res = await request(app)
      .get('/api/medications')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('Sales', () => {
  it('POST /api/sales → records sale & deducts stock', async () => {
    const res = await request(app)
      .post('/api/sales')
      .set('Authorization', `Bearer ${token}`)
      .send({
        medicationId: medId,
        quantity: 50,
        salesDate: '2025-11-02'
      });

    expect(res.status).toBe(201);
    expect(res.body.sale.totalAmount).toBe(125); // 50 * 2.5

    const med = await Medication.findByPk(medId);
    expect(med.available).toBe(150);
  });
});
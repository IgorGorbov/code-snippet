const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.drop();
  await sequelize.close();
});

describe('GET /', () => {
  test('It should response with 200', () => {
    return request(app)
      .get('/')
      .expect(200);
  });
});

describe('POST /api/users/signup', () => {
  test('It should save cookies', () => {
    const testUser = { username: 'test', password: '1234' };

    return request(app)
      .post('/api/v1/users/signup')
      .send({ username: testUser.username, password: testUser.password })
      .expect(201)
      .then(response => {
        expect(response.headers['set-cookie']).toBeTruthy();
        expect(response.headers['set-cookie'][0]).toContain('jwt');
      });
  });

  test('It should return new user', () => {
    const testUser = { username: 'test', password: '1234' };

    return request(app)
      .post('/api/v1/users/signup')
      .send({ username: testUser.username, password: testUser.password })
      .expect(201)
      .then(response => {
        const { status, token, user } = response.body;

        expect(status).toBe('success');
        expect(token).toHaveLength(137);
        expect(user.id).not.toBeNaN();
        expect(user.username).toBe(testUser.username);
        expect(user.password).toBeUndefined();
        expect(user.isAdmin).toBeFalsy();
      });
  });

  test('It should response with 400', () => {
    const testUser = { username: 't', password: '1234' };

    return request(app)
      .post('/api/v1/users/signup')
      .send({ username: testUser.username, password: testUser.password })
      .expect(400);
  });
});

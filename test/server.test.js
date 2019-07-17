const request = require('supertest');
const fixtures = require('sequelize-fixtures');

const app = require('../app');
const { sequelize, models } = require('../models');

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
  const testUser = { username: 'test', password: '1234', confirmPassword: '1234' };

  test('It should save cookies', () => {
    return request(app)
      .post('/api/v1/users/signup')
      .send(testUser)
      .expect(201)
      .then(response => {
        expect(response.headers['set-cookie']).toBeTruthy();
        expect(response.headers['set-cookie'][0]).toContain('jwt');
      });
  });

  test('It should return new user', () => {
    return request(app)
      .post('/api/v1/users/signup')
      .send(testUser)
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
    const notValidUser = { username: 't', password: '1234', confirmPassword: '12' };
    return request(app)
      .post('/api/v1/users/signup')
      .send(notValidUser)
      .expect(400);
  });
});

describe('POST /api/users/login', () => {
  const testUser = { id: 1, username: 'test', password: '1234', isAdmin: false };
  const fixures = { model: 'User', data: { ...testUser } };

  beforeEach(async () => {
    await fixtures.loadFixture(fixures, models);
  });

  test('It should save cookies', async () => {
    return request(app)
      .post('/api/v1/users/login')
      .send({ username: testUser.username, password: testUser.password })
      .expect(200)
      .then(response => {
        expect(response.headers['set-cookie']).toBeTruthy();
        expect(response.headers['set-cookie'][0]).toContain('jwt');
      });
  });

  test('It should return user', async () => {
    return request(app)
      .post('/api/v1/users/login')
      .send({ username: testUser.username, password: testUser.password })
      .expect(200)
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
});

describe('POST /api/snippets', () => {
  const testSnippet = {
    userId: 1,
    title: 'Cont variable',
    code: 'const a = 5;',
    categories: [{ name: 'JavaScript' }]
  };
  const testUser = { id: 1, username: 'test', password: '1234', isAdmin: false };
  const fixures = { model: 'User', data: { ...testUser } };

  beforeEach(async () => {
    await fixtures.loadFixture(fixures, models);
  });

  test('It should return new snippet', async () => {
    return request(app)
      .post('/api/v1/snippets')
      .send(testSnippet)
      .expect(201)
      .then(response => {
        const { status, snippet } = response.body;

        expect(status).toBe('success');
        expect(snippet.id).not.toBeNaN();
        expect(snippet.userId).not.toBeNaN();
        expect(snippet.title).toBe(testSnippet.title);
        expect(snippet.code).toBe(testSnippet.code);
        expect(snippet.categories).not.toBeUndefined();
      });
  });
});

describe('POST /api/categories', () => {
  const testCategory = { name: 'React' };

  test('It should return new category', async () => {
    return request(app)
      .post('/api/v1/categories')
      .send(testCategory)
      .expect(201)
      .then(response => {
        const { status, category } = response.body;

        expect(status).toBe('success');
        expect(category.id).not.toBeNaN();
        expect(category.name).toBe(testCategory.name);
      });
  });
});

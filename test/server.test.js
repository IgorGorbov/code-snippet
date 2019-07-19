const path = require('path');
const request = require('supertest');
const sequelizeFixtures = require('sequelize-fixtures');

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
    await sequelizeFixtures.loadFixture(fixures, models);
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
        expect(user.id).toEqual(expect.any(Number));
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

  const fixures = {
    model: 'User',
    data: { id: 1, username: 'test', password: '1234', isAdmin: false }
  };

  beforeEach(async () => {
    await sequelizeFixtures.loadFixture(fixures, models);
  });

  test('It should return new snippet', async () => {
    return request(app)
      .post('/api/v1/snippets')
      .send(testSnippet)
      .expect(201)
      .then(response => {
        const { status, snippet } = response.body;

        expect(status).toBe('success');
        expect(snippet.id).toEqual(expect.any(Number));
        expect(snippet.userId).toEqual(expect.any(Number));
        expect(snippet.title).toBe(testSnippet.title);
        expect(snippet.code).toBe(testSnippet.code);
        expect(snippet.categories).toEqual(expect.any(Array));
      });
  });
});

describe('GET /api/snippets/:id', () => {
  beforeEach(async () => {
    const files = ['user.json', 'category.json', 'snippet.json'];
    await sequelizeFixtures.loadFiles(
      files.map(file => path.join(__dirname, 'fixtures', file)),
      models
    );
  });

  test('It should return snippet', async () => {
    return request(app)
      .get('/api/v1/snippets/1')
      .expect(200)
      .then(response => {
        const { status, snippet } = response.body;

        expect(status).toBe('success');
        expect(snippet.id).toEqual(expect.any(Number));
        expect(snippet.userId).toEqual(expect.any(Number));
        expect(snippet.title).toEqual(expect.any(String));
        expect(snippet.code).toEqual(expect.any(String));
        expect(snippet.categories).toEqual(expect.any(Array));
      });
  });
});

describe('PATCH /api/snippets/:id', () => {
  const testSnippet = {
    title: 'let variable',
    code: 'let a = 2;',
    categories: [{ name: 'React' }]
  };

  beforeEach(async () => {
    const files = ['user.json', 'category.json', 'snippet.json'];
    await sequelizeFixtures.loadFiles(
      files.map(file => path.join(__dirname, 'fixtures', file)),
      models
    );
  });

  test('It should return 200', async () => {
    return request(app)
      .patch('/api/v1/snippets/1')
      .send(testSnippet)
      .expect(200);
  });

  test('It should return 400', async () => {
    return request(app)
      .patch('/api/v1/snippets/100')
      .send(testSnippet)
      .expect(400);
  });
});

describe('DELETE /api/snippets/:id', () => {
  beforeEach(async () => {
    const files = ['user.json', 'category.json', 'snippet.json'];
    await sequelizeFixtures.loadFiles(
      files.map(file => path.join(__dirname, 'fixtures', file)),
      models
    );
  });

  test('It should return 200', async () => {
    return request(app)
      .delete('/api/v1/snippets/1')
      .expect(200);
  });

  test('It should return 400', async () => {
    return request(app)
      .delete('/api/v1/snippets/100')
      .expect(400);
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

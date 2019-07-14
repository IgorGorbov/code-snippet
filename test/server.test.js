const request = require('supertest');
const app = require('../app');

describe('GET /', () => {
  test('It should response with 200', () => {
    return request(app)
      .get('/')
      .expect(200);
  });
});

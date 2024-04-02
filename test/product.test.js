const connectToDB = require('../models/db');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');

describe('Product Routes', () => {
  //connect to database before running tests
  beforeAll(async () => {
    try {
      await connectToDB();
    } catch (err) {
      console.log(err);
    }
  }, 20000);

  //close database connection after tests have ran
  afterAll(async () => {
    try {
      await mongoose.connection.close();
    } catch (err) {
      console.log(err);
    }
  });

  describe('GET /products', () => {
    it('Returns an array of all products', () => {
      return request(app)
        .get('/api/v1/products')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.status).toBe('success');
          expect(Array.isArray(response.body.data.data)).toBe(true);
        }, 20000);
    });
  });
});

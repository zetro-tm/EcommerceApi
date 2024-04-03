const connectToDB = require('../models/db');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config({ path: './config.env' });
const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../app');

jest.setTimeout(180000);

describe('Product Routes', () => {
  //connect to database before running tests
  beforeAll(async () => {
    try {
      await connectToDB();
    } catch (err) {
      console.log(err);
    }
  }, 40000);

  //close database connection after tests have ran
  afterAll(async () => {
    try {
      await mongoose.connection.close();
    } catch (err) {
      console.log(err);
    }
  });

  //generate jwt
  const token = () => {
    return jwt.sign(
      { id: '6502f2762dc0263fe06a7f60' },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
  };

  describe('GET /products', () => {
    it('Returns an array of all products', () => {
      return request(app)
        .get('/api/v1/products')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.status).toBe('success');
          expect(typeof response.body.results).toBe('number');
          expect(Array.isArray(response.body.data.data)).toBe(true);
        });
    });
  });

  describe('GET /product/:id', () => {
    it('Returns invalid id error', () => {
      const id = '660d73985d18455970515b73'; // use valid id of an existing document
      return request(app)
        .get(`/api/v1/products/${id}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.status).toBe('success');
        });
    });
  });

  describe('PATCH /product/:id', () => {
    it('Updates a product', () => {
      const id = '660d73985d18455970515b73'; // use valid id of an existing document
      const req = {
        name: 'test4',
      };
      return request(app)
        .patch(`/api/v1/products/${id}`)
        .set('Authorization', `Bearer ${token()}`)
        .send(req)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.status).toBe('success');
        });
    });
  });

  // describe('DELETE /products/:id', () => {
  //   it('Returns 404 Not Found for a product that does not exist', () => {
  //     const id = '660d73985d18455970515b75';
  //     return request(app)
  //       .delete(`/api/v1/products/${id}`)
  //       .set('Authorization',`Bearer ${token()}`)
  //       .expect(404)
  //       .then((response) => {
  //         expect(response.body.status).toBe('fail');
  //         expect(response.body.message).toBe('No doc found with that ID');
  //       });
  //   });
  // });

  describe('POST /products/', () => {
    it('Creates a new product', () => {
      //Mock product
      const newProduct = {
        brand: 'Newer',
        name: 'testProd',
        description: 'High-performance smartphone with advanced features',
        price: 1000,
        color: 'Black',
      };
      return request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${token()}`)
        .send(newProduct)
        .expect(201)
        .then((response) => {
          expect(response.body.status).toBe('success');
          expect(response.body.data.data).toMatchObject(newProduct);
        });
    });
  });

  describe('GET /products/product-stats', () => {
    it('Returns an array of product stats', () => {
      return request(app)
        .get('/api/v1/products/product-stats')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.status).toBe('success');
          expect(Array.isArray(response.body.data)).toBe(true);
        });
    });
  });

  // describe('DELETE /product/:id', ()=>{
  //   it('Deletes a product with the id',()=>{
  //     return request(app).delete('api/v1/products/64e86f67c2610d3b2b0cb09a').expect('Content-Type', /json/).expect(204).then((response)=>{
  //       expect(response.body)
  //     })
  //   })
  // })

  // describe('GET /products/:id', () => {
  //   it('Returns error if the product id is not valid ', () => {
  //     return request(app)
  //       .get('/api/v1/products/9999')
  //       .expect('Content-Type', /json/)
  //       .expect(500)
  //       .then((response) => {
  //         expect(response.body.status).toBe('error');
  //       });
  //   }, 30000);
  // });
});

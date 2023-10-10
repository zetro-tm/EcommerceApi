let url;
if (process.env.NODE_ENV === 'development') {
  url = 'http://localhost:8001/'
}
if (process.env.NODE_ENV === 'production') {
  url = 'https://ecommerce-api-kgn2.onrender.com'
}
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ecommerce API',
      version: '1.0.0',
      description: 'Ecommerce API',
    },
    servers: [
      {
        url: url,
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          required: ['price', 'brand', 'name', 'description'],
          properties: {
            brand: {
              type: 'string',
              description: 'The brand ',
            },
            name: {
              type: 'string',
              description: 'name of the product',
            },
            description: {
              type: 'string',
              description: 'description of the product',
            },
            price: {
              type: 'number',
              description: 'price of the product',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Successful',
          contents: 'application/json',
        },
        400: {
          description: 'Bad Request',
          contents: 'application/json',
        },
        404: {
          description: 'Not found',
          contents: 'application/json',
        },
        201: {
          description: 'Created successfully ',
          contents: 'application/json',
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

module.exports = options;

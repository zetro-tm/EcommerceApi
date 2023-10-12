let url;
let description;
if (process.env.NODE_ENV === 'development') {
  url = 'http://localhost:8001/api/v1/'
  description = 'Development server'

}
if (process.env.NODE_ENV === 'production') {
  url = 'https://ecommerce-api-kgn2.onrender.com/api/v1/'
  description = 'Live server'
}
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ecommerce API',
      version: '1.0.0',
      description: 'This is an ecommerce API for cosmetic products',
    },
    servers: [
      {
        url: url,
        description: description,
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
            color: {
              type: 'string',
              description: 'color of the product'
            },
            category: {
              type: 'array'
            },
            product_type: {
              type: 'string'
            },
            tag_list: {
              type: 'array'
            },
            images: {
              type: 'array'
            },
            ratingsAverage: {
              type: 'number'
            },
            ratingsQuantity: {
              type: 'number'
            },
            priceDiscount: {
              type: 'number'
            }
          },
        },
      },
      responses: {
        200: {
          description: 'Successful',
          contents: 'application/json',
        },
        500: {
          description: 'Internal server error',
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
        204: {
          description: 'deleted successfully',
          contents:  'application/json',
        }
      },
    },
  },
  apis: [
    './routes/*.js'
  ],
};

module.exports = options;

## EcommerceAPI

This is an API built for shopping cosmetic products

# Features

- Signup
- Login
- Get top 5 cheap products
- Product stats
- Filter thorugh products using parameters
- Update Currently logged in user's information
- Forgot Password functionality
- Reset Password functionality
- Create reviews on products
- Cart functionality
- and many more...

## Built with

- Nodejs(version 18.18.0)
- Expressjs
- Mongodb
- Mongoose

## Getting Started

### Prerequisites

The tools listed below are needed to run this application:

- Node
- Npm

You can check the Node.js and npm versions by running the following commands.

### Check node.js version

`node -v`

### Check npm version

`npm -v`

## Installation

To run this API on your local machine:

- Install project dependencies by running `npm install`.

- Start the server with `npm start:dev` to run in developement environment and `npm start:prod` for production environment

## Import data to database

To import data from `data/products2.json` to the databse, run `npm run import`

## Delete all data in database

To delete all data from the databse, run `npm run delete`

## Run the tests

```shell
npm run test
```

All tests are written in the `test` directory.

## Configuration

Create a config.env file in the root directory and add the following env variables:

```bash

 NODE_ENV=
PORT=
DATABASE=
DATABASE_PASSWORD=

JWT_SECRET=
JWT_EXPIRES_IN=
JWT_COOKIE_EXPIRES_IN=

EMAIL_USERNAME=
EMAIL_PASSWORD=
EMAIL_HOST=
EMAIL_PORT=

```

NODE_ENV,PORT,DATABASE and DATABASE_PASSWORD are compulsory for the server to run

## Base URL

The base URL is http://127.0.0.1:{PORT}/

## Deployed link

- https://ecommerce-api-kgn2.onrender.com

## Documentation

View Postman documentation here: https://documenter.getpostman.com/view/24160587/2s9YJhxzfa

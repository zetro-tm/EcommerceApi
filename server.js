const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectToDB = require('./models/db');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!💥 Shutting Down....');
  console.log(err.name, err.message);
  process.exit(1);
});

//For reading config.env

dotenv.config({ path: './config.env' });
const app = require('./app');

//Connect to database
connectToDB().then(() => console.log('DB connection successful!🎉🎉'));

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//Unhandled errors controller
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    //shuts down gracefully
    process.exit(1); //Shutdown application. 1 stands for uncaught exception
  });
});

//npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react --save-dev

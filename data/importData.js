const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/productModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('DB coonection succesfull!🎉🎉'));

//READ JSON FILE
const products = JSON.parse(fs.readFileSync('data/products2.json', 'utf-8'));

//IMPORT DATA
const importData = async () => {
  try {
    await Product.create(products); //.create() can accept an array of objects
    console.log('Data successfully imported');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//DELETE ALL DATA
const deleteData = async () => {
  try {
    await Product.deleteMany(); // when nothing is passed into it, it will delete all data
    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  //process.argv is an array of command line arguments passed
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

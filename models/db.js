const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '../config.env' });

const connectToDB = async () => {
  try {
    const DB = process.env.DATABASE.replace(
      '<password>',
      process.env.DATABASE_PASSWORD
    );

    const connection = await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return connection;
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectToDB;

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Please enter your name'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Please enter your email'],
      lowercase: true,
      validate: [validator.isEmail, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please enter your password'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!',
      },
      select: false,
    },
    passwordChangedAt: Date,

    role: {
      type: String,
      enum: ['user', 'admin', 'store-owner'],
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  //Only run if password was modified
  if (!this.isModified('password')) return next();

  //hash password with cost 12
  this.password = await bcrypt.hash(this.password, 12); // the higher the cost, the more cpu intensive the hashing will be

  //Delete passwordConfirm field
  this.passwordConfirm = undefined; //this makes sure that the password is not persisted to the database
});

UserSchema.methods.correctPassword = async function (
  //instance method is a method that is availabe to all the documents in a collection
  candidatePassword, //not hashed
  userPassword //hashed
) {
  return await bcrypt.compare(candidatePassword, userPassword); //compares the two passwords and returns true/false
};

UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    ); // convert passwordChangedAt to milliseconds
    return JWTTimestamp < changedTimestamp; // true if the password was changed after the token was issued
  }

  //false menas not changed
  return false;
};

module.exports = mongoose.model('User', UserSchema);

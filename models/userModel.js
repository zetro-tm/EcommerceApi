const { Schema } = require("mongoose");
const validator = require("validator");

mongoose = require("mongoose");
Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please enter your email"],
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
      select: false,
    },
    passwordChangedAt: Date,

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

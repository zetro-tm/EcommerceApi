const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    image: {
      type: String,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
      maxlength: [
        40,
        "Description must have less than or equal to 40 characters",
      ],
    },
    categories: {
      type: Array,
    },
    // size:{
    //     type:String
    // }
    price: {
      type: Number,
      required: true,
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "Discount price should be below actual price",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);

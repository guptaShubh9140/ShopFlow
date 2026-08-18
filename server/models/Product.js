const mongoose = require("mongoose");


const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: 2,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: 5,
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },

    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    stock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Stock must be a whole number",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Product",
  productSchema
);

module.exports = mongoose.model("Product", productSchema);
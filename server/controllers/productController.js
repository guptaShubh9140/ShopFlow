const Product = require("../models/Product");

// ===============================
// Get all products
// ===============================
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// Get single product
// ===============================
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// ===============================
// Create product
// ===============================
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      stock,
    } = req.body;

    // Required fields
    if (
      !name ||
      !description ||
      price === undefined ||
      !category
    ) {
      return res.status(400).json({
        message:
          "Name, description, price and category are required",
      });
    }

    // Validate name
    if (
      typeof name !== "string" ||
      name.trim().length < 2
    ) {
      return res.status(400).json({
        message:
          "Product name must be at least 2 characters",
      });
    }

    // Validate description
    if (
      typeof description !== "string" ||
      description.trim().length < 5
    ) {
      return res.status(400).json({
        message:
          "Description must be at least 5 characters",
      });
    }

    // Validate category
    if (
      typeof category !== "string" ||
      category.trim().length < 2
    ) {
      return res.status(400).json({
        message:
          "Category must be at least 2 characters",
      });
    }

    // Validate price
    if (
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return res.status(400).json({
        message:
          "Price must be a valid number greater than or equal to 0",
      });
    }

    // Validate stock
    if (
      stock !== undefined &&
      (
        typeof stock !== "number" ||
        !Number.isInteger(stock) ||
        stock < 0
      )
    ) {
      return res.status(400).json({
        message:
          "Stock must be a non-negative whole number",
      });
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price,
      category: category.trim(),
      image: image || "",
      stock: stock ?? 0,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// Update product
// ===============================
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const {
      name,
      description,
      price,
      category,
      image,
      stock,
    } = req.body;

    // Validate name
    if (
      name !== undefined &&
      (
        typeof name !== "string" ||
        name.trim().length < 2
      )
    ) {
      return res.status(400).json({
        message:
          "Product name must be at least 2 characters",
      });
    }

    // Validate description
    if (
      description !== undefined &&
      (
        typeof description !== "string" ||
        description.trim().length < 5
      )
    ) {
      return res.status(400).json({
        message:
          "Description must be at least 5 characters",
      });
    }

    // Validate category
    if (
      category !== undefined &&
      (
        typeof category !== "string" ||
        category.trim().length < 2
      )
    ) {
      return res.status(400).json({
        message:
          "Category must be at least 2 characters",
      });
    }

    // Validate price
    if (
      price !== undefined &&
      (
        typeof price !== "number" ||
        !Number.isFinite(price) ||
        price < 0
      )
    ) {
      return res.status(400).json({
        message:
          "Price must be a valid number greater than or equal to 0",
      });
    }

    // Validate stock
    if (
      stock !== undefined &&
      (
        typeof stock !== "number" ||
        !Number.isInteger(stock) ||
        stock < 0
      )
    ) {
      return res.status(400).json({
        message:
          "Stock must be a non-negative whole number",
      });
    }

    // Update fields
    if (name !== undefined) {
      product.name = name.trim();
    }

    if (description !== undefined) {
      product.description =
        description.trim();
    }

    if (price !== undefined) {
      product.price = price;
    }

    if (category !== undefined) {
      product.category = category.trim();
    }

    if (image !== undefined) {
      product.image = image;
    }

    if (stock !== undefined) {
      product.stock = stock;
    }

    const updatedProduct =
      await product.save();

    res.status(200).json({
      message:
        "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// Delete product
// ===============================
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      message:
        "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
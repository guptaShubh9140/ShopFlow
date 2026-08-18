const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");

// Create order
const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
    } = req.body;

    // Validate cart
    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    // Validate duplicate products
    const productIds = items.map(
      (item) => item.product
    );

    const uniqueProductIds = new Set(
      productIds
    );

    if (
      uniqueProductIds.size !==
      productIds.length
    ) {
      return res.status(400).json({
        message:
          "Duplicate products are not allowed in an order",
      });
    }

    // Validate shipping address
    if (
      !shippingAddress ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({
        message:
          "Complete shipping address is required",
      });
    }

    const orderItems = [];
    let totalAmount = 0;

    // Verify products
    for (const item of items) {
      // Validate MongoDB ID
      if (
        !mongoose.Types.ObjectId.isValid(
          item.product
        )
      ) {
        return res.status(400).json({
          message:
            `Invalid product ID: ${item.product}`,
        });
      }

      // Validate quantity
      if (
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        return res.status(400).json({
          message:
            "Quantity must be a positive integer",
        });
      }

      // Get REAL product from database
      const product =
        await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          message:
            `Product not found: ${item.product}`,
        });
      }

      // Check REAL stock
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message:
            `${product.name} has insufficient stock`,
        });
      }

      // Use REAL database price
      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        image: product.image,
      });

      // Calculate REAL total
      totalAmount +=
        product.price * item.quantity;
    }

    // Create order using server-calculated data
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
    });

    // Reduce stock
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock: -item.quantity,
          },
        }
      );
    }

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Get logged-in user's orders
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders - Admin
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// Update order status - Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = status;

    const updatedOrder = await order.save();

    res.status(200).json({
      message: "Order status updated",
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};
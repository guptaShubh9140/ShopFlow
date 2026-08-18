const express = require("express");

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// Customer Routes
// ========================================

// Create a new order
router.post("/", protect, createOrder);

// Get logged-in customer's orders
router.get("/my", protect, getMyOrders);


// ========================================
// Admin Routes
// ========================================

// Get all orders
router.get(
  "/",
  protect,
  adminOnly,
  getAllOrders
);

// Update order status
router.put(
  "/:id/status",
  protect,
  adminOnly,
  updateOrderStatus
);

module.exports = router;
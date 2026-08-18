const Order = require("../models/Order");
const Product = require("../models/Product");

// ======================================
// Get Admin Dashboard Analytics
// ======================================
const getDashboardAnalytics = async (
  req,
  res,
  next
) => {
  try {
    // Get all orders
    const orders = await Order.find();

    // Get all products
    const products = await Product.find();

    // ======================================
    // Calculate Total Revenue
    // ======================================

    const totalRevenue = orders.reduce(
      (total, order) => {
        // Do not count cancelled orders
        if (order.status === "Cancelled") {
          return total;
        }

        return (
          total + (order.totalAmount || 0)
        );
      },
      0
    );

    // ======================================
    // Orders By Status
    // ======================================

    const ordersByStatus = {
      Pending: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };

    orders.forEach((order) => {
      if (
        ordersByStatus[order.status] !==
        undefined
      ) {
        ordersByStatus[order.status]++;
      }
    });

    // ======================================
    // Low Stock Products
    // ======================================

    const lowStockProducts = products
      .filter((product) => product.stock <= 5)
      .sort(
        (a, b) => a.stock - b.stock
      );

    // ======================================
    // Total Items Sold
    // ======================================

    const totalItemsSold = orders.reduce(
      (total, order) => {
        // Do not count cancelled orders
        if (order.status === "Cancelled") {
          return total;
        }

        const orderItems = order.items.reduce(
          (itemTotal, item) => {
            return (
              itemTotal +
              (item.quantity || 0)
            );
          },
          0
        );

        return total + orderItems;
      },
      0
    );

    // ======================================
    // Send Analytics Response
    // ======================================

    res.status(200).json({
      totalRevenue,
      totalOrders: orders.length,
      totalProducts: products.length,
      totalItemsSold,

      ordersByStatus,

      lowStockProducts,
    });
  } catch (error) {
    // Send unexpected errors
    // to centralized error middleware
    next(error);
  }
};

// ======================================
// Export Controller
// ======================================

module.exports = {
  getDashboardAnalytics,
};
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Error middleware
const errorHandler = require("./middleware/errorMiddleware");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// ===============================
// Database
// ===============================

connectDB();

// ===============================
// Security
// ===============================

app.use(helmet());

// ===============================
// CORS
// ===============================

const allowedOrigins = [
  "http://localhost:5173",
  "https://shop-flow-pi-six.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests such as Postman/curl/server-to-server
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ===============================
// Body Parser
// ===============================

app.use(
  express.json({
    limit: "10kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  })
);

// ===============================
// Health Check
// ===============================

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ShopFlow backend is working",
  });
});

// ===============================
// Home Route
// ===============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ShopFlow API is running",
  });
});

// ===============================
// API Routes
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/admin", adminRoutes);

// ===============================
// 404 Handler
// ===============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ===============================
// Global Error Handler
// IMPORTANT: Keep this LAST
// ===============================

app.use(errorHandler);

// ===============================
// Start Server
// ===============================

const PORT = process.env.PORT || 5000;

console.log("Environment:", process.env.NODE_ENV);
console.log("Port:", PORT);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`ShopFlow server running on port ${PORT}`);
});
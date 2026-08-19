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

// ===============================
// Create Express App
// ===============================

const app = express();

// ===============================
// Connect MongoDB
// ===============================

connectDB();

// ===============================
// Security Middleware
// ===============================

app.use(helmet());

// ===============================
// CORS
// ===============================

const allowedOrigins = [
  "http://localhost:5173",
  "https://shop-flow-a5aw.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests such as curl/Postman/server-to-server
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("CORS blocked origin:", origin);

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
// Request Logger
// ===============================

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// ===============================
// Health Check
// ===============================

app.get("/health", (req, res) => {
  console.log("HEALTH ENDPOINT HIT");

  res.status(200).json({
    success: true,
    message: "ShopFlow backend is working",
  });
});

// ===============================
// Home Route
// ===============================

app.get("/", (req, res) => {
  console.log("HOME ENDPOINT HIT");

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
// IMPORTANT: Keep this AFTER
// all valid routes
// ===============================

app.use((req, res) => {
  console.log(
    `404 - Route not found: ${req.method} ${req.originalUrl}`
  );

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

console.log("-----------------------------------");
console.log("Starting ShopFlow backend...");
console.log("Environment:", process.env.NODE_ENV || "development");
console.log("PORT:", PORT);
console.log("-----------------------------------");

app.listen(PORT, "0.0.0.0", () => {
  console.log(`ShopFlow server running on port ${PORT}`);
});
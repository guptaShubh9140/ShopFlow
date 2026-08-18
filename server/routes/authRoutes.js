const express = require("express");

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const {
  loginLimiter,
} = require("../middleware/rateLimiter");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);

router.post(
  "/login",
  loginLimiter,
  loginUser
);

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

module.exports = router;
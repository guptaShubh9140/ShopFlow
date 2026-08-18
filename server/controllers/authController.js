const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ===============================
// Generate JWT
// ===============================
const generateToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// ===============================
// Register User
// ===============================
const registerUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    // Required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message:
          "Name, email and password are required",
      });
    }

    // Validate name
    if (
      typeof name !== "string" ||
      name.trim().length < 2
    ) {
      return res.status(400).json({
        message:
          "Name must be at least 2 characters",
      });
    }

    // Validate email
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      typeof email !== "string" ||
      !emailRegex.test(email.trim())
    ) {
      return res.status(400).json({
        message:
          "Please enter a valid email address",
      });
    }

    // Validate password length
    if (
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters",
      });
    }

    // Strong password validation
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!strongPassword.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain uppercase, lowercase and a number",
      });
    }

    // Check existing user
    const existingUser =
      await User.findOne({
        email: email.toLowerCase().trim(),
      });

    if (existingUser) {
      return res.status(409).json({
        message:
          "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: "Registration successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    next(error);
  }
};

// ===============================
// Login User
// ===============================
const loginUser = async (req, res, next) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // Required fields
    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    // Don't reveal whether email exists
    if (!user) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    // Generate JWT
    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
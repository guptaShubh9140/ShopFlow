const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("./models/User");

dotenv.config();

const resetAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const newPassword = "Admin@123";

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    const user = await User.findOneAndUpdate(
      {
        email: "shopflowtest@example.com",
      },
      {
        password: hashedPassword,
        role: "admin",
      },
      {
        new: true,
      }
    );

    if (!user) {
      console.log("Admin user not found");
      process.exit(1);
    }

    console.log("Admin password reset successfully!");
    console.log("Email: shopflowtest@example.com");
    console.log("Password: Admin@123");

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

resetAdminPassword();
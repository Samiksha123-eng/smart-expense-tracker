const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  updateBudget,
  forgotPassword,
} = require("../controllers/authController");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Forgot Password
router.put("/forgot-password", forgotPassword);

// Get Logged-in User Profile
router.get("/profile", protect, getProfile);

// Update User Profile
router.put("/profile", protect, updateProfile);

// Update Monthly Budget
router.put("/budget", protect, updateBudget);

module.exports = router;
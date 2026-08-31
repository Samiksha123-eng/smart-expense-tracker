const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  getProfile,
  updateBudget,
  forgotPassword,
} = require("../controllers/authController");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

router.put("/forgot-password", forgotPassword);

// Get Logged-in User Profile
router.get("/profile", protect, getProfile);

router.put("/profile", authMiddleware, updateProfile);


// Update Monthly Budget
router.put("/budget", protect, updateBudget);


module.exports = router;
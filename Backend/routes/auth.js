const express = require("express");
const { registerUser, loginUser, getUserProfile } = require("../controllers/authController");
const auth = require("../middlewares/auth");
const router = express.Router();

// Register a new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Get logged-in user's profile
router.get("/profile", auth, getUserProfile);

module.exports = router;

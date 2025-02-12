const express = require("express");
const {
  placeOrder,
  getUserOrders,
  updateDeliveryStatus,
  getAllOrders, // Added this function for admin to fetch all orders
} = require("../controllers/orderController");
const auth = require("../middlewares/auth");

const router = express.Router();

// Place an order (Cash on Delivery)
router.post("/", auth, placeOrder);

// Get all orders for the logged-in user
router.get("/", auth, getUserOrders);

// Get all orders (Admin only)
router.get("/all", auth, getAllOrders); // New route for admin to fetch all orders


// Admin: Update order delivery status
router.put("/:id/status", auth, updateDeliveryStatus);
module.exports = router;

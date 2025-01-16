const express = require("express");
const {
  placeOrder,
  getUserOrders,
  markOrderAsPaid,
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

// Mark an order as paid (Admin updates payment status)
//router.put("/:id/markAsPaid", auth, markOrderAsPaid);

// Update delivery status (Admin only)
router.put("/:id/status", auth, updateDeliveryStatus);

module.exports = router;

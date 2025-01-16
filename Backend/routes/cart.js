const express = require("express");
const {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");
const auth = require("../middlewares/auth");
const router = express.Router();

// Add an item to the cart
router.post("/", auth, addToCart);

// Get the user's cart
router.get("/", auth, getCart);

// Remove an item from the cart
router.delete("/:productId", auth, removeFromCart);

// Clear the cart
router.delete("/", auth, clearCart);

module.exports = router;

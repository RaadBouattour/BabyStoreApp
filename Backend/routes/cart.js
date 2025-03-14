const express = require("express");
const {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");
const auth = require("../middlewares/auth");
const router = express.Router();


router.post("/", auth, addToCart);
router.get("/", auth, getCart);
router.delete("/:productId", auth, removeFromCart);
router.delete("/", auth, clearCart);

module.exports = router;

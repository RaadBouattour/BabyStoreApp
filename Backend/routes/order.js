const express = require("express");
const {
  placeOrder,
  getUserOrders,
  updateDeliveryStatus,
  getAllOrders, 
} = require("../controllers/orderController");
const auth = require("../middlewares/auth");

const router = express.Router();


router.post("/", auth, placeOrder);
router.get("/", auth, getUserOrders);
router.get("/all", auth, getAllOrders); 
router.put("/:id/status", auth, updateDeliveryStatus);

module.exports = router;

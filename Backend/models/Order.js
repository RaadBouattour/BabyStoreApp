const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  orderTotal: { type: Number, required: true },
  isPaid: { type: Boolean, default: false }, // Payment on delivery
  orderDate: { type: Date, default: Date.now },
  deliveryStatus: { type: String, default: "Pending" }, // "Pending", "Delivered", etc.
});

module.exports = mongoose.model("Order", OrderSchema);

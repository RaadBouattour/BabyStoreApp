const Order = require("../models/Order");
const Cart = require("../models/Cart");

// Place an order (Cash on Delivery)
exports.placeOrder = async (req, res) => {
  try {
    // Get the user's cart
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    // Calculate the total price
    const orderTotal = cart.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    // Create a new order
    const order = new Order({
      userId: req.user.id,
      items: cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      orderTotal,
      isPaid: false, // Payment on delivery
      deliveryStatus: "Pending", // Default delivery status
    });

    await order.save();

    // Clear the cart
    await Cart.deleteOne({ userId: req.user.id });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get all orders for the logged-in user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate("items.productId", "name price");
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Update delivery status and mark as paid (Admin only)
exports.updateDeliveryStatus = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const { id } = req.params;
    const { status } = req.body;

    // Find the order by ID
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the delivery status
    order.deliveryStatus = status;

    // If the status is "Delivered", set isPaid to true
    if (status === "Delivered") {
      order.isPaid = true;
    }

    await order.save();

    res.status(200).json({ message: "Delivery status updated", order });
  } catch (err) {
    console.error("Error updating delivery status:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all orders (Admin only)
exports.getAllOrders = async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: "Access denied" });

  try {
    const orders = await Order.find().populate("items.productId", "name price");
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

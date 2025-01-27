const Order = require("../models/Order");
const Cart = require("../models/Cart");

// Place an order (Cash on Delivery)
exports.placeOrder = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, address } = req.body;

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

    // Create a new order with customer details and cart items
    const order = new Order({
      userId: req.user.id,
      fullName,
      email,
      phoneNumber,
      address,
      items: cart.items.map((item) => ({
        productId: item.productId,
        productName: item.productName, // Include product name for better admin view
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
    console.error("Error placing order:", err);
    res.status(500).json({ error: err.message });
  }
};




// Update delivery status and mark as paid (Admin only)
const Notification = require("../models/Notification");

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

    // Send a notification to the user
    const notification = new Notification({
      userId: order.userId,
      title: "Order Status Update",
      message: `Your order has been updated to "${status}".`,
    });
    await notification.save();

    res.status(200).json({ message: "Delivery status updated", order });
  } catch (err) {
    console.error("Error updating delivery status:", err.message);
    res.status(500).json({ error: err.message });
  }
};


// Fetch all orders (Admin only)
exports.getAllOrders = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    // Fetch all orders and populate user details and product details
    const orders = await Order.find()
      .populate("userId", "firstName lastName email phoneNumber address") // Include user's full details
      .populate("items.productId", "name price"); // Include product's name and price

    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Fetch orders for the logged-in user
exports.getUserOrders = async (req, res) => {
  try {
    // Fetch orders for the logged-in user
    const orders = await Order.find({ userId: req.user.id })
      .populate("items.productId", "name price") // Include product's name and price
      .populate("userId", "firstName lastName email phoneNumber address"); // Include user details

    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err.message);
    res.status(500).json({ error: err.message });
  }
};



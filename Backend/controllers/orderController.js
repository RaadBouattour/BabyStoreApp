const Order = require("../models/Order");
const Cart = require("../models/Cart");


exports.placeOrder = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, address } = req.body;

    
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    
    const orderTotal = cart.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    
    const order = new Order({
      userId: req.user.id,
      fullName,
      email,
      phoneNumber,
      address,
      items: cart.items.map((item) => ({
        productId: item.productId,
        productName: item.productName, 
        quantity: item.quantity,
        price: item.price,
      })),
      orderTotal,
      isPaid: false, 
      deliveryStatus: "Pending", 
    });

    await order.save();

    
    await Cart.deleteOne({ userId: req.user.id });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ error: err.message });
  }
};





const Notification = require("../models/Notification");

exports.updateDeliveryStatus = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const { id } = req.params;
    const { status } = req.body;

    
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    
    order.deliveryStatus = status;

    
    if (status === "Delivered") {
      order.isPaid = true;
    }

    await order.save();

    
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



exports.getAllOrders = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    // Fetch orders with the correct data
    const orders = await Order.find()
      .populate("items.productId", "name price") // Populate product details
      .select("-__v"); // Exclude unwanted fields

    // Return orders with order-specific information
    res.status(200).json(
      orders.map((order) => ({
        _id: order._id,
        fullName: order.fullName, // ✅ Use order-specific name
        email: order.email, // ✅ Use order-specific email
        phoneNumber: order.phoneNumber, // ✅ Use order-specific phone
        address: order.address, // ✅ Use order-specific address
        orderTotal: order.orderTotal,
        items: order.items,
        deliveryStatus: order.deliveryStatus,
        isPaid: order.isPaid,
        createdAt: order.createdAt,
      }))
    );
  } catch (err) {
    console.error("Error fetching orders:", err.message);
    res.status(500).json({ error: err.message });
  }
};



exports.getUserOrders = async (req, res) => {
  try {
    
    const orders = await Order.find({ userId: req.user.id })
      .populate("items.productId", "name price") 
      .populate("userId", "firstName lastName email phoneNumber address"); 

    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err.message);
    res.status(500).json({ error: err.message });
  }
};



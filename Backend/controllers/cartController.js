const Cart = require("../models/Cart");
const Product = require("../models/Product");


exports.addToCart = async (req, res) => {
    try {
      
    console.log("DEBUG: Headers received:", req.headers);
    console.log("DEBUG: Body received:", req.body);
      const { productId, quantity, price } = req.body;
  
      
      console.log("Request Body:", req.body);
  
      let cart = await Cart.findOne({ userId: req.user.id });
  
      if (!cart) {
        cart = new Cart({
          userId: req.user.id,
          items: [],
        });
      }
  
      
      const productIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
  
      if (productIndex > -1) {
        
        cart.items[productIndex].quantity += quantity;
      } else {
        
        cart.items.push({ productId, quantity, price }); 
      }
  
      
      console.log("Cart Before Save:", cart);
  
      await cart.save();
  
      
      console.log("Cart After Save:", cart);

      
  
      res.status(200).json({ message: "Product added to cart", cart });
    } catch (err) {
      console.error("Error Adding to Cart:", err);
      res.status(500).json({ error: err.message });
    }
  };
  
  


exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId", "name price");
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    
    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    await cart.save();

    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared", cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

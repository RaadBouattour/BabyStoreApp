const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new product (Admin only)
exports.addProduct = async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Access denied" });
  
    try {
      const { name, description, price, stock, category } = req.body;
  
      // Check if a product with the same name already exists
      const existingProduct = await Product.findOne({ name });
      if (existingProduct) {
        return res.status(400).json({ message: "A product with this name already exists" });
      }
  
      // Check if an image file is uploaded
      if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
      }
  
      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
  
      const product = new Product({
        name,
        description,
        price,
        stock,
        category,
        image: result.secure_url, // Save Cloudinary image URL
      });
  
      await product.save();
      res.status(201).json({ message: "Product added successfully", product });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  


// Update a product (Admin only)
exports.updateProduct = async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Access denied" });
  
    try {
      const { id } = req.params;
      const { name, description, price, stock, category } = req.body;
  
      let updateFields = { name, description, price, stock, category };
  
      // If a new image is uploaded, update the image field
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        updateFields.image = result.secure_url; // Save Cloudinary image URL
      }
  
      const product = await Product.findByIdAndUpdate(id, updateFields, { new: true });
      if (!product) return res.status(404).json({ message: "Product not found" });
  
      res.json({ message: "Product updated successfully", product });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  
  

// Delete a product (Admin only)
exports.deleteProduct = async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Access denied" });
  
    try {
      const { id } = req.params;
  
      const product = await Product.findByIdAndDelete(id);
      if (!product) return res.status(404).json({ message: "Product not found" });
  
      res.json({ message: "Product deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  
// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    // Find products where the category matches the query
    const products = await Product.find({ category: category });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found in this category" });
    }

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ message: "Category is required." });
    }

    console.log("DEBUG: Category received:", category);

    // Use a case-insensitive regex to match the category
    const products = await Product.find({ category: { $regex: new RegExp(`^${category}$`, "i") } });

    if (products.length === 0) {
      return res.status(404).json({ message: `No products found for category: ${category}` });
    }

    res.json(products);
  } catch (err) {
    console.error("ERROR: Fetching products by category failed:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");


exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.addProduct = async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Access denied" });
  
    try {
      const { name, description, price, stock, category } = req.body;
  
      
      const existingProduct = await Product.findOne({ name });
      if (existingProduct) {
        return res.status(400).json({ message: "A product with this name already exists" });
      }
  
      
      if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
      }
  
      
      const result = await cloudinary.uploader.upload(req.file.path);
  
      const product = new Product({
        name,
        description,
        price,
        stock,
        category,
        image: result.secure_url, 
      });
  
      await product.save();
      res.status(201).json({ message: "Product added successfully", product });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  

  exports.getAllCategories = async (req, res) => {
    try {
      // Fetch unique category names
      const categories = await Product.distinct("category");
  
      if (!categories.length) {
        return res.status(404).json({ message: "No categories found" });
      }
  
      res.json(categories);
    } catch (err) {
      console.error("ERROR: Fetching categories failed:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

exports.updateProduct = async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Access denied" });
  
    try {
      const { id } = req.params;
      const { name, description, price, stock, category } = req.body;
  
      let updateFields = { name, description, price, stock, category };
  
      
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        updateFields.image = result.secure_url; 
      }
  
      const product = await Product.findByIdAndUpdate(id, updateFields, { new: true });
      if (!product) return res.status(404).json({ message: "Product not found" });
  
      res.json({ message: "Product updated successfully", product });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  
  


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
  

exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    
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

exports.getAllCategoriesWithProducts = async (req, res) => {
  try {
    const categories = await Product.distinct("category");

    if (!categories.length) {
      return res.status(404).json({ message: "No categories found" });
    }
    const categoryProducts = await Promise.all(
      categories.map(async (category) => {
        const products = await Product.find({ category: { $regex: new RegExp(category, "i") } });
        return { category, products };
      })
    );

    res.json(categoryProducts);
  } catch (err) {
    console.error("ERROR: Fetching categories with products failed:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

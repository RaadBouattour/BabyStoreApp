const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/database");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const articleRoutes = require("./routes/article");
const userRoutes = require("./routes/user"); // Add user routes

const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Use routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/articles", articleRoutes);
app.use("/users", userRoutes); // Use user routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

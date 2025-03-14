const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/database");
const cors = require("cors");
const notificationRoutes = require('./routes/notifications');
require("dotenv").config();


const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const articleRoutes = require("./routes/article");
const userRoutes = require("./routes/user");
const healthRoute = require("./routes/health");
const app = express();


app.use(bodyParser.json());
app.use(cors());
connectDB();


app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/articles", articleRoutes);
app.use("/users", userRoutes); 
app.use("/health", healthRoute); 
app.use('/notifications', notificationRoutes);


const PORT = process.env.PORT || 5000;
app.listen(5000, '0.0.0.0', () => {
    console.log("Server running on port 5000");
  });
  

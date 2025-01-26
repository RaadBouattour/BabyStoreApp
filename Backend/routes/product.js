const express = require("express");
const {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
} = require("../controllers/productController");
const auth = require("../middlewares/auth");
const multer = require("multer");

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Public: Get all products
router.get("/", getAllProducts);

// Public: Get a product by ID
router.get("/:id", getProductById);

// Admin: Add a new product (with image upload)
router.post("/", auth, upload.single("image"), async (req, res, next) => {
  try {
    await addProduct(req, res);
  } catch (err) {
    next(err);
  }
});

// Admin: Update a product (with optional image upload)
router.put("/:id", auth, upload.single("image"), async (req, res, next) => {
  try {
    await updateProduct(req, res);
  } catch (err) {
    next(err);
  }
});

router.get("/category", getProductsByCategory); // Add this route

// Admin: Delete a product
router.delete("/:id", auth, async (req, res, next) => {
  try {
    await deleteProduct(req, res);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

const express = require("express");
const {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getAllCategoriesWithProducts,
  getAllCategories,
} = require("../controllers/productController");

const auth = require("../middlewares/auth");
const upload = require("../middlewares/multer"); // ✅ Use the correct multer middleware

const router = express.Router();

// ✅ Routes for fetching products
router.get("/", getAllProducts);
router.get("/categories", getAllCategories);
router.get("/categories-with-products", getAllCategoriesWithProducts);
router.get("/category", getProductsByCategory);
router.get("/:id", getProductById);

// ✅ Routes for product operations (Add, Update, Delete)
router.post("/", auth, upload.single("image"), addProduct);
router.put("/:id", auth, upload.single("image"), updateProduct);
router.delete("/:id", auth, deleteProduct);

module.exports = router;

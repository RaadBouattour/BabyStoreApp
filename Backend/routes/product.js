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
const storage = multer.diskStorage({});
const upload = multer({ storage });
const { getAllCategoriesWithProducts } = require("../controllers/productController");
const { getAllCategories } = require("../controllers/productController");


router.get("/", getAllProducts);
router.get("/categories", getAllCategories);
router.get("/categories-with-products", getAllCategoriesWithProducts);
router.get("/category", getProductsByCategory); 
router.get("/:id", getProductById);
router.post("/", auth, upload.single("image"), async (req, res, next) => {
  try {
    await addProduct(req, res);
  } catch (err) {
    next(err);
  }
});
router.put("/:id", auth, upload.single("image"), async (req, res, next) => {
  try {
    await updateProduct(req, res);
  } catch (err) {
    next(err);
  }
});
router.delete("/:id", auth, async (req, res, next) => {
  try {
    await deleteProduct(req, res);
  } catch (err) {
    next(err);
  }
});


module.exports = router;

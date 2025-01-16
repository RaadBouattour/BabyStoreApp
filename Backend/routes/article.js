const express = require("express");
const {
  getAllArticles,
  addArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/articleController");
const auth = require("../middlewares/auth");
const router = express.Router();

// Public: Get all articles
router.get("/", getAllArticles);

// Admin: Add a new article
router.post("/", auth, addArticle);

// Admin: Update an article
router.put("/:id", auth, updateArticle);

// Admin: Delete an article
router.delete("/:id", auth, deleteArticle);

module.exports = router;

const express = require("express");
const { getAllArticles } = require("../controllers/articleController");

const router = express.Router();

// Public: Get all articles
router.get("/", getAllArticles);

module.exports = router;

const express = require("express");
const { getAllArticles } = require("../controllers/articleController");

const router = express.Router();
router.get("/", getAllArticles);

module.exports = router;

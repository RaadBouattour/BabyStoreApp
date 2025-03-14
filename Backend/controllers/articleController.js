const Article = require("../models/Article");

exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (err) {
    console.error("Error fetching articles:", err);
    res.status(500).json({ error: err.message });
  }
};

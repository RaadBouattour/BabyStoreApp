const Article = require("../models/Article");

// Get all articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new article (Admin only)
exports.addArticle = async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: "Access denied" });

  try {
    const { title, content } = req.body;
    const article = new Article({ title, content });
    await article.save();
    res.status(201).json({ message: "Article added", article });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an article (Admin only)
exports.updateArticle = async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: "Access denied" });

  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const article = await Article.findByIdAndUpdate(id, { title, content }, { new: true });
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.json({ message: "Article updated", article });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an article (Admin only)
exports.deleteArticle = async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: "Access denied" });

  try {
    const { id } = req.params;
    const article = await Article.findByIdAndDelete(id);
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.json({ message: "Article deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

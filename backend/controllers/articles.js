const Article = require('../models/Article');

// @desc    Get single article by slug
// @route   GET /api/v1/articles/:slug
// @access  Public
exports.getArticle = async (req, res, next) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    res.status(200).json({ success: true, data: article });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Create or Update article (Upsert)
// @route   POST /api/v1/articles
// @access  Private (Admin)
exports.upsertArticle = async (req, res, next) => {
  try {
    const { slug, title, content } = req.body;
    
    // Check if req.user exists (from protect middleware)
    if(!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    req.body.user = req.user.id;

    let article = await Article.findOne({ slug });

    if (article) {
      article = await Article.findOneAndUpdate({ slug }, req.body, {
        new: true,
        runValidators: true
      });
      return res.status(200).json({ success: true, data: article });
    }

    article = await Article.create(req.body);
    res.status(201).json({ success: true, data: article });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete article
// @route   DELETE /api/v1/articles/:slug
// @access  Private (Admin)
exports.deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    await article.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

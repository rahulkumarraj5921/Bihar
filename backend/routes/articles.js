const express = require('express');
const {
    getArticle,
    upsertArticle,
    deleteArticle
} = require('../controllers/articles');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .post(protect, authorize('admin'), upsertArticle);

router.route('/:slug')
    .get(getArticle)
    .delete(protect, authorize('admin'), deleteArticle);

module.exports = router;



const express = require('express');

const { 
    postArticle, 
    getAllArticle, 
    getArticleById, 
    updateArticleById, 
    deleteArticleById,
    searchArticles,
 } = require('../controllers/article.controller');

 const { 
    validateArticle,
    validateUpdateArticle,
 } = require('../validations/post.validation.js');
const requireAuth = require('../middlewares/requireAuth.js');


const router = express.Router();

router.post('/articles', validateArticle, requireAuth, postArticle);

router.get('/articles', requireAuth, getAllArticle);

router.get('/articles/search', requireAuth, searchArticles);

router.get('/articles/:id', requireAuth, getArticleById);

router.put('/articles/:id', validateUpdateArticle, requireAuth, updateArticleById);

router.delete('/articles/:id', requireAuth, deleteArticleById);


module.exports = router;
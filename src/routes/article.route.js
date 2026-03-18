

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

router.use(requireAuth); //layer of abstraction for authentication, all routes below this line will require authentication

router.post('/articles', validateArticle, postArticle);

router.get('/articles', getAllArticle);

router.get('/articles/search', searchArticles);

router.get('/articles/:id', getArticleById);

router.put('/articles/:id', validateUpdateArticle, updateArticleById);

router.delete('/articles/:id', deleteArticleById);


module.exports = router;
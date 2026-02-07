const Joi = require('joi');
const ArticleModel = require('../models/article.model.js');


const postArticle = async (req, res, next) => {
    const articleSchema = Joi.object({
        title: Joi.string().min(5).max(200).required(),
        content: Joi.string().min(20).required(),
        author: Joi.string().optional().default('Guest')
    });

    const { error , value } = articleSchema.validate(req.body);
    if (error) {
        res.status(400).json("Please provide valid article title, content, or author")
    }

    try {
        const newArticle = new ArticleModel(value);
        await newArticle.save();
        
        return res.status(201).json({
            message: "Article created successfully",
            data: newArticle
        })
        
    }catch (error) {
        console.error(error);
        next(error);
    }
};


const getAllArticle = async (req, res, next) => {
    const {limit = 10, page = 1} = req.query;
    
    const skip = (page - 1) * limit;

    try {
        const articles = await ArticleModel.find({})
           .sort({createdAt: -1})
           .limit(limit)
           .skip(skip);

        return res.status(200).json({
            message: "Articles fetched successfully",
            data: articles
        })
    }catch (error) {
        console.error(error);
        next(error);
    }
};


const getArticleById = async (req, res, next) => {
    try {
        const article = await ArticleModel.findById(req.params.id);
        if (!article) {
            return res.status(404).json({
                message: `Article with ${req.params.id} not found`
            })
        }
        return res.status(200).json({
            message: "Article found",
            data: article
        })
    }catch (error) {
        console.error(error);
        next(error);
    }
};

const updateArticleById = async (req, res, next) => {
    const articleSchema = Joi.object({
        title: Joi.string().min(5).max(200).optional(),
        content: Joi.string().min(20).optional(),
        author: Joi.string().optional()
    });

    const { error, value } = articleSchema.validate(req.body); 
    
     if (error) {
        res.status(400).json("Please provide valid article title and content");
    }
    try {
        const updatedArticle = await ArticleModel.findByIdAndUpdate(
            req.params.id, 
            { ... req.body}, 
            {
            new: true,
            runValidators: true
        }
    );

        if (!updatedArticle) {
            return res.status(404).json({
                message: 'article updated',
                data: updatedArticle,
            })
        }
         return res.status(200).json({  
            message: 'Article updated successfully',
            data: updatedArticle,
        });

    }catch (error) {
        next(error);
    }
};

const deleteArticleById = async (req, res, next) => {
    try {
        const article = await ArticleModel.findByIdAndDelete(req.params.id);

        if (!article) {  // if NOT found, return 404
            return res.status(404).json({
                message: 'Article not found',
            });
        }
        
        return res.status(200).json({  // If found and deleted, return success
            message: 'Article deleted successfully',
        });

    } catch (error) {
      next(NativeError);
    }
};

const searchArticles = async (req, res, next) => {
    const { q, limit = 10, page = 1 } = req.query;
    
    // To Check if search query is provided
    if (!q) {
        return res.status(400).json({
            message: "Please provide a search query using 'q' parameter"
        });
    }
    
    const skip = (page - 1) * limit;
    
    try {
        // To perform text search
        const articles = await ArticleModel.find(
            { $text: { $search: q } },
            { score: { $meta: "textScore" } } // To include relevance score
        )
        .sort({ score: { $meta: "textScore" } }) // T sort by relevance
        .limit(Number(limit))
        .skip(Number(skip));
        
        // To get total count for pagination
        const total = await ArticleModel.countDocuments(
            { $text: { $search: q } }
        );
        
        return res.status(200).json({
            message: "Search completed successfully",
            data: articles,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};


module.exports = {
    postArticle,
    getAllArticle,
    getArticleById,
    updateArticleById,
    deleteArticleById,
    searchArticles
};
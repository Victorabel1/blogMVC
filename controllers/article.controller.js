const Joi = require('joi');
const ArticleModel = require('../models/article.model.js');

//To post a new article, I define an asynchronous function postArticle that takes in the request, response, and next middleware function as parameters. We first define a Joi schema to validate the incoming request body, ensuring that the title is a string between 5 and 200 characters, the content is a string with a minimum length of 20 characters, and the author is an optional string that defaults to 'Guest' if not provided. We then validate the request body against this schema and handle any validation errors by sending a 400 Bad Request response with an appropriate message. If the validation passes, we create a new instance of the ArticleModel with the validated data and save it to the database. Upon successful creation, we return a 201 Created response with a success message and the newly created article data. If any errors occur during this process, we catch them and pass them to the next middleware for error handling.
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

//To get all articles, I define an asynchronous function getAllArticle that takes in the request, response, and next middleware function as parameters. We extract the limit and page query parameters from the request, providing default values of 10 for limit and 1 for page if they are not specified. We calculate the number of documents to skip based on the current page and limit. We then query the ArticleModel to find all articles, sorting them by creation date in descending order, applying the limit and skip for pagination. If the query is successful, we return a 200 OK response with a success message and the retrieved articles data. If any errors occur during this process, we catch them and pass them to the next middleware for error handling.
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

//To get an article by ID, I define an asynchronous function getArticleById that takes in the request, response, and next middleware function as parameters. We attempt to find an article in the ArticleModel using the ID provided in the request parameters. If no article is found with the given ID, we return a 404 Not Found response with an appropriate message. If an article is found, we return a 200 OK response with a success message and the retrieved article data. If any errors occur during this process, such as an invalid ID format, we catch them, log the error details for debugging purposes, and pass the error to the next middleware for error handling.
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

//To update an article by ID, I define an asynchronous function updateArticleById that takes in the request, response, and next middleware function as parameters. We first define a Joi schema to validate the incoming request body, allowing for optional fields for title, content, and author. We then validate the request body against this schema and handle any validation errors by sending a 400 Bad Request response with an appropriate message. If the validation passes, we attempt to find and update the article in the ArticleModel using the ID provided in the request parameters and the validated data from the request body. We set the options to return the updated document and run validators to ensure data integrity. If no article is found with the given ID, we return a 404 Not Found response with an appropriate message. If the article is successfully updated, we return a 200 OK response with a success message and the updated article data. If any errors occur during this process, we catch them and pass them to the next middleware for error handling.
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

//To delete an article by ID, I define an asynchronous function deleteArticleById that takes in the request, response, and next middleware function as parameters. We attempt to find and delete the article in the ArticleModel using the ID provided in the request parameters. If no article is found with the given ID, we return a 404 Not Found response with an appropriate message. If the article is successfully deleted, we return a 200 OK response with a success message indicating that the article was deleted successfully. If any errors occur during this process, such as an invalid ID format, we catch them and pass them to the next middleware for error handling.
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

//To search for articles, I define an asynchronous function searchArticles that takes in the request, response, and next middleware function as parameters. We extract the search query (q), limit, and page from the request query parameters, providing default values for limit and page if they are not specified. We check if the search query is provided; if not, we return a 400 Bad Request response with an appropriate message. We calculate the number of documents to skip based on the current page and limit for pagination. We then perform a text search on the ArticleModel using the $text operator, sorting the results by relevance score. We also retrieve the total count of matching articles for pagination purposes. Finally, we return a 200 OK response with a success message, the retrieved articles data, and pagination information. If any errors occur during this process, we catch them, log the error details for debugging purposes, and pass the error to the next middleware for error handling.
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

//To export all the defined functions in this controller, we use module.exports to make them available for import in other parts of the application, such as the routes. This allows us to keep our code organized and modular, separating the concerns of handling HTTP requests and defining the business logic for managing articles.
module.exports = {
    postArticle,
    getAllArticle,
    getArticleById,
    updateArticleById,
    deleteArticleById,
    searchArticles
};
const { required } = require('joi')
const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema(
    {
    title: {
        type: String, 
        required: true,
        minlength: 5,
        maxlength: 200
    },
    content: {
        type: String, 
        required: true,
        minlength: 20,
        maxlength: 2000
    },
    author: {
        type: String, 
        required: false,
        default: 'Guest',}
    },
    {timestamps: true} 
); //Article Created/Updated

// To add text index on title and content fields that will enable searching for keywords in these fields efficiently. This is particularly useful for implementing search functionality in the application, allowing users to find articles based on keywords in the title or content.
articleSchema.index({ title: 'text', content: 'text' });

const Article = mongoose.model('Article', articleSchema);

//To export the Article model, I use module.exports to make it available for import in other parts of the application, such as the controllers. This allows us to interact with the Article collection in the MongoDB database using this model, enabling us to perform CRUD operations and other database interactions related to articles.
module.exports = Article;
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

module.exports = Article;
const multer = require('multer');
const cloudinary = require('../config/cloudinary.js');
const cloudinaryStorage = 
    require('multer-storage-cloudinary').CloudinaryStorage;

const storage = new cloudinaryStorage({
    cloudinary,
    params: {
        folder: 'blog-uploads',
        allowed_formats: ['jpg', 'jpeg', 'png'],
    },
});

const upload = multer({ storage });

module.exports = upload;
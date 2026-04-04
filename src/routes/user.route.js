const express = require('express');

const multer = require('multer');
const upload = require('../middlewares/upload.js');

const { 
    registerUser, 
    loginUser } = require('../controllers/user.controller');
const { validateLogin } = require('../validations/user.validation');
const { validateRegister } = require('../validations/user.validation');

const router = express.Router();

router.post('/upload', upload.single('image'), (req, res) => {
  const fileUrl = req.file.path;
  const fileName = req.file.filename;
  console.log('Uploaded file URL:', fileUrl);
  console.log('Uploaded file name:', fileName);

    res.send('Hello from Upload endpoint');
});

router.post('/signup', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);

module.exports = router;
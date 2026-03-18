const express = require('express');
const { 
    registerUser, 
    loginUser } = require('../controllers/user.controller');
const { validateLogin } = require('../validations/user.validation');
const { validateRegister } = require('../validations/user.validation');

const router = express.Router();

router.post('/signup', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);

module.exports = router;
const userModel = require('../models/user.model');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { hashPassword } = require('../utils/bcrypt');


const registerUser = async (req, res, next) => { 
  try {
    const { name, email, password } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exist' });
    };

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
   
    const User = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });
    await User.save();
    return res.status(201).json({ 
        message: 'User registered successfully',
        user: {
          name: User.name,
          email: User.email,
        }
     });
  } catch (error) {
      next(error);
     };
};

const loginUser = async (req, res, next) => {
   const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  };

  const { email, password, name} = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    await hashPassword(password);

    const token = jwt.sign(
        {UserId: user._id, name: user.name, email: user.email }, // payload
        process.env.JWT_SECRET, // secret key
        { expiresIn: '7d' }, // options
    );

    return res.status(200).json({
      message: 'Logged in successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        password: user.password // For learning only; remove in production!
      },
        token: token,
    });
  } catch (error) {
      next(error);
  }
};

module.exports = {
    registerUser,
    loginUser,
};
require('dotenv').config();
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model.js');

const requireAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Authorization Header:', authHeader);
  console.log('JWT Secret:', process.env.JWT_SECRET);

    if (!authHeader || !authHeader.startsWith('Bearer '))
      return res.status(401).json({ message: 'Access denied: no token' });
    
    const token = authHeader.replace('Bearer ', '');
  console.log('Token:', token);

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await userModel.findById(payload.UserId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }


      req.user = user; // every route knows who is logged in
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' }); 
    }
};

module.exports = requireAuth;
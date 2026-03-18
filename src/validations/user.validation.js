const Joi = require('joi');

 const registerSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const loginSchema = Joi.object({
     email: Joi.string().email().required(),
     password: Joi.string().min(6).required(),
   });
 

const validateRegister = (req, res, next) => {
  console.log(req.body);
  const { error } = registerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
    error: error.details[0].message,
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  console.log(req.body);
  const { error } = loginSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
    error: error.details[0].message,
    });
  }

  next();
};

module.exports = {
    validateRegister,
    validateLogin
};
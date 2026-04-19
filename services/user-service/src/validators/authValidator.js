// validators/authValidator.js
const Joi = require('joi');

// Helper function to create consistent validation responses
const validate = (schema, data) => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    return { error: true, errors };
  }
  
  return { error: false, value };
};

// Common validation patterns
const commonValidators = {
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'edu'] } })
    .required()
    .trim()
    .lowercase()
    .max(255),
  
  password: Joi.string()
    .min(8)
    .max(100)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password cannot exceed 100 characters'
    }),
  
  name: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s\-']+$/)
    .required()
    .trim()
    .messages({
      'string.pattern.base': 'Name can only contain letters, spaces, hyphens, and apostrophes',
      'string.min': 'Name must be at least 2 characters long'
    }),
  
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .trim()
    .lowercase()
    .messages({
      'string.alphanum': 'Username can only contain letters and numbers',
      'string.min': 'Username must be at least 3 characters long'
    })
};

// 1. REGISTER VALIDATOR
const validateRegister = (req, res, next) => {
  const schema = Joi.object({
    full_name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'support operator', 'customer').optional()
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ errors: error.details.map(d => d.message) });
  }
  next();
};

// 2. LOGIN VALIDATOR
const validateLogin = (req, res, next) => {
  const loginSchema = Joi.object({
    email: Joi.string().email().required().trim().lowercase(),
    password: Joi.string().required().messages({
      'any.required': 'Password is required'
    })
  });

  const result = validate(loginSchema, req.body);
  if (result.error) {
    return res.status(400).json({ errors: result.errors });
  }

  next();
};

// 3. CHANGE PASSWORD VALIDATOR
const validateChangePassword = (data) => {
  const changePasswordSchema = Joi.object({
    currentPassword: Joi.string()
      .required()
      .messages({
        'any.required': 'Current password is required'
      }),
    
    newPassword: commonValidators.password,
    
    confirmNewPassword: Joi.string()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
        'any.only': 'New passwords do not match',
        'any.required': 'Please confirm your new password'
      })
  })
  .custom((value, helpers) => {
    // Prevent changing to the same password
    if (value.currentPassword === value.newPassword) {
      return helpers.error('password.same');
    }
    return value;
  })
  .messages({
    'password.same': 'New password must be different from current password'
  });

  return validate(changePasswordSchema, data);
};

module.exports = {
  validateRegister,
  validateLogin,
  validateChangePassword
};
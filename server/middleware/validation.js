import Joi from 'joi';

// Validation schemas
const schemas = {
  signup: Joi.object({
    username: Joi.string()
      .trim()
      .min(3)
      .max(50)
      .pattern(/^[a-zA-Z0-9_]+$/)
      .required()
      .messages({
        'string.pattern.base': 'Username should only contain letters, numbers, and underscores',
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username cannot exceed 50 characters'
      }),
    
    firstName: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        'string.pattern.base': 'First name should only contain letters and spaces',
        'string.min': 'First name must be at least 2 characters long',
        'string.max': 'First name cannot exceed 50 characters'
      }),
    
    lastName: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        'string.pattern.base': 'Last name should only contain letters and spaces',
        'string.min': 'Last name must be at least 2 characters long',
        'string.max': 'Last name cannot exceed 50 characters'
      }),
    
    mobile: Joi.string()
      .trim()
      .pattern(/^[6-9]\d{9}$/)
      .required()
      .messages({
        'string.pattern.base': 'Mobile number must be a valid 10-digit Indian mobile number'
      }),
    
    password: Joi.string()
      .min(8)
      .max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.max': 'Password cannot exceed 128 characters',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      })
  }),

  login: Joi.object({
    username: Joi.string()
      .trim()
      .min(3)
      .required()
      .messages({
        'string.min': 'Username is required'
      }),
    
    password: Joi.string()
      .min(1)
      .required()
      .messages({
        'string.min': 'Password is required'
      })
  })
};

// Generic validation middleware
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
};

// Export specific validation middlewares
export const validateSignup = validate(schemas.signup);
export const validateLogin = validate(schemas.login);

// Sanitize input to prevent XSS
export const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        // Basic XSS prevention - remove script tags and javascript: protocols
        obj[key] = obj[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .trim();
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);

  next();
};
const validateUpdateUser = (req, res, next) => {
  const { full_name, email, role } = req.body;
  const errors = [];

  // Validate email format
  if (email && !/\S+@\S+\.\S+/.test(email)) {
    errors.push('Invalid email format');
  }

  // Validate full name
  if (full_name && full_name.length < 2) {
    errors.push('Full name must be at least 2 characters');
  }

  if (full_name && full_name.length > 100) {
    errors.push('Full name must be less than 100 characters');
  }

  // Validate role
  if (role && !['admin', 'support operator', 'customer'].includes(role)) {
    errors.push('Invalid role. Must be admin, support operator, or customer');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }

  next();
};

const validateUserId = (req, res, next) => {
  const { id } = req.params;
  const errors = [];

  if (!id || isNaN(parseInt(id))) {
    errors.push('Valid user ID is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }

  next();
};

module.exports = {
  validateUpdateUser,
  validateUserId
};
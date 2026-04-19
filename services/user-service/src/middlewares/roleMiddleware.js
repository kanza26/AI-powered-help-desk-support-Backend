// Role-based authorization middleware
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions. Access denied.'
      });
    }

    next();
  };
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  next();
};

// Check if user is support operator
const isSupportOperator = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'support operator' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Support operator access required'
    });
  }

  next();
};

// Check if user is accessing their own resource or is admin
const isOwnResourceOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const requestedUserId = parseInt(req.params.id) || req.params.userId;
  
  if (req.user.role === 'admin' || req.user.id === requestedUserId) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'You can only access your own resources'
  });
};

module.exports = {
  authorize,
  isAdmin,
  isSupportOperator,
  isOwnResourceOrAdmin
};
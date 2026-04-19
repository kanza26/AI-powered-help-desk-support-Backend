const authService = require('../services/authService');
const { ValidationError } = require('../middlewares/errorHandler');

class AuthController {
  async register(req, res, next) {
    try {
      const { email, password, full_name, role } = req.body;
      
      // Validate required fields
      if (!email || !password || !full_name) {
        throw new ValidationError('Missing required fields', [
          ...(!email ? [{ field: 'email', message: 'Email is required' }] : []),
          ...(!password ? [{ field: 'password', message: 'Password is required' }] : []),
          ...(!full_name ? [{ field: 'full_name', message: 'Full name is required' }] : [])
        ]);
      }
      
      const result = await authService.register({
        email,
        password,
        full_name,
        role
      });
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        throw new ValidationError('Email and password are required');
      }
      
      const result = await authService.login(email, password);
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        throw new ValidationError('Refresh token is required');
      }
      
      const tokens = await authService.refreshToken(refreshToken);
      
      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: tokens
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const userId = req.user.id;
      await authService.logout(userId);
      
      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword } = req.body;
      
      if (!oldPassword || !newPassword) {
        throw new ValidationError('Old password and new password are required');
      }
      
      if (newPassword.length < 6) {
        throw new ValidationError('New password must be at least 6 characters');
      }
      
      await authService.changePassword(userId, oldPassword, newPassword);
      
      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
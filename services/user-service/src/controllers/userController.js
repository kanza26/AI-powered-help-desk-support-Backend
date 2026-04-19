const userService = require('../services/userService');
const { ValidationError, NotFoundError } = require('../middlewares/errorHandler');

class UserController {
  async getProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const user = await userService.getUserProfile(userId);
      
      if (!user) {
        throw new NotFoundError('User');
      }
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const updateData = req.body;
      
      // Prevent updating sensitive fields
      delete updateData.password_hash;
      delete updateData.refresh_token;
      delete updateData.id;
      delete updateData.created_at;
      
      if (Object.keys(updateData).length === 0) {
        throw new ValidationError('No valid fields to update');
      }
      
      const updatedUser = await userService.updateUser(userId, updateData);
      
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAccount(req, res, next) {
    try {
      const userId = req.user.id;
      await userService.deleteUser(userId);
      
      res.status(200).json({
        success: true,
        message: 'Account deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const { page = 1, limit = 10, sort = 'created_at', order = 'DESC' } = req.query;
      
      const users = await userService.getAllUsers({
        page: parseInt(page),
        limit: parseInt(limit),
        sort,
        order
      });
      
      res.status(200).json({
        success: true,
        data: users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const userId = req.params.id;
      const user = await userService.findUserById(userId);
      
      if (!user) {
        throw new NotFoundError('User');
      }
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const userId = req.params.id;
      const updateData = req.body;
      
      // Check if user exists
      const existingUser = await userService.findUserById(userId);
      if (!existingUser) {
        throw new NotFoundError('User');
      }
      
      // Prevent updating sensitive fields
      delete updateData.password_hash;
      delete updateData.refresh_token;
      delete updateData.id;
      delete updateData.created_at;
      
      if (Object.keys(updateData).length === 0) {
        throw new ValidationError('No valid fields to update');
      }
      
      const updatedUser = await userService.updateUser(userId, updateData);
      
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const userId = req.params.id;
      
      // Check if user exists
      const existingUser = await userService.findUserById(userId);
      if (!existingUser) {
        throw new NotFoundError('User');
      }
      
      // Prevent admin from deleting themselves
      if (parseInt(userId) === req.user.id) {
        throw new ValidationError('You cannot delete your own account through this endpoint. Use /profile instead.');
      }
      
      await userService.deleteUser(userId);
      
      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async getUsersByRole(req, res, next) {
    try {
      const { role } = req.params;
      const validRoles = ['admin', 'support operator', 'customer'];
      
      if (!validRoles.includes(role)) {
        throw new ValidationError('Invalid role. Must be admin, support operator, or customer');
      }
      
      const users = await userService.getUsersByRole(role);
      
      res.status(200).json({
        success: true,
        data: users
      });
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req, res, next) {
    try {
      const user = await userService.getUserProfile(req.user.id);
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
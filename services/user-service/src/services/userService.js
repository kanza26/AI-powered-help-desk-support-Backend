const { Op } = require('sequelize');
const User = require('../model/User');

class UserService {
  async createUser(userData) {
    try {
      const user = await User.create({
        email: userData.email,
        password_hash: userData.password_hash,
        full_name: userData.full_name,
        role: userData.role || 'customer',
        created_at: new Date(),
        updated_at: new Date()
      });
      
      // Remove sensitive data before returning
      const userObj = user.toJSON();
      delete userObj.password_hash;
      delete userObj.refresh_token;
      
      return userObj;
    } catch (error) {
      throw error;
    }
  }

  async findUserById(userId) {
    try {
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password_hash', 'refresh_token'] }
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findUserByEmail(email) {
    try {
      const user = await User.findOne({
        where: { email }
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findUserByRefreshToken(userId, refreshToken) {
    try {
      const user = await User.findOne({
        where: {
          id: userId,
          refresh_token: refreshToken
        }
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUserRefreshToken(userId, refreshToken) {
    try {
      await User.update(
        { 
          refresh_token: refreshToken,
          updated_at: new Date()
        },
        { where: { id: userId } }
      );
    } catch (error) {
      throw error;
    }
  }

  async clearUserRefreshToken(userId) {
    try {
      await User.update(
        { 
          refresh_token: null,
          updated_at: new Date()
        },
        { where: { id: userId } }
      );
    } catch (error) {
      throw error;
    }
  }

  async updateUserPassword(userId, hashedPassword) {
    try {
      await User.update(
        { 
          password_hash: hashedPassword,
          updated_at: new Date()
        },
        { where: { id: userId } }
      );
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers() {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password_hash', 'refresh_token'] },
        order: [['created_at', 'DESC']],
        limit: limit
      });
      return users;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userId, updateData) {
    try {
      // Remove sensitive fields that shouldn't be updated directly
      delete updateData.password_hash;
      delete updateData.refresh_token;
      delete updateData.id;
      
      updateData.updated_at = new Date();
      
      await User.update(updateData, { where: { id: userId } });
      
      // Return updated user
      const updatedUser = await this.findUserById(userId);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      await User.destroy({ where: { id: userId } });
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async getUserProfile(userId) {
    try {
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password_hash', 'refresh_token'] }
      });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUsersByRole(role) {
    try {
      const users = await User.findAll({
        where: { role },
        attributes: { exclude: ['password_hash', 'refresh_token'] }
      });
      return users;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();
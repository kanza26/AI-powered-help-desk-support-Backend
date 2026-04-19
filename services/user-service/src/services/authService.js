
const bcrypt = require('bcryptjs');
const userService = require('./userService');
const jwtService = require('./jwtService');
const redisClient = require('../config/redis.js');

class AuthService {
  async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await userService.findUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const user = await userService.createUser({
        email: userData.email,
        password_hash: hashedPassword,
        full_name: userData.full_name,
        role: userData.role || 'customer'
      });

      // Generate tokens
      const tokens = jwtService.generateTokens(user);

      // Save refresh token
      await userService.updateUserRefreshToken(user.id, tokens.refreshToken);
      
      // Push email notification to Redis queue
      await redisClient.lPush('email:queue', JSON.stringify({
        to: user.email,
        subject: 'Welcome to our Help desk support!',
        message: `Hello ${user.full_name}, thank you for registering! You can now log in and start using our services using your email: ${user.email}`,
        type: 'welcome',
        userId: user.id
      }));

      console.log(`📧 Welcome email queued for ${user.email}`);

      return {
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role
        },
        ...tokens
      };
    } catch (error) {
      throw error;
    }
  }

  async login(email, password) {
    try {
      // Find user by email
      const user = await userService.findUserByEmail(email);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      // Generate tokens
      const tokens = jwtService.generateTokens(user);

      // Save refresh token
      await userService.updateUserRefreshToken(user.id, tokens.refreshToken);

      return {
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role
        },
        ...tokens
      };
    } catch (error) {
      throw error;
    }
  }

  async logout(userId) {
    try {
      await userService.clearUserRefreshToken(userId);
      return { message: 'Logged out successfully' };
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = jwtService.verifyRefreshToken(refreshToken);
      if (!decoded) {
        throw new Error('Invalid refresh token');
      }

      // Find user by id and refresh token
      const user = await userService.findUserByRefreshToken(decoded.userId, refreshToken);
      if (!user) {
        throw new Error('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = jwtService.generateTokens(user);

      // Update refresh token in database
      await userService.updateUserRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      throw error;
    }
  }

  async changePassword(userId, oldPassword, newPassword) {
    try {
      const user = await userService.findUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify old password
      const isValidPassword = await bcrypt.compare(oldPassword, user.password_hash);
      if (!isValidPassword) {
        throw new Error('Invalid old password');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Update password
      await userService.updateUserPassword(userId, hashedPassword);

      return { message: 'Password changed successfully' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();
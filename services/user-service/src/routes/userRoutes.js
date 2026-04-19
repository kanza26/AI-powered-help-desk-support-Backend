const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate} = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { validateUpdateUser } = require('../validators/userValidator');

// Protected routes (all user routes require authentication)
router.use(authenticate);

// User profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', validateUpdateUser, userController.updateProfile);
router.delete('/profile', userController.deleteAccount);

// Admin only routes
router.get('/', authorize('admin'), userController.getAllUsers);
router.get('/:id', authorize('admin'), userController.getUserById);
router.put('/:id', authorize('admin'), validateUpdateUser, userController.updateUser);
router.delete('/:id', authorize('admin'), userController.deleteUser);
router.get('/role/:role', authorize('admin'), userController.getUsersByRole);

module.exports = router;


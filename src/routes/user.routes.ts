import { Router } from 'express';
import { body, param } from 'express-validator';

import { validate } from '../middleware/validate.middleware';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';
import userController from '../controllers/user.controller';

const router = Router();

// User ID validation
const userIdValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer')
];

// Update user validation
const updateUserValidation = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address'),
  
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
  
  body('profileImage')
    .optional()
    .trim()
    .isURL()
    .withMessage('Profile image must be a valid URL')
];

// Update user role validation
const updateUserRoleValidation = [
  body('role')
    .isIn(['user', 'admin'])
    .withMessage('Role must be either "user" or "admin"')
];

// Reset password validation
const resetPasswordValidation = [
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Routes
router.get('/', authenticate, authorizeAdmin, userController.getAllUsers);
router.get('/:id', authenticate, userIdValidation, validate(userIdValidation), userController.getUserById);
router.put('/:id', authenticate, validate([...userIdValidation, ...updateUserValidation]), userController.updateUser);
router.put('/:id/role', authenticate, authorizeAdmin, validate([...userIdValidation, ...updateUserRoleValidation]), userController.updateUserRole);
router.delete('/:id', authenticate, validate(userIdValidation), userController.deleteUser);
router.post('/:id/reset-password', authenticate, authorizeAdmin, validate([...userIdValidation, ...resetPasswordValidation]), userController.resetUserPassword);
router.post('/', validate(createUserValidation), userController.createUser);


export default router;
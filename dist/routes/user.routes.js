"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validate_middleware_1 = require("../middleware/validate.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const router = (0, express_1.Router)();
// User ID validation
const userIdValidation = [
    (0, express_validator_1.param)('id')
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer')
];
// Update user validation
const updateUserValidation = [
    (0, express_validator_1.body)('username')
        .optional()
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters'),
    (0, express_validator_1.body)('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address'),
    (0, express_validator_1.body)('firstName')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('First name cannot exceed 50 characters'),
    (0, express_validator_1.body)('lastName')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Last name cannot exceed 50 characters'),
    (0, express_validator_1.body)('profileImage')
        .optional()
        .trim()
        .isURL()
        .withMessage('Profile image must be a valid URL')
];
// Update user role validation
const updateUserRoleValidation = [
    (0, express_validator_1.body)('role')
        .isIn(['user', 'admin'])
        .withMessage('Role must be either "user" or "admin"')
];
// Reset password validation
const resetPasswordValidation = [
    (0, express_validator_1.body)('newPassword')
        .isLength({ min: 8 })
        .withMessage('New password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
];
// Routes
router.get('/', auth_middleware_1.authenticate, auth_middleware_1.authorizeAdmin, user_controller_1.default.getAllUsers);
router.get('/:id', auth_middleware_1.authenticate, userIdValidation, (0, validate_middleware_1.validate)(userIdValidation), user_controller_1.default.getUserById);
router.put('/:id', auth_middleware_1.authenticate, (0, validate_middleware_1.validate)([...userIdValidation, ...updateUserValidation]), user_controller_1.default.updateUser);
router.put('/:id/role', auth_middleware_1.authenticate, auth_middleware_1.authorizeAdmin, (0, validate_middleware_1.validate)([...userIdValidation, ...updateUserRoleValidation]), user_controller_1.default.updateUserRole);
router.delete('/:id', auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(userIdValidation), user_controller_1.default.deleteUser);
router.post('/:id/reset-password', auth_middleware_1.authenticate, auth_middleware_1.authorizeAdmin, (0, validate_middleware_1.validate)([...userIdValidation, ...resetPasswordValidation]), user_controller_1.default.resetUserPassword);
exports.default = router;
//# sourceMappingURL=user.routes.js.map
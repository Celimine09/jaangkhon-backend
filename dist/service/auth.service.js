"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const password_util_1 = require("../utils/password.util");
const jwt_util_1 = require("../utils/jwt.util");
const sequelize_1 = require("sequelize");
const user_model_1 = __importDefault(require("../model/user.model"));
/**
 * Service for handling user authentication
 */
class AuthService {
    /**
     * Register a new user
     *
     * @param {UserCreationAttributes} userData - User data to register
     * @returns {Promise<User>} Created user object
     * @throws {Error} If user already exists or registration fails
     */
    async register(userData) {
        // Check if user already exists
        const existingUser = await user_model_1.default.findOne({
            where: {
                [sequelize_1.Op.or]: [
                    { email: userData.email },
                    { username: userData.username }
                ]
            }
        });
        if (existingUser) {
            if (existingUser.email === userData.email) {
                throw new Error('Email is already in use');
            }
            else {
                throw new Error('Username is already taken');
            }
        }
        // Hash password
        userData.password = await (0, password_util_1.hashPassword)(userData.password);
        // Create new user
        const user = await user_model_1.default.create(userData);
        return user;
    }
    /**
     * Login a user
     *
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<LoginResponse>} Login response with token and user data
     * @throws {Error} If login fails or user not found
     */
    async login(email, password) {
        // Find user by email
        const user = await user_model_1.default.findOne({ where: { email } });
        if (!user) {
            throw new Error('User not found');
        }
        if (!user.isActive) {
            throw new Error('Account is inactive');
        }
        // ตรวจสอบว่าผู้ใช้มีรหัสผ่านหรือไม่ (กรณีล็อกอินผ่าน OAuth)
        if (!user.password) {
            throw new Error('Please login with Google');
        }
        // Verify password
        const isPasswordValid = await (0, password_util_1.verifyPassword)(user.password, password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        // Generate JWT token
        const token = (0, jwt_util_1.generateToken)({
            userId: user.id,
            email: user.email,
            role: user.role
        });
        // Return token and user data
        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        };
    }
    /**
     * Change user password
     *
     * @param {number} userId - User ID
     * @param {string} currentPassword - Current password
     * @param {string} newPassword - New password
     * @returns {Promise<boolean>} True if password change was successful
     * @throws {Error} If password change fails
     */
    async changePassword(userId, currentPassword, newPassword) {
        // Find user
        const user = await user_model_1.default.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }
        // Verify current password
        const isCurrentPasswordValid = await (0, password_util_1.verifyPassword)(user.password, currentPassword);
        if (!isCurrentPasswordValid) {
            throw new Error('Current password is incorrect');
        }
        // Hash new password
        const hashedPassword = await (0, password_util_1.hashPassword)(newPassword);
        // Update password
        await user.update({ password: hashedPassword });
        return true;
    }
}
exports.default = new AuthService();
//# sourceMappingURL=auth.service.js.map
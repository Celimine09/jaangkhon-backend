"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../model/user.model"));
const password_util_1 = require("../utils/password.util");
/**
 * Service for user operations
 */
class UserService {
    /**
     * Get all users
     *
     * @returns {Promise<User[]>} List of all users
     */
    async getAllUsers() {
        return await user_model_1.default.findAll({
            attributes: { exclude: ['password'] }
        });
    }
    /**
     * Get user by ID
     *
     * @param {number} userId - User ID
     * @returns {Promise<User | null>} User object or null if not found
     */
    async getUserById(userId) {
        return await user_model_1.default.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });
    }
    /**
     * Update user
     *
     * @param {number} userId - User ID to update
     * @param {object} userData - User data to update
     * @returns {Promise<User | null>} Updated user or null if not found
     */
    async updateUser(userId, userData) {
        // Make sure we don't update sensitive fields
        if (userData.password) {
            delete userData.password;
        }
        if (userData.role) {
            delete userData.role;
        }
        const user = await user_model_1.default.findByPk(userId);
        if (!user) {
            return null;
        }
        await user.update(userData);
        // Return user without password
        const { password, ...userWithoutPassword } = user.get({ plain: true });
        return userWithoutPassword;
    }
    /**
     * Update user role (admin only)
     *
     * @param {number} userId - User ID to update
     * @param {'user' | 'admin'} role - New role
     * @returns {Promise<User | null>} Updated user or null if not found
     */
    async updateUserRole(userId, role) {
        const user = await user_model_1.default.findByPk(userId);
        if (!user) {
            return null;
        }
        await user.update({ role });
        // Return user without password
        const { password, ...userWithoutPassword } = user.get({ plain: true });
        return userWithoutPassword;
    }
    /**
     * Delete user
     *
     * @param {number} userId - User ID to delete
     * @returns {Promise<boolean>} True if user was deleted
     */
    async deleteUser(userId) {
        const result = await user_model_1.default.destroy({
            where: { id: userId }
        });
        return result > 0;
    }
    /**
     * Reset user password (admin only)
     *
     * @param {number} userId - User ID
     * @param {string} newPassword - New password
     * @returns {Promise<boolean>} True if password was reset
     */
    async resetUserPassword(userId, newPassword) {
        const user = await user_model_1.default.findByPk(userId);
        if (!user) {
            return false;
        }
        const hashedPassword = await (0, password_util_1.hashPassword)(newPassword);
        await user.update({ password: hashedPassword });
        return true;
    }
}
exports.default = new UserService();
//# sourceMappingURL=user.service.js.map
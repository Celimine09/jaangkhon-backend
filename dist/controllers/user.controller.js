"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("../service/user.service"));
/**
 * Controller for user operations
 */
class UserController {
    /**
     * Get all users (admin only)
     *
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     */
    async getAllUsers(req, res) {
        try {
            const users = await user_service_1.default.getAllUsers();
            res.status(200).json({
                success: true,
                data: users
            });
        }
        catch (error) {
            console.error('Get all users error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve users',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Get user by ID
     *
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     */
    async getUserById(req, res) {
        try {
            const userId = parseInt(req.params.id);
            const user = await user_service_1.default.getUserById(userId);
            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: user
            });
        }
        catch (error) {
            console.error('Get user by ID error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve user',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Update user
     *
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     */
    async updateUser(req, res) {
        try {
            const userId = parseInt(req.params.id);
            const userData = req.body;
            // Check if user is updating their own profile or is an admin
            if (req.user.id !== userId && req.user.role !== 'admin') {
                res.status(403).json({
                    success: false,
                    message: 'You are not authorized to update this user'
                });
                return;
            }
            const updatedUser = await user_service_1.default.updateUser(userId, userData);
            if (!updatedUser) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'User updated successfully',
                data: updatedUser
            });
        }
        catch (error) {
            console.error('Update user error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update user',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Update user role (admin only)
     *
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     */
    async updateUserRole(req, res) {
        try {
            const userId = parseInt(req.params.id);
            const { role } = req.body;
            if (role !== 'user' && role !== 'admin') {
                res.status(400).json({
                    success: false,
                    message: 'Invalid role. Role must be either "user" or "admin"'
                });
                return;
            }
            const updatedUser = await user_service_1.default.updateUserRole(userId, role);
            if (!updatedUser) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'User role updated successfully',
                data: updatedUser
            });
        }
        catch (error) {
            console.error('Update user role error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update user role',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Delete user
     *
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     */
    async deleteUser(req, res) {
        try {
            const userId = parseInt(req.params.id);
            // Check if user is deleting their own account or is an admin
            if (req.user.id !== userId && req.user.role !== 'admin') {
                res.status(403).json({
                    success: false,
                    message: 'You are not authorized to delete this user'
                });
                return;
            }
            const result = await user_service_1.default.deleteUser(userId);
            if (!result) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
        }
        catch (error) {
            console.error('Delete user error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete user',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Reset user password (admin only)
     *
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     */
    async resetUserPassword(req, res) {
        try {
            const userId = parseInt(req.params.id);
            const { newPassword } = req.body;
            const result = await user_service_1.default.resetUserPassword(userId, newPassword);
            if (!result) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'User password reset successfully'
            });
        }
        catch (error) {
            console.error('Reset user password error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to reset user password',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}
exports.default = new UserController();
//# sourceMappingURL=user.controller.js.map
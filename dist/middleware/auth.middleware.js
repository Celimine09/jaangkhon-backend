"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAdmin = exports.authenticate = void 0;
const jwt_util_1 = require("../utils/jwt.util");
const user_model_1 = __importDefault(require("../model/user.model"));
/**
 * Middleware to protect routes - ensures the request has a valid JWT token
 */
// ใน auth.middleware.ts
const authenticate = async (req, res, next) => {
    try {
        // ดูค่า Authorization header
        console.log('Auth header:', req.headers.authorization);
        // แกะ token
        const authHeader = req.headers.authorization;
        const token = (0, jwt_util_1.extractTokenFromHeader)(authHeader);
        if (!token) {
            console.log('No token provided');
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }
        // ดูข้อมูลที่แกะได้จาก token
        const decoded = (0, jwt_util_1.verifyToken)(token);
        console.log('Decoded token:', decoded);
        if (!decoded) {
            console.log('Invalid token');
            return res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        }
        // ดูการหาผู้ใช้งานจากฐานข้อมูล
        const user = await user_model_1.default.findByPk(decoded.userId, {
            attributes: { exclude: ['password'] }
        });
        console.log('User from database:', user ? user.toJSON() : null);
        if (!user) {
            console.log('User not found');
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }
        // ตรวจสอบการเซ็ตค่า req.user
        req.user = user;
        console.log('req.user set to:', req.user.toJSON());
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error during authentication.'
        });
    }
};
exports.authenticate = authenticate;
/**
 * Middleware to ensure user has admin role
 */
const authorizeAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required.'
        });
    }
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }
    next();
};
exports.authorizeAdmin = authorizeAdmin;
//# sourceMappingURL=auth.middleware.js.map
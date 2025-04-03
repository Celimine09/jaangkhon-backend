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
const authenticate = async (req, res, next) => {
    try {
        // Get authorization header
        const authHeader = req.headers.authorization;
        // Extract token from header
        const token = (0, jwt_util_1.extractTokenFromHeader)(authHeader);
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }
        // Verify token
        const decoded = (0, jwt_util_1.verifyToken)(token);
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        }
        // Find user by ID from token payload
        const user = await user_model_1.default.findByPk(decoded.userId, {
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'User account is inactive.'
            });
        }
        // Attach user to request object
        req.user = user;
        // Proceed to next middleware
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
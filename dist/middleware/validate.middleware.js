"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
/**
 * Middleware to validate request data using express-validator
 *
 * @param {ValidationChain[]} validations - Array of express-validator validation chains
 * @returns {Function} Express middleware function
 */
const validate = (validations) => {
    return async (req, res, next) => {
        // Execute all validations
        await Promise.all(validations.map(validation => validation.run(req)));
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            return next();
        }
        // Format validation errors
        const formattedErrors = errors.array().map((error) => {
            // แปลง error ให้เป็น any หรือกำหนด Type เอง
            const err = error;
            return {
                path: err.path || err.param || 'unknown',
                message: err.msg
            };
        });
        // Return validation errors
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: formattedErrors
        });
    };
};
exports.validate = validate;
//# sourceMappingURL=validate.middleware.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/product.routes.ts
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validate_middleware_1 = require("../middleware/validate.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const product_controller_1 = __importDefault(require("../controllers/product.controller"));
const router = (0, express_1.Router)();
// Validation rules
const productValidation = [
    (0, express_validator_1.body)('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Product name must be between 2 and 100 characters'),
    (0, express_validator_1.body)('description')
        .trim()
        .isLength({ min: 10 })
        .withMessage('Description must be at least 10 characters'),
    (0, express_validator_1.body)('price')
        .isNumeric()
        .withMessage('Price must be a number')
        .custom(value => value >= 0)
        .withMessage('Price cannot be negative'),
    (0, express_validator_1.body)('category')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Category must be between 2 and 50 characters'),
    (0, express_validator_1.body)('stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer'),
    (0, express_validator_1.body)('imageUrl')
        .optional()
        .isURL()
        .withMessage('Image URL must be a valid URL')
];
// Public routes (no authentication required)
router.get('/', product_controller_1.default.getProducts);
router.get('/:id', product_controller_1.default.getProductById);
router.get('/user/:userId', product_controller_1.default.getProductsByUser);
// Protected routes (authentication required)
router.post('/', auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(productValidation), product_controller_1.default.createProduct);
router.put('/:id', auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(productValidation), product_controller_1.default.updateProduct);
router.delete('/:id', auth_middleware_1.authenticate, product_controller_1.default.deleteProduct);
exports.default = router;
//# sourceMappingURL=product.routes.js.map
// src/routes/product.routes.ts
import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import productController from '../controllers/product.controller';

const router = Router();

// Validation rules
const productValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
  
  body('price')
    .isNumeric()
    .withMessage('Price must be a number')
    .custom(value => value >= 0)
    .withMessage('Price cannot be negative'),
  
  body('category')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL')
];

// Public routes (no authentication required)
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Protected routes (authentication required)
router.post('/', authenticate, validate(productValidation), productController.createProduct);
router.put('/:id', authenticate, validate(productValidation), productController.updateProduct);
router.delete('/:id', authenticate, productController.deleteProduct);

export default router;
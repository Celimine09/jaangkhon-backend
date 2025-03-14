import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

/**
 * Middleware to validate request data using express-validator
 * 
 * @param {ValidationChain[]} validations - Array of express-validator validation chains
 * @returns {Function} Express middleware function
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Execute all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
      return next();
    }

    // Format validation errors
    const formattedErrors = errors.array().map((error) => {
        // แปลง error ให้เป็น any หรือกำหนด Type เอง
        const err = error as any;
    
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
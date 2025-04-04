import { Request, Response, NextFunction } from 'express';
import { extractTokenFromHeader, verifyToken } from '../utils/jwt.util';
import User from '../model/user.model';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Middleware to protect routes - ensures the request has a valid JWT token
 */
// ใน auth.middleware.ts
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // ดูค่า Authorization header
    console.log('Auth header:', req.headers.authorization);
    
    // แกะ token
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }
    
    // ดูข้อมูลที่แกะได้จาก token
    const decoded = verifyToken(token);
    console.log('Decoded token:', decoded);
    
    if (!decoded) {
      console.log('Invalid token');
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token.' 
      });
    }
    
    // ดูการหาผู้ใช้งานจากฐานข้อมูล
    const user = await User.findByPk((decoded as any).userId, {
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
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error during authentication.' 
    });
  }
};

/**
 * Middleware to ensure user has admin role
 */
export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
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
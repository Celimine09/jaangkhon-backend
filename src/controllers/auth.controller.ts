import authService from '../service/auth.service';
import { Request, Response } from 'express';
import User from '../model/user.model';
import { generateToken } from '../utils/jwt.util';

/**
 * Controller for handling authentication-related requests
 */
class AuthController {
  /**
   * Register a new user
   * 
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      console.log("Registration request body:", req.body);
      const user = await authService.register(req.body);
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed'
      });
    }
  };

  /**
   * Login a user
   * 
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      // Handle specific errors
      if (error instanceof Error) {
        if (error.message === 'User not found' || error.message === 'Invalid password') {
          res.status(401).json({
            success: false,
            message: 'Invalid email or password'
          });
          return;
        }
        
        if (error.message === 'Account is inactive') {
          res.status(403).json({
            success: false,
            message: error.message
          });
          return;
        }
      }
      
      // Generic error handler
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Change user password
   * 
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;
      
      await authService.changePassword(userId, currentPassword, newPassword);
      
      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      // Handle specific errors
      if (error instanceof Error) {
        if (error.message === 'Current password is incorrect') {
          res.status(400).json({
            success: false,
            message: error.message
          });
          return;
        }
        
        if (error.message === 'User not found') {
          res.status(404).json({
            success: false,
            message: error.message
          });
          return;
        }
      }
      
      // Generic error handler
      console.error('Password change error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to change password',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get current user profile
   * 
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      // User is already attached to request by auth middleware
      const user = req.user;
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user profile',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Verify Google sign-in and create or update user
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async googleVerify(req: Request, res: Response): Promise<void> {
    try {
      const { email, name, image } = req.body;
      
      // ตรวจสอบว่ามีผู้ใช้ที่ใช้อีเมลนี้อยู่แล้วหรือไม่
      let user = await User.findOne({ where: { email } });
      
      if (!user) {
        // สร้างผู้ใช้ใหม่ถ้ายังไม่มี
        const username = email.split('@')[0]; // หรือวิธีอื่นในการสร้าง username
        user = await User.create({
          email,
          username,
          firstName: name?.split(' ')[0] || '',
          lastName: name?.split(' ').slice(1).join(' ') || '',
          profileImage: image || '',
          password: '', // สำหรับผู้ใช้ที่สร้างผ่าน OAuth จะไม่มีรหัสผ่าน
          isActive: true,
          role: 'user' // สามารถกำหนดตามความเหมาะสม
        });
      }
      
      // สร้าง token
      const token = generateToken({ 
        userId: user.id, 
        email: user.email,
        role: user.role 
      });
      
      // ส่งข้อมูลกลับไปยัง client
      res.status(200).json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        }
      });
    } catch (error) {
      console.error('Google verify error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to verify Google user',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export default new AuthController();
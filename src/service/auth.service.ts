import { hashPassword, verifyPassword } from '../utils/password.util';
import { generateToken } from '../utils/jwt.util';
import { Op } from 'sequelize';
import User, { UserCreationAttributes } from '../model/user.model';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

/**
 * Service for handling user authentication
 */
class AuthService {
  /**
   * Register a new user
   * 
   * @param {UserCreationAttributes} userData - User data to register
   * @returns {Promise<User>} Created user object
   * @throws {Error} If user already exists or registration fails
   */
  async register(userData: UserCreationAttributes): Promise<User> {
    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email: userData.email },
          { username: userData.username }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === userData.email) {
        throw new Error('Email is already in use');
      } else {
        throw new Error('Username is already taken');
      }
    }

    // Hash password
    userData.password = await hashPassword(userData.password);

    // Create new user
    const user = await User.create(userData);

    return user;
  }

  /**
   * Login a user
   * 
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<LoginResponse>} Login response with token and user data
   * @throws {Error} If login fails or user not found
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.isActive) {
      throw new Error('Account is inactive');
    }

    // ตรวจสอบว่าผู้ใช้มีรหัสผ่านหรือไม่ (กรณีล็อกอินผ่าน OAuth)
    if (!user.password) {
      throw new Error('Please login with Google');
    }

    // Verify password
    const isPasswordValid = await verifyPassword(user.password, password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Generate JWT token
    const token = generateToken({ 
      userId: user.id, 
      email: user.email,
      role: user.role 
    });

    // Return token and user data
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    };
  }

  /**
   * Change user password
   * 
   * @param {number} userId - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} True if password change was successful
   * @throws {Error} If password change fails
   */
  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<boolean> {
    // Find user
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(user.password, currentPassword);

    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await user.update({ password: hashedPassword });

    return true;
  }
}

export default new AuthService();
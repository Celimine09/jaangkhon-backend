import User from '../model/user.model';
import { hashPassword } from '../utils/password.util';

/**
 * Service for user operations
 */
class UserService {
  /**
   * Get all users
   * 
   * @returns {Promise<User[]>} List of all users
   */
  async getAllUsers(): Promise<User[]> {
    return await User.findAll({
      attributes: { exclude: ['password'] }
    });
  }

  /**
   * Get user by ID
   * 
   * @param {number} userId - User ID
   * @returns {Promise<User | null>} User object or null if not found
   */
  async getUserById(userId: number): Promise<User | null> {
    return await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
  }

  /**
   * Update user
   * 
   * @param {number} userId - User ID to update
   * @param {object} userData - User data to update
   * @returns {Promise<User | null>} Updated user or null if not found
   */
  async updateUser(userId: number, userData: Partial<User>): Promise<User | null> {
    // Make sure we don't update sensitive fields
    if (userData.password) {
      delete userData.password;
    }
    if (userData.role) {
      delete userData.role;
    }

    const user = await User.findByPk(userId);
    
    if (!user) {
      return null;
    }

    await user.update(userData);
    
    // Return user without password
    const { password, ...userWithoutPassword } = user.get({ plain: true });
    return userWithoutPassword as User;
  }

  /**
   * Update user role (admin only)
   * 
   * @param {number} userId - User ID to update
   * @param {'user' | 'admin'} role - New role
   * @returns {Promise<User | null>} Updated user or null if not found
   */
  async updateUserRole(userId: number, role: 'user' | 'admin'): Promise<User | null> {
    const user = await User.findByPk(userId);
    
    if (!user) {
      return null;
    }

    await user.update({ role });
    
    // Return user without password
    const { password, ...userWithoutPassword } = user.get({ plain: true });
    return userWithoutPassword as User;
  }

  /**
   * Delete user
   * 
   * @param {number} userId - User ID to delete
   * @returns {Promise<boolean>} True if user was deleted
   */
  async deleteUser(userId: number): Promise<boolean> {
    const result = await User.destroy({
      where: { id: userId }
    });

    return result > 0;
  }

  /**
   * Reset user password (admin only)
   * 
   * @param {number} userId - User ID
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} True if password was reset
   */
  async resetUserPassword(userId: number, newPassword: string): Promise<boolean> {
    const user = await User.findByPk(userId);
    
    if (!user) {
      return false;
    }

    const hashedPassword = await hashPassword(newPassword);
    await user.update({ password: hashedPassword });

    return true;
  }
}

export default new UserService();
import * as argon2 from 'argon2';

/**
 * Hash a password using Argon2
 * @param {string} password - Plain text password to hash
 * @returns {Promise<string>} Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    // Use Argon2id variant which combines protection against side-channel attacks and GPU attacks
    return await argon2.hash(password, {
      type: argon2.argon2id, // Use the Argon2id variant
      memoryCost: 2 ** 16, // 64 MiB memory 
      timeCost: 3, // 3 iterations
      parallelism: 1, // 1 thread
      saltLength: 16, // 16-byte salt
      hashLength: 32, // 32-byte hash
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Password hashing failed');
  }
};

/**
 * Verify a password against a hash
 * @param {string} hash - Stored hash from the database
 * @param {string} password - Plain text password to verify
 * @returns {Promise<boolean>} True if the password matches the hash
 */
export const verifyPassword = async (hash: string, password: string): Promise<boolean> => {
  try {
    return await argon2.verify(hash, password);
  } catch (error) {
    console.error('Error verifying password:', error);
    throw new Error('Password verification failed');
  }
};
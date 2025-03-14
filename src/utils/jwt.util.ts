import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// โหลด environment variables
dotenv.config();

// กำหนด constants สำหรับ JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * ฟังก์ชันสร้าง JWT token
 */
export const generateToken = (payload: object): string => {
  // กำหนดประเภทข้อมูลอย่างชัดเจน
  const jwtOptions: any = { expiresIn: JWT_EXPIRES_IN };
  return jwt.sign(payload, String(JWT_SECRET), jwtOptions);
};

/**
 * ฟังก์ชันตรวจสอบ JWT token
 */
export const verifyToken = (token: string): object | null => {
  try {
    // Type assertion มีความจำเป็นเพื่อให้ TypeScript เข้าใจประเภทข้อมูล
    const secret = JWT_SECRET as string;
    
    return jwt.verify(token, secret) as object;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

/**
 * ฟังก์ชันแยก token จาก Authorization header
 */
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7); // ตัด 'Bearer ' ออก
};
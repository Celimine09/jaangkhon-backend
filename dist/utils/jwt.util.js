"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTokenFromHeader = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
// โหลด environment variables
dotenv_1.default.config();
// กำหนด constants สำหรับ JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
/**
 * ฟังก์ชันสร้าง JWT token
 */
const generateToken = (payload) => {
    // กำหนดประเภทข้อมูลอย่างชัดเจน
    const jwtOptions = { expiresIn: JWT_EXPIRES_IN };
    return jsonwebtoken_1.default.sign(payload, String(JWT_SECRET), jwtOptions);
};
exports.generateToken = generateToken;
/**
 * ฟังก์ชันตรวจสอบ JWT token
 */
const verifyToken = (token) => {
    try {
        // Type assertion มีความจำเป็นเพื่อให้ TypeScript เข้าใจประเภทข้อมูล
        const secret = JWT_SECRET;
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
};
exports.verifyToken = verifyToken;
/**
 * ฟังก์ชันแยก token จาก Authorization header
 */
const extractTokenFromHeader = (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7); // ตัด 'Bearer ' ออก
};
exports.extractTokenFromHeader = extractTokenFromHeader;
//# sourceMappingURL=jwt.util.js.map
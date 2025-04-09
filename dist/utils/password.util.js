"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.hashPassword = void 0;
const argon2 = __importStar(require("argon2"));
/**
 * Hash a password using Argon2
 * @param {string} password - Plain text password to hash
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password) => {
    try {
        // Use Argon2id variant which combines protection against side-channel attacks and GPU attacks
        return await argon2.hash(password, {
            type: argon2.argon2id, // Use the Argon2id variant
            memoryCost: 2 ** 16, // 64 MiB memory 
            timeCost: 3, // 3 iterations
            parallelism: 1, // 1 thread
            hashLength: 32, // 32-byte hash
        });
    }
    catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Password hashing failed');
    }
};
exports.hashPassword = hashPassword;
/**
 * Verify a password against a hash
 * @param {string} hash - Stored hash from the database
 * @param {string} password - Plain text password to verify
 * @returns {Promise<boolean>} True if the password matches the hash
 */
const verifyPassword = async (hash, password) => {
    try {
        return await argon2.verify(hash, password);
    }
    catch (error) {
        console.error('Error verifying password:', error);
        throw new Error('Password verification failed');
    }
};
exports.verifyPassword = verifyPassword;
//# sourceMappingURL=password.util.js.map
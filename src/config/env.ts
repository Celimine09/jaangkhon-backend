import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const env = {
  // Server settings
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database settings
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '5432'),
  DB_NAME: process.env.DB_NAME || 'jangkhon_db',
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
  
  // JWT settings
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_key_not_secure',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // CORS settings
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000'
};

export default env;
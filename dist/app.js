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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importStar(require("./config/database"));
const env_1 = __importDefault(require("./config/env"));
// Import routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
// Load environment variables
dotenv_1.default.config();
// Initialize Express application
const app = (0, express_1.default)();
const PORT = env_1.default.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({
    origin: true, // หรือใช้ '*'
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/products', product_routes_1.default);
// Root route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to Jangkhon API',
        version: '1.0.0',
        status: 'online'
    });
});
// Handle 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});
// Initialize database and start the server
const initializeApp = async () => {
    try {
        // Test database connection
        await (0, database_1.testConnection)();
        // Sync models with database (development only)
        if (env_1.default.NODE_ENV === 'development') {
            await database_1.default.sync({ alter: true });
            
        }
        // Start the server
        app.listen(PORT, () => {
            
        });
    }
    catch (error) {
        console.error('Failed to initialize application:', error);
        process.exit(1);
    }
};
// Start the application
initializeApp();
exports.default = app;
//# sourceMappingURL=app.js.map
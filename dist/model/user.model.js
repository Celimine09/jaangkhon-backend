"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
// User model class
class User extends sequelize_1.Model {
}
// Initialize User model
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
    },
    profileImage: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    role: {
        type: sequelize_1.DataTypes.ENUM('user', 'admin', 'freelancer'),
        defaultValue: 'user',
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    sequelize: database_1.default,
    tableName: 'users',
    timestamps: true,
    indexes: [
        {
            name: 'users_email_idx',
            unique: true,
            fields: ['email'],
        },
        {
            name: 'users_username_idx',
            unique: true,
            fields: ['username'],
        },
    ],
});
exports.default = User;
//# sourceMappingURL=user.model.js.map
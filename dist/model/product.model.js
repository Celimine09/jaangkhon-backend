"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const user_model_1 = __importDefault(require("./user.model"));
// Product model class
class Product extends sequelize_1.Model {
}
// Initialize Product model
Product.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    price: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    imageUrl: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    category: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    stock: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    sequelize: database_1.default,
    tableName: 'products',
    timestamps: true,
    indexes: [
        {
            name: 'products_category_idx',
            fields: ['category'],
        },
        {
            name: 'products_userId_idx',
            fields: ['userId'],
        },
    ],
});
// กำหนดความสัมพันธ์กับโมเดล User (อย่าลืม import User model)
Product.belongsTo(user_model_1.default, { foreignKey: 'userId' });
user_model_1.default.hasMany(Product, { foreignKey: 'userId' });
exports.default = Product;
//# sourceMappingURL=product.model.js.map
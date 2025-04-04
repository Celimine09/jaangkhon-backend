"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/service/product.service.ts
const product_model_1 = __importDefault(require("../model/product.model"));
const user_model_1 = __importDefault(require("../model/user.model"));
/**
 * Service for handling product operations
 */
class ProductService {
    /**
     * Get all products
     *
     * @param {string} category - Optional category filter
     * @param {number} userId - Optional user ID filter to get products by a specific user
     * @returns {Promise<Product[]>} Array of products
     */
    async getProducts(category, userId) {
        const whereClause = { isActive: true };
        if (category) {
            whereClause.category = category;
        }
        if (userId) {
            whereClause.userId = userId;
        }
        const products = await product_model_1.default.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: user_model_1.default,
                    attributes: ['id', 'username', 'email']
                }
            ]
        });
        return products;
    }
    /**
     * Get product by ID
     *
     * @param {number} id - Product ID
     * @returns {Promise<Product>} Product object
     * @throws {Error} If product not found
     */
    async getProductById(userId) {
        const product = await product_model_1.default.findOne({
            where: { userId, isActive: true },
            include: [
                {
                    model: user_model_1.default,
                    attributes: ['id', 'username', 'email']
                }
            ]
        });
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }
    /**
     * Create a new product
     *
     * @param {ProductCreationAttributes} productData - Product data
     * @returns {Promise<Product>} Created product
     */
    async createProduct(productData) {
        if (!productData.userId) {
            throw new Error('User ID is required to create a product');
        }
        // Verify user exists
        const user = await user_model_1.default.findByPk(productData.userId);
        if (!user) {
            throw new Error('User not found');
        }
        const product = await product_model_1.default.create(productData);
        return product;
    }
    /**
     * Update an existing product
     *
     * @param {number} id - Product ID
     * @param {Partial<ProductCreationAttributes>} productData - Product data to update
     * @param {number} requestUserId - ID of user making the request
     * @returns {Promise<Product>} Updated product
     * @throws {Error} If product not found or user not authorized
     */
    async updateProduct(id, productData, requestUserId) {
        const product = await this.getProductById(id);
        // Check if user is authorized to update this product
        if (product.userId !== requestUserId) {
            // Allow admin to update any product
            const user = await user_model_1.default.findByPk(requestUserId);
            if (!user || user.role !== 'admin') {
                throw new Error('You are not authorized to update this product');
            }
        }
        // Don't allow changing userId
        if (productData.userId && productData.userId !== product.userId) {
            throw new Error('Changing product owner is not allowed');
        }
        await product.update(productData);
        return product;
    }
    /**
     * Delete a product (soft delete by setting isActive to false)
     *
     * @param {number} id - Product ID
     * @param {number} requestUserId - ID of user making the request
     * @returns {Promise<boolean>} True if successful
     * @throws {Error} If product not found or user not authorized
     */
    async deleteProduct(id, requestUserId) {
        const product = await this.getProductById(id);
        // Check if user is authorized to delete this product
        if (product.userId !== requestUserId) {
            // Allow admin to delete any product
            const user = await user_model_1.default.findByPk(requestUserId);
            if (!user || user.role !== 'admin') {
                throw new Error('You are not authorized to delete this product');
            }
        }
        await product.update({ isActive: false });
        return true;
    }
    /**
     * Get products by user ID
     *
     * @param {number} userId - User ID
     * @returns {Promise<Product[]>} Array of products
     */
    async getProductsByUser(userId) {
        return this.getProducts(undefined, userId);
    }
}
exports.default = new ProductService();
//# sourceMappingURL=product.service.js.map
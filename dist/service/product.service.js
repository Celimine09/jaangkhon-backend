"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/service/product.service.ts
const product_model_1 = __importDefault(require("../model/product.model"));
/**
 * Service for handling product operations
 */
class ProductService {
    /**
     * Get all products
     *
     * @param {string} category - Optional category filter
     * @returns {Promise<Product[]>} Array of products
     */
    async getProducts(category) {
        const whereClause = category ? { category, isActive: true } : { isActive: true };
        const products = await product_model_1.default.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']]
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
    async getProductById(id) {
        const product = await product_model_1.default.findOne({
            where: { id, isActive: true }
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
        const product = await product_model_1.default.create(productData);
        return product;
    }
    /**
     * Update an existing product
     *
     * @param {number} id - Product ID
     * @param {Partial<ProductCreationAttributes>} productData - Product data to update
     * @returns {Promise<Product>} Updated product
     * @throws {Error} If product not found
     */
    async updateProduct(id, productData) {
        const product = await this.getProductById(id);
        await product.update(productData);
        return product;
    }
    /**
     * Delete a product (soft delete by setting isActive to false)
     *
     * @param {number} id - Product ID
     * @returns {Promise<boolean>} True if successful
     * @throws {Error} If product not found
     */
    async deleteProduct(id) {
        const product = await this.getProductById(id);
        await product.update({ isActive: false });
        return true;
    }
}
exports.default = new ProductService();
//# sourceMappingURL=product.service.js.map
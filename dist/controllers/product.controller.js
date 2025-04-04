"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_service_1 = __importDefault(require("../service/product.service"));
/**
 * Controller for handling product-related requests
 */
class ProductController {
    /**
     * Get all products
     *
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     */
    async getProducts(req, res) {
        try {
            const category = req.query.category;
            const userId = req.query.userId ? parseInt(req.query.userId) : undefined;
            const products = await product_service_1.default.getProducts(category, userId);
            res.status(200).json({
                success: true,
                data: products
            });
        }
        catch (error) {
            console.error('Get products error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get products',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Get product by ID
     *
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     */
    async getProductById(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid product ID'
                });
                return;
            }
            const product = await product_service_1.default.getProductById(id);
            res.status(200).json({
                success: true,
                data: product
            });
        }
        catch (error) {
            if (error instanceof Error && error.message === 'Product not found') {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
                return;
            }
            console.error('Get product error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get product',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Create a new product
     *
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     */
    async createProduct(req, res) {
        try {
            const productData = req.body;
            // ใช้ user ID จาก req.user ที่ได้มาจาก auth middleware
            productData.userId = req.user.id;
            const product = await product_service_1.default.createProduct(productData);
            res.status(201).json({
                success: true,
                message: 'Product created successfully',
                data: product
            });
        }
        catch (error) {
            console.error('Create product error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create product',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Update an existing product
     *
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     */
    async updateProduct(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid product ID'
                });
                return;
            }
            const productData = req.body;
            // ส่ง userId ของคนที่ทำคำขอไปด้วยเพื่อตรวจสอบสิทธิ์
            const product = await product_service_1.default.updateProduct(id, productData, req.user.id);
            res.status(200).json({
                success: true,
                message: 'Product updated successfully',
                data: product
            });
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Product not found') {
                    res.status(404).json({
                        success: false,
                        message: error.message
                    });
                    return;
                }
                if (error.message === 'You are not authorized to update this product') {
                    res.status(403).json({
                        success: false,
                        message: error.message
                    });
                    return;
                }
            }
            console.error('Update product error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update product',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Delete a product
     *
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     */
    async deleteProduct(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid product ID'
                });
                return;
            }
            // ส่ง userId ของคนที่ทำคำขอไปด้วยเพื่อตรวจสอบสิทธิ์
            await product_service_1.default.deleteProduct(id, req.user.id);
            res.status(200).json({
                success: true,
                message: 'Product deleted successfully'
            });
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Product not found') {
                    res.status(404).json({
                        success: false,
                        message: error.message
                    });
                    return;
                }
                if (error.message === 'You are not authorized to delete this product') {
                    res.status(403).json({
                        success: false,
                        message: error.message
                    });
                    return;
                }
            }
            console.error('Delete product error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete product',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Get products by user
     *
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     */
    async getProductsByUser(req, res) {
        try {
            const userId = parseInt(req.params.userId);
            if (isNaN(userId)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid user ID'
                });
                return;
            }
            const products = await product_service_1.default.getProductsByUser(userId);
            res.status(200).json({
                success: true,
                data: products
            });
        }
        catch (error) {
            console.error('Get products by user error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get products',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}
exports.default = new ProductController();
//# sourceMappingURL=product.controller.js.map
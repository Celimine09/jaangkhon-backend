// src/controllers/product.controller.ts
import { Request, Response } from 'express';
import productService from '../service/product.service';

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
  async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const category = req.query.category as string | undefined;
      const products = await productService.getProducts(category);
      
      res.status(200).json({
        success: true,
        data: products
      });
    } catch (error) {
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
  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid product ID'
        });
        return;
      }
      
      const product = await productService.getProductById(id);
      
      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
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
  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const productData = req.body;
      const product = await productService.createProduct(productData);
      
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });
    } catch (error) {
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
  async updateProduct(req: Request, res: Response): Promise<void> {
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
      const product = await productService.updateProduct(id, productData);
      
      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: product
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Product not found') {
        res.status(404).json({
          success: false,
          message: error.message
        });
        return;
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
  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid product ID'
        });
        return;
      }
      
      await productService.deleteProduct(id);
      
      res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Product not found') {
        res.status(404).json({
          success: false,
          message: error.message
        });
        return;
      }
      
      console.error('Delete product error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete product',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export default new ProductController();
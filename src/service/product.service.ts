// src/service/product.service.ts
import Product, { ProductCreationAttributes } from '../model/product.model';
import User from '../model/user.model';

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
  async getProducts(category?: string, userId?: number): Promise<Product[]> {
    const whereClause: any = { isActive: true };
    
    if (category) {
      whereClause.category = category;
    }
    
    if (userId) {
      whereClause.userId = userId;
    }
    
    const products = await Product.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
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
  async getProductById(id: number): Promise<Product> {
    const product = await Product.findOne({
      where: { id, isActive: true },
      include: [
        {
          model: User,
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
  async createProduct(productData: ProductCreationAttributes): Promise<Product> {
    if (!productData.userId) {
      throw new Error('User ID is required to create a product');
    }
    
    // Verify user exists
    const user = await User.findByPk(productData.userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const product = await Product.create(productData);
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
  async updateProduct(
    id: number, 
    productData: Partial<ProductCreationAttributes>,
    requestUserId: number
  ): Promise<Product> {
    const product = await this.getProductById(id);
    
    // Check if user is authorized to update this product
    if (product.userId !== requestUserId) {
      // Allow admin to update any product
      const user = await User.findByPk(requestUserId);
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
  async deleteProduct(id: number, requestUserId: number): Promise<boolean> {
    const product = await this.getProductById(id);
    
    // Check if user is authorized to delete this product
    if (product.userId !== requestUserId) {
      // Allow admin to delete any product
      const user = await User.findByPk(requestUserId);
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
  async getProductsByUser(userId: number): Promise<Product[]> {
    return this.getProducts(undefined, userId);
  }
}

export default new ProductService();
// src/service/product.service.ts
import Product, { ProductCreationAttributes } from '../model/product.model';

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
  async getProducts(category?: string): Promise<Product[]> {
    const whereClause = category ? { category, isActive: true } : { isActive: true };
    
    const products = await Product.findAll({
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
  async getProductById(id: number): Promise<Product> {
    const product = await Product.findOne({
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
  async createProduct(productData: ProductCreationAttributes): Promise<Product> {
    const product = await Product.create(productData);
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
  async updateProduct(id: number, productData: Partial<ProductCreationAttributes>): Promise<Product> {
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
  async deleteProduct(id: number): Promise<boolean> {
    const product = await this.getProductById(id);
    
    await product.update({ isActive: false });
    
    return true;
  }
}

export default new ProductService();
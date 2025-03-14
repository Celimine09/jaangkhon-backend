import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

// Product attributes interface
export interface ProductAttributes {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  stock: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define which attributes are optional during creation
export interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'imageUrl' | 'isActive' | 'createdAt' | 'updatedAt'> {}

// Product model class
class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public imageUrl!: string | undefined;
  public category!: string;
  public stock!: number;
  public isActive!: boolean;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize Product model
Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'products',
    timestamps: true,
    indexes: [
      {
        name: 'products_category_idx',
        fields: ['category'],
      },
    ],
  }
);

export default Product;
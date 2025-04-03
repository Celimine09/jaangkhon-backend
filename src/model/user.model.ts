import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

// User attributes interface
export interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  role: 'user' | 'admin' | 'freelancer';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define which attributes can be null during creation (excludes auto-generated fields)
export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'role' | 'isActive' | 'createdAt' | 'updatedAt'> {}

// User model class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public firstName!: string | undefined;
  public lastName!: string | undefined;
  public profileImage!: string | undefined;
  public role!: 'user' | 'admin' | 'freelancer';
  public isActive!: boolean;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize User model
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    profileImage: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin', 'freelancer'),
      defaultValue: 'user',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
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
  }
);

export default User;
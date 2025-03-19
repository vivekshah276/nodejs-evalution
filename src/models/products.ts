import sequelize from "../util/database";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import Category_Product from "./category_products";
import User from "./user";

interface ProductAttributes {
  id: number;
  name: string;
  price: Float32Array;
  rating: Float32Array | null;
  discount: Float32Array | null;

  userId: number;
  categoryId: number;
}

interface ProductActivationAttributes
  extends Optional<ProductAttributes, "id"> {}

class Product
  extends Model<ProductAttributes, ProductActivationAttributes>
  implements ProductAttributes
{
  public id!: number;
  public name!: string;
  public price!: Float32Array;
  public rating!: Float32Array | null;
  public discount!: Float32Array | null;

  public userId!: number;
  public categoryId!: number;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category_Product,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  { sequelize, tableName: "products", timestamps: true }
);

export default Product;

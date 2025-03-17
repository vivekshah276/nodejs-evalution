import sequelize from "../util/database";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface ProductAttributes {
  id: number;
  name: string;
  price: Float32Array;
  rating: Float32Array | null;
  discount: Float32Array | null;
  category: string;
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
  public category!: string;
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
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    categoryId:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references: {
        model: "category_products",
        key:"id"
      },
      onDelete:"CASCADE"
    }
  },
  { sequelize, tableName: "products", timestamps: true }
);

export default Product;

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../util/database";

interface CategoryAttributes {
  id: number;
  name: string;
  description: string;
}

interface CategoryActivationAttribute
  extends Optional<CategoryAttributes, "id"> {}

class Category_Product
  extends Model<CategoryAttributes, CategoryActivationAttribute>
  implements CategoryAttributes
{
  id!: number;
  name!: string;
  description!: string;
}

Category_Product.init(
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
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { sequelize, tableName: "category_products", timestamps: true }
);

export default Category_Product;

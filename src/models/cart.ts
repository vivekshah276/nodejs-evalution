import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../util/database";
import User from "./user";

interface CartAttributes {
  id: number;
  userId: number;
}

interface CartActivationAttribute extends Optional<CartAttributes, "id"> {}

class Cart
  extends Model<CartAttributes, CartActivationAttribute>
  implements CartAttributes
{
  id!: number;
  userId!: number;
  CartItems: any;
}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
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
  },
  { sequelize, tableName: "cart", timestamps: true }
);

export default Cart;

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../util/database";
import Product from "./products";
import Cart from "./cart";

interface CartItemsAttributes {
  id: number;
  quantity: number;
  productId: number;
  cartId: number;
}

interface CartItemsActivationAttribute
  extends Optional<CartItemsAttributes, "id"> {}

class CartItems
  extends Model<CartItemsAttributes, CartItemsActivationAttribute>
  implements CartItemsAttributes
{
  id!: number;
  quantity!: number;
  productId!: number;
  cartId!: number;
}

CartItems.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Cart,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  { sequelize, tableName: "cartitems", timestamps: true }
);

export default CartItems;

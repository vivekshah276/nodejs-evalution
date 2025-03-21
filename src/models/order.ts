import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../util/database";
import User from "./user";

interface OrderAttributes {
  id: number;
  userId: number;
  totalAmount: number;
  isCancelled: boolean;
  status: string;
}
interface OrderActivationAttributes extends Optional<OrderAttributes, "id"> {}

class Order
  extends Model<OrderAttributes, OrderActivationAttributes>
  implements OrderAttributes
{
  id!: number;
  userId!: number;
  totalAmount!: number;
  isCancelled!: boolean;
  status!: string;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    isCancelled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
  },
  { sequelize, tableName: "orders", timestamps: true }
);

User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

export default Order;

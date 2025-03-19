import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../util/database";
import User from "./user";
import Product from "./products";

interface ReviewsAttributes {
  id: number;
  review: string;
  rating: Float32Array;
  userId: number;
  productId: number;
}

interface Reviewsactivationattribute
  extends Optional<ReviewsAttributes, "id"> {}

class Reviews
  extends Model<ReviewsAttributes, Reviewsactivationattribute>
  implements ReviewsAttributes
{
  id!: number;
  review!: string;
  rating!: Float32Array;
  userId!: number;
  productId!: number;
}

Reviews.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
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
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  { sequelize, timestamps: true, tableName: "reviews" }
);

export default Reviews;

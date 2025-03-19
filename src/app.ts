import express from "express";
import { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import sequelize from "./util/database";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";
import User from "./models/user.js";
import Product from "./models/products.js";
import Category_Product from "./models/category_products";
import productRoutes from "./routes/products.js";
import Cart from "./models/cart";
import CartItems from "./models/cartItems";
import Reviews from "./models/reviews";

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use("/seabasket", authRoutes);
app.use("/seabasket", productRoutes);

Product.belongsTo(User, {
  constraints: true,
  onDelete: "CASCADE",
  foreignKey: "userId",
});
User.hasMany(Product, { foreignKey: "userId" });
Product.belongsTo(Category_Product, {
  constraints: true,
  onDelete: "CASCADE",
  foreignKey: "categoryId",
});
Category_Product.hasMany(Product, { foreignKey: "categoryId" });

//Reviews association
User.hasMany(Reviews, { foreignKey: "userId" });
Product.hasMany(Reviews, { foreignKey: "productId" });
Reviews.belongsTo(User, { foreignKey: "userId" });

// A User has ONE Cart
User.hasOne(Cart, { foreignKey: "userId", onDelete: "CASCADE" });
Cart.belongsTo(User, { foreignKey: "userId" });

// A Cart contains multiple CartItems (One-to-Many)
Cart.hasMany(CartItems, { foreignKey: "cartId", onDelete: "CASCADE" });
CartItems.belongsTo(Cart, { foreignKey: "cartId" });

// A Product can be in multiple CartItems (One-to-Many)
Product.hasMany(CartItems, { foreignKey: "productId", onDelete: "CASCADE" });
CartItems.belongsTo(Product, { foreignKey: "productId" });

//error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ message: "Error in internal server" });
});

const startServer = async () => {
  try {
    await sequelize.sync();
    app.listen(process.env.PORT);
  } catch (err: any) {
    throw new Error(err);
  }
};
startServer();

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
import associations from "./models/associations";

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use("/seabasket", authRoutes);
app.use("/seabasket", productRoutes);

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

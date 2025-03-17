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

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use("/seabasket", authRoutes);
app.use("/seabasket", productRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: err.message });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ message: "Error in internal server" });
});

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

const startServer = async () => {
  try {
    await sequelize.sync();
    console.log("Database Connected");
    app.listen(process.env.PORT, () => {
      console.log("Server is listening");
    });
  } catch (err) {
    console.log(err);
  }
};
startServer();

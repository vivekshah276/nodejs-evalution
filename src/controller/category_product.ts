import { Request, Response, NextFunction } from "express";
import Category_Product from "../models/category_products";

interface CustomError extends Error {
  statusCode: number;
}

//get all the category list - Home
export const getCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allCategory = await Category_Product.findAll();
  if (!allCategory) {
    throw new Error("No Category Product");
  }
  res.status(200).json({ success: true, allCategory: allCategory });
};

//add the categories
export const addCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, description } = req.body;
  try {
    const category = await Category_Product.create({ name, description });
    res.status(201).json({ success: true, category: category });
  } catch (err: unknown) {
    const error = err as CustomError;
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

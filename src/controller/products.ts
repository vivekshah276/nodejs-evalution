import { Request, Response, NextFunction } from "express";
import Product from "../models/products";
import Category_Product from "../models/category_products";
import { Op } from "sequelize";

interface CustomError extends Error {
  statusCode?: number;
}

//Fetch all the products - Product Listing
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allProducts = await Product.findAll();
    res.status(200).json({ success: true, allproducts: allProducts });
  } catch (err: unknown) {
    const error = err as CustomError;
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

//fetch single product detail - Product Listing & Product Details
export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prodId = req.params.productId;
  try {
    console.log(prodId);
    const product = await Product.findByPk(prodId);
    console.log(product);

    res.status(200).json({ success: true, product: product });
  } catch (err: unknown) {
    const error = err as CustomError;
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

//create a product 
export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, price, rating, discount, category } = req.body;
  const userId = req.user.id;
  try {
    const categoryProduct = await Category_Product.findOne({
      where: { name: category },
    });
    if (!categoryProduct) {
      const error: CustomError = new Error("Category Not found");
      error.statusCode = 404;
      throw error;
    }
    const categoryId = categoryProduct.id;
    const product = await Product.create({
      name,
      price,
      rating,
      discount,
      userId,
      categoryId,
    });
    res.status(201).json({ success: true, product: product });
    return;
  } catch (err: unknown) {
    const error = err as CustomError;
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};


//filter and sorting the products - Product Listing
export const filterProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { minPrice, maxPrice, minRating, minDiscount, category, sortBy } =
    req.query;
  const whereClause: Record<string, any> = {};
  const orderClause: any = [];

  try {
    if (minPrice && maxPrice) {
      whereClause.price = {
        [Op.gte]: parseFloat(minPrice as string),
        [Op.lte]: parseFloat(maxPrice as string),
      }};

      if (minRating) {
        whereClause.rating = {
          [Op.lte]: parseFloat(minRating as string),
        };
      }

      if (minDiscount) {
        whereClause.discount = {
          [Op.lte]: parseFloat(minDiscount as string),
        };
      }

      if (category) {
        whereClause.category = category;
      }

      if (sortBy === "price_asc") {
        orderClause.push(["price", "ASC"]);
      } else if (sortBy === "price_desc") {
        orderClause.push(["price", "DESC"]);
      } else if (sortBy === "name_asc") {
        orderClause.push(["name", "ASC"]);
      } else if (sortBy === "name_desc") {
        orderClause.push(["name", "DESC"]);
      }

      const product = await Product.findAll({
        where: whereClause,
        order: orderClause,
      });
      res.status(200).json({ success: true, product: product });
    
  } catch (err: unknown) {
    const error = err as CustomError;
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};


//Search the product - Home
export const searchProduct = async (req:Request, res:Response, next:NextFunction):Promise<void>=>{
  const {name} = req.body;
  try{
    const product = await Product.findOne({where:{name}});
    const category = await Category_Product.findOne({where:{name}})

    if(!product && !category){
      res.status(404).json({success:false, message:"No products Found"})
      return;
    }
    res.status(200).json({success:true, product, category})
    return;
  }
  catch(err:unknown){
    const error = err as CustomError;
    if(!error.statusCode){
      error.statusCode = 500;
    }
    next(error)
  }
}

import { Request, Response, NextFunction } from "express";
import Product from "../models/products";
import Category_Product from "../models/category_products";
import Cart from "../models/cart";
import { Op, or, where } from "sequelize";
import CartItems from "../models/cartItems";
import Reviews from "../models/reviews";
import Order from "../models/order";
import OrderItem from "../models/orderItems";

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
    const product = await Product.findByPk(prodId);

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
      };
    }

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

//getting the trending products
export const trendingProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const trendProducts = await Product.findAll({
      where: { rating: { [Op.gte]: 4 } },
      limit: 10,
      order: [["updatedAt", "DESC"]],
    });
    if (trendProducts.length === 0 || !trendProducts) {
      res.status(404).json({ error: "No trending products found" });
      return;
    }
    res.status(200).json({ success: true, trendProducts });
  } catch (err: unknown) {
    const error = err as CustomError;
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

//review posting
export const postReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = Number(req.params.productId);
    const prod = await Product.findByPk(productId);
    if (!prod) {
      const error = new Error("No product") as CustomError;
      error.statusCode = 404;
      throw error;
    }
    const { rating, review } = req.body;
    const reviews = await Reviews.create({
      rating,
      review,
      userId: req.user.id,
      productId,
    });
    reviews.save();
    res.status(200).json({ success: true, reviews });
  } catch (err: unknown) {
    const error = err as CustomError;
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

//getting review
export const getReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const productId = req.params.productId;
    const prod = await Product.findByPk(productId);
    if (!prod) {
      const error = new Error("No product") as CustomError;
      error.statusCode = 404;
      throw error;
    }
    const review = await Reviews.findOne({ where: { productId: productId } });
    if (!review) {
      const error = new Error("No review for this product yet") as CustomError;
      error.statusCode = 400;
      throw error;
    }
    res.status(200).json({ success: true, review });
  } catch (err: unknown) {
    const error = err as CustomError;
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

//Search the product - Home
export const searchProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name } = req.body;
  try {
    const product = await Product.findOne({ where: { name } });
    const category = await Category_Product.findOne({ where: { name } });

    if (!product && !category) {
      res.status(404).json({ success: false, message: "No products Found" });
      return;
    }
    res.status(200).json({ success: true, product, category });
    return;
  } catch (err: unknown) {
    const error = err as CustomError;
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// post Cart
export const postCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      const error = new Error("Product and Quantity required") as CustomError;
      error.statusCode = 400;
      throw error;
    }
    let cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id });
    }
    let cartItem = await CartItems.findOne({
      where: { cartId: cart.id, productId },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItems.create({
        cartId: cart.id,
        productId: productId,
        quantity: quantity,
      });
      cartItem.save();
    }
    res
      .status(200)
      .json({ success: true, cartItem, message: "Product added to cart" });
  } catch (err: unknown) {
    const error = (err = err as CustomError);
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

//get Cart
export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    //it will find the cart of requested used then with the help of association access the cartitems model and get all the products
    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: CartItems,
          include: [
            {
              model: Product,
              attributes: ["id", "name", "price", "rating", "discount"],
            },
          ],
        },
      ],
    });
    if (!cart) {
      const error = new Error("No Product in Cart") as CustomError;
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ success: true, cart: cart });
  } catch (err: unknown) {
    const error = err as CustomError;
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

//create order
export const postOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: CartItems,
          include: [
            { model: Product, attributes: ["id", "name", "price", "discount"] },
          ],
        },
      ],
    });

    if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
      const error = new Error("No Products in Cart") as CustomError;
      error.statusCode = 400;
      throw error;
    }

    const order = await Order.create({
      userId: req.user.id,
      totalAmount: cart.CartItems.reduce((acc: number, item: any) => {
        return acc + item.quantity * item.Product.price;
      }, 0),

      isCancelled: false,
      status: "Pending",
    });

    const orderItems = await cart.CartItems.map((item: any) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.Product.price,
    }));

    await OrderItem.bulkCreate(orderItems);
    await CartItems.destroy({ where: { cartId: cart.id } });
    res.status(200).json({ success: true, order: order });
  } catch (err: unknown) {
    const error = err as CustomError;
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// getOrders
export const getOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      attributes: ["id", "isCancelled", "status"],
      include: {
        model: OrderItem,
        attributes: ["productId", "quantity"],
        include: [
          {
            model: Product,
            attributes: ["price"],
          },
        ],
      },
    });
    if (!orders || orders.length === 0) {
      res.status(404).json({ message: "You haven't ordered yet!" });
      return;
    }

    res.status(200).json({ success: true, orders });
  } catch (err: unknown) {
    const error = err as CustomError;
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

export const orderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orderId = req.params.orderId;
    const action = req.query.action;

    if (action === "cancel") {
      const order = await Order.update(
        { isCancelled: true },
        { where: { id: orderId } }
      );
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      const error = new Error("No orders yet") as CustomError;
      error.statusCode = 404;
      throw error;
    }
    const orderDetails = await OrderItem.findAll({
      where: { orderId },
      attributes: ["productId", "quantity"],
      include: [
        {
          model: Product,
          attributes: ["price"],
        },
      ],
    });

    const orderStatus = await Order.findOne({
      where: { id: orderId },
      attributes: ["status"],
    });

    res.status(200).json({ success: true, orderDetails, orderStatus });
  } catch (err: unknown) {
    const error = err as CustomError;
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

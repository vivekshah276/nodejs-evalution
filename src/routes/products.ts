import { Router } from "express";
import {
  addProduct,
  filterProducts,
  getCart,
  getOrder,
  getProduct,
  getProducts,
  getReview,
  orderDetails,
  postCart,
  postOrder,
  postReview,
  searchProduct,
  trendingProducts,
} from "../controller/products";
import { addCategory, getCategory } from "../controller/category_product";
import isAuth from "../middleware/is-auth";

const router = Router();

router.get("/products", getProducts);
router.post("/addproduct", isAuth, addProduct);
router.get("/product/:productId", getProduct);

router.get("/category", getCategory);
router.post("/addcategory", isAuth, addCategory);

router.get("/products/filter", filterProducts);
router.get("/search", searchProduct);

router.get("/trendingproducts", trendingProducts);

router.get("/products/:productId/review", getReview);
router.post("/products/:productId/review", isAuth, postReview);

router.get("/cart", isAuth, getCart);
router.post("/cart", isAuth, postCart);

router.post("/order", isAuth, postOrder);
router.get("/order", isAuth, getOrder);
router.get("/order/:orderId", isAuth, orderDetails);

export default router;

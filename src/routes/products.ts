import { Router } from "express";
import { addProduct, filterProducts, getProduct, getProducts, searchProduct } from "../controller/products";
import { addCategory, getCategory } from "../controller/category_product";
import isAuth from "../middleware/is-auth";

const router = Router();

router.get("/products",getProducts)
router.post("/addproduct",isAuth,addProduct);
router.get("/product/:productId",getProduct);

router.get("/category",getCategory)
router.post("/addcategory",isAuth,addCategory);

router.get("/products/filter",filterProducts);
router.get("/search",searchProduct)

export default router;

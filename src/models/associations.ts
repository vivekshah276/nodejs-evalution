import Product from "./products";
import Category_Product from "./category_products";
import User from "./user";
import Reviews from "./reviews";
import Cart from "./cart";
import CartItems from "./cartItems";

// Product - User
Product.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(Product, { foreignKey: "userId" });

// Product - Category_Product
Product.belongsTo(Category_Product, { foreignKey: "categoryId", onDelete: "CASCADE" });
Category_Product.hasMany(Product, { foreignKey: "categoryId" });

// Product - Reviews
Product.hasMany(Reviews, { foreignKey: "productId" });
Reviews.belongsTo(Product, { foreignKey: "productId" });

// User - Reviews
User.hasMany(Reviews, { foreignKey: "userId" });
Reviews.belongsTo(User, { foreignKey: "userId" });

// Cart - User
User.hasOne(Cart, { foreignKey: "userId", onDelete: "CASCADE" });
Cart.belongsTo(User, { foreignKey: "userId" });

// Cart - CartItems
Cart.hasMany(CartItems, { foreignKey: "cartId", onDelete: "CASCADE" });
CartItems.belongsTo(Cart, { foreignKey: "cartId" });

// Product - CartItems
Product.hasMany(CartItems, { foreignKey: "productId", onDelete: "CASCADE" });
CartItems.belongsTo(Product, { foreignKey: "productId" });

export default {};

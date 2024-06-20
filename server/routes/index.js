const Router = require("express");
const router = new Router();
const userRouter = require("./userRouter.js");
const restaurantRouter = require("./restaurantRouter.js");
const techCardRouter = require("./techCardRouter.js");
const tableRouter = require("./tableRouter.js");
const menuItemRouter = require("./menuItemRouter.js"); 
const systemUserRouter = require("./systemUserRouter.js"); 
const orderRouter = require("./orderRouter.js")

router.use("/users", userRouter);
router.use("/users/restaurants", restaurantRouter);
router.use("/users/restaurants/techCards", techCardRouter);
router.use("/users/restaurants/tables", tableRouter);
router.use("/users/restaurants/menuItems", menuItemRouter); 
router.use("/users/restaurants/systemUsers", systemUserRouter); 
router.use("/users/restaurants/orders", orderRouter)

module.exports = router;

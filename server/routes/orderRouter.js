const Router = require("express");
const router = new Router();
const orderController = require("../controllers/orderController");

// router.post("/createOrder", orderController.createOrder);

router.post("/getOrdersByRestaurantId", orderController.getOrdersByRestaurantId);
router.post("/createEmptyOrder", orderController.createEmptyOrder)
router.delete("/deleteOrder", orderController.deleteOrder)
router.post("/createOrderMenuItem", orderController.createOrderMenuItem)
router.delete("/deleteOrderMenuItem", orderController.deleteOrderMenuItem)
router.put("/updateOrderMenuItem", orderController.updateOrderMenuItem)
router.put("/updateOrderMenuItems", orderController.updateOrderMenuItems)
router.put("/updateOrder", orderController.updateOrder)
router.post("/calculateOrderTotal", orderController.calculateOrderTotal)

module.exports = router;

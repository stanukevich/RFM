const Router = require("express");
const router = new Router();
const menuItemController = require("../controllers/MenuItemController");

router.post("/createMenuItem", menuItemController.createMenuItem);
router.delete("/deleteMenuItem", menuItemController.deleteMenuItem);
router.put("/updateMenuItem", menuItemController.updateMenuItem);
router.post("/getMenuItemsByRestaurantId", menuItemController.getMenuItemsByRestaurantId);

module.exports = router;

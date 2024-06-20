const Router = require("express");
const router = new Router();
const systemUserController = require("../controllers/SystemUserController");

router.post("/createSystemUser", systemUserController.createSystemUser);
router.delete("/deleteSystemUser", systemUserController.deleteSystemUser);
router.put("/updateSystemUser", systemUserController.updateSystemUser);
router.post("/getSystemUsersByRestaurantId", systemUserController.getSystemUsersByRestaurantId);

module.exports = router;

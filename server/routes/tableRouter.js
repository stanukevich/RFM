const Router = require("express");
const router = new Router();
const tableController = require("../controllers/tableController.js");

router.post("/createTable", tableController.createTable);
router.delete("/deleteTable", tableController.deleteTable);
router.put("/updateTable", tableController.updateTable);
router.post("/getTablesByRestaurantId", tableController.getTablesByRestaurantId);
router.post("/syncTables", tableController.syncTables);

module.exports = router;
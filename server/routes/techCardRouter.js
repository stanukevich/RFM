const Router = require("express");
const router = new Router();
const techCardController = require("../controllers/techCardController.js");

router.post("/createTechCard", techCardController.createTechCard);
router.delete("/deleteTechCard", techCardController.deleteTechCard);
router.put("/updateTechCard", techCardController.updateTechCard);
router.post("/getTechCardsByRestaurantId", techCardController.getTechCardsByRestaurantId);

module.exports = router;

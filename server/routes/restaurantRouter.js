const Router = require("express")
const router = new Router()
const restaurantController = require("../controllers/restaurantController.js")

router.post("/registration", restaurantController.registration)
router.post("/getRestaurantById", restaurantController.getRestaurantById)
router.delete("/deleteRestaurant", restaurantController.deleteRestaurant)
router.put("/updateRestaurant", restaurantController.updateRestaurant)

router.post("/getRestaurantsByUserId", restaurantController.getRestaurantsByUserId)

module.exports = router
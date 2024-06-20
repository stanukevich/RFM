const Router = require("express")
const router = new Router()
const userController = require("../controllers/userController")

router.post("/registration", userController.registration)
router.post("/authenticate", userController.authenticate)
router.delete("/deleteUser", userController.deleteUser)
router.put("/updateUser", userController.updateUser)
router.post("/getUserById", userController.getUserById)

module.exports = router
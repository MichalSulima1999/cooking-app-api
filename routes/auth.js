const router = require("express").Router();
const userController = require("../controllers/UserController")
const verify = require('../middleware/verifyToken');

router.get("/", verify, userController.getUsers);

router.post("/register", userController.registerUser);

// Login
router.post("/login", userController.loginUser);

router.get("/logout", userController.logoutUser);

module.exports = router;

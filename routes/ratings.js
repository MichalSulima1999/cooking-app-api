const router = require("express").Router();
const verify = require("../middleware/verifyToken");
const { createRating, showUserRating } = require("../controllers/RatingController");

router.get("/:recipeId", verify, showUserRating);
router.post("/", verify, createRating);

module.exports = router;
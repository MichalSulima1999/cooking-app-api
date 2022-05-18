const router = require("express").Router();
const verify = require("../middleware/verifyToken");
const { createRating, updateRating, deleteRating } = require("../controllers/RatingController");

router.post("/", verify, createRating);
router.patch("/:ratingId", verify, updateRating);
router.delete("/:ratingId/:recipeId", verify, deleteRating);

module.exports = router;
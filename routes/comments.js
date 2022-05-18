const router = require("express").Router();
const verify = require("../middleware/verifyToken");
const { createComment, updateComment, deleteComment } = require("../controllers/CommentController");

router.post("/", verify, createComment);
router.patch("/:commentId", verify, updateComment);
router.delete("/:commentId/:recipeId", verify, deleteComment);

module.exports = router;
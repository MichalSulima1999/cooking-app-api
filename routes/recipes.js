const router = require("express").Router();
const multer  = require('multer')
const path = require("path");
const verify = require("../middleware/verifyToken");
const {
  showRecipes,
  showRandomRecipes,
  showRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  ratingMean
} = require("../controllers/RecipeController");
//const upload = multer({ dest: './public/data/images/' })

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/data/images/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
})
const upload = multer({ storage: storage });

router.get("/", showRecipes);
router.get("/random/:number", showRandomRecipes);
router.get("/ratingMean/:recipeId", ratingMean);
router.get("/:recipeId", showRecipe);
router.post("/", verify, upload.single('img'), createRecipe);
router.patch("/:recipeId", verify, updateRecipe);
router.delete("/:recipeId", verify, deleteRecipe);

module.exports = router;

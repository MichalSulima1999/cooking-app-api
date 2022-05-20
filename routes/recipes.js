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
  ratingMean,
  showRecipesByMeal,
  showRecipesByName
} = require("../controllers/RecipeController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/data/images/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  },
  fileFilter: function(_req, file, cb){
    checkFileType(file, cb);
}
})
const upload = multer({ storage: storage });

function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpg|png|webp/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

router.get("/", showRecipes);
router.get("/random/:number", showRandomRecipes);
router.get("/findByName/:name", showRecipesByName);
router.get("/findByMeal/:meal", showRecipesByMeal);
router.get("/ratingMean/:recipeId", ratingMean);
router.get("/:recipeId", showRecipe);
router.get("/verify/:recipeId", verify, showRecipe);
router.post("/", verify, upload.single('img'), createRecipe);
router.patch("/:recipeId", verify, upload.single('img'), updateRecipe);
router.delete("/:recipeId", verify, deleteRecipe);

module.exports = router;

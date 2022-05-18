const Recipe = require("../model/Recipe");
const Comment = require("../model/Comment");

const showRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.json({ message: err });
  }
};

const showRandomRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.aggregate([
      { $sample: { size: Number(req.params.number) } },
    ]);
    res.json(recipes);
  } catch (err) {
    res.json({ message: err });
  }
};

const showRecipe = async (req, res) => {
  try {
    //const recipe = await Recipe.findById(req.params.recipeId);
    const recipe = await Recipe.findById(req.params.recipeId)
      .populate("comments")
      .populate("user")
      .populate("ratings");
    res.json(recipe);
  } catch (err) {
    res.json({ message: err });
  }
};

const createRecipe = async (req, res) => {
  const recipe = new Recipe({
    name: req.body.name,
    description: req.body.description,
    image_path: req.file.filename,
    meal: req.body.meal,
    ingredients: req.body.ingredients,
    user: req.user._id,
    cooking_time: req.body.cooking_time,
  });

  try {
    const savedRecipe = await recipe.save();
    res.send(savedRecipe);
  } catch (err) {
    res.json({ message: err });
    console.log(err);
  }
};

const updateRecipe = async (req, res) => {
  Recipe.findById(req.params.recipeId, async function (err, doc) {
    if (err) {
      res.json({ message: err });
    }
    if (doc.user == req.user._id) {
      doc.name = req.body.name;
      doc.description = req.body.description;
      doc.image_path = req.body.image_path;
      doc.meal = req.body.meal;
      doc.ingredients = req.body.ingredients;
      doc.cooking_time = req.body.cooking_time;
      await doc.save();
      console.log(doc);
      res.json(doc);
    } else {
      res.send("Authorization failed");
    }
  });
};

const deleteRecipe = async (req, res) => {
  try {
    Recipe.findById(req.params.recipeId, async function (err, doc) {
      if (err) {
        res.json({ message: err });
      }
      if (doc.user == req.user._id) {
        doc.delete();
        res.json(doc);
      } else {
        res.send("Authorization failed");
      }
    });

    const comments = await Recipe.findById(req.params.recipeId).select({
      comments: 1,
      _id: 0,
    });
    comments["comments"].forEach(async (element) => {
      await Comment.deleteOne({ _id: String(element) });
    });
    //const deletedRecipe = await Recipe.deleteOne({ _id: req.params.recipeId });

    //res.json(deletedRecipe);
  } catch (err) {
    res.json({ message: err });
    console.log(err);
  }
};

// Średnia głosów
const ratingMean = async (req, res) => {
  try {
    var mean = 0;
    var i = 0;
    const recipe = await Recipe.findById(req.params.recipeId)
      .select("ratings")
      .populate("ratings");
    recipe["ratings"].forEach((element) => {
      mean += element.rating;
      i++;
    });
    res.send(String(mean / i));
  } catch (err) {
    res.json({ message: err });
    console.log(err);
  }
};

module.exports = {
  showRecipes,
  showRandomRecipes,
  showRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  ratingMean,
};

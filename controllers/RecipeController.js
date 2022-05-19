const Recipe = require("../model/Recipe");
const Comment = require("../model/Comment");
const fs = require("fs");
const path = require("path");

const showRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.json({ message: err });
  }
};

const showRecipesByMeal = async (req, res) => {
  try {
    const recipes = await Recipe.find({ meal: { $regex: req.params.meal, $options: "i" } });
    res.json(recipes);
  } catch (err) {
    res.json({ message: err });
  }
};

const showRecipesByName = async (req, res) => {
  try {
    const recipes = await Recipe.find({
      name: { $regex: req.params.name, $options: "i" },
    });
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
    const recipe = await Recipe.findById(req.params.recipeId)
      .populate("comments")
      .populate("user");

    if (req.user && req.user._id == recipe.user._id) {
      recipe.user.name = "You";
    }

    if (req.user) {
      recipe["comments"].forEach((element) => {
        if (element.user == req.user._id) {
          element.__v = 1;
        }
      });
    }
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
    ingredients: JSON.parse(req.body.ingredients),
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
      const p = path.join("./public", "data", "images", doc.image_path);
      fs.unlink(p, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("File removed");
      });
      doc.name = req.body.name;
      doc.description = req.body.description;
      doc.image_path = req.file.filename;
      doc.meal = req.body.meal;
      doc.ingredients = JSON.parse(req.body.ingredients);
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
    res.json({ avg: mean / i });
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
  showRecipesByMeal,
  showRecipesByName,
};

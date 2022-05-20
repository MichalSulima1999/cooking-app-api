const Recipe = require("../model/Recipe");
const Rating = require("../model/Rating");

const showUserRating = async (req, res) => {
  try {
    let rating = 0;
    const recipe = await Recipe.findById(req.params.recipeId)
    .select("ratings")
    .populate("ratings");

    recipe["ratings"].some((element) => {
      
      if (element.user == req.user._id) {
        rating = element.rating;
        return;
      }
    });
    res.json({ rating: rating});
  } catch (err) {
    res.json({ message: err });
  }
};

const createRating = async (req, res) => {
  try {
    var found = false;
    const recipe = await Recipe.findById(req.body.recipeId)
      .select("ratings")
      .populate("ratings");

    recipe["ratings"].some((element) => {
      if (element.user == req.user._id) {
        element.rating = req.body.rating;
        element.save();
        res.send(element);
        found = true;
        return;
      }
    });

    if (!found) {
      const rating = new Rating({
        user: req.user._id,
        rating: req.body.rating,
      });
      const savedRating = await rating.save();

      await Recipe.updateOne(
        { _id: req.body.recipeId },
        { $push: { ratings: savedRating._id } },
        { new: true, useFindAndModify: false }
      );
      res.send(savedRating);
    }
  } catch (err) {
    res.json({ message: err });
  }
};


module.exports = { createRating, showUserRating };

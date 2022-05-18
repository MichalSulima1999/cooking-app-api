const Recipe = require("../model/Recipe");
const Rating = require("../model/Rating");

const createRating = async (req, res) => {
  try {
      var found = false;
    const recipe = await Recipe.findById(req.body.recipeId)
      .select("ratings")
      .populate("ratings");

    recipe["ratings"].some(element => {
        if(element.user == req.user._id){
            element.rating = req.body.rating;
            element.save();
            res.send(element);
            found = true;
            return;
        }
    });

    if(!found) {
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
      console.log(err);
    res.json({ message: err });
  }
};

const updateRating = async (req, res) => {
  Rating.findById(req.params.ratingId, async function (err, doc) {
    if (err) {
      res.json({ message: err });
    }
    if (doc.user == req.user._id) {
      doc.rating = req.body.rating;
      await doc.save();
      res.json(doc);
    } else {
      res.send("Authorization failed");
    }
  });
};

const deleteRating = async (req, res) => {
  Rating.findById(req.params.ratingId, async function (err, doc) {
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

  try {
    await Recipe.findOneAndUpdate(
      { _id: req.params.recipeId },
      { $pull: { ratings: req.params.ratingId } }
    );
  } catch (err) {
    res.json({ message: err });
    console.log(err);
  }
};

module.exports = { createRating, updateRating, deleteRating };

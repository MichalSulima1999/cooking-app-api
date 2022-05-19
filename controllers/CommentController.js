const Recipe = require("../model/Recipe");
const Comment = require("../model/Comment");

const createComment = async (req, res) => {
  try {
    const comment = new Comment({
      user: req.user._id,
      title: req.body.title,
      text: req.body.text,
    });
    const savedComment = await comment.save();

    await Recipe.updateOne(
      { _id: req.body.recipeId },
      { $push: { comments: savedComment._id } },
      { new: true, useFindAndModify: false }
    );
    res.send(savedComment);
  } catch (err) {
    res.json({ message: err });
  }
};

const updateComment = async (req, res) => {
  Comment.findById(req.params.commentId, async function (err, doc) {
    if (err) {
      res.json({ message: err });
    }
    if (doc.user == req.user._id) {
      doc.title = req.body.title;
      doc.text = req.body.text;
      await doc.save();
      res.json(doc);
    } else {
      res.send("Authorization failed");
    }
  });
}

const deleteComment = async (req, res) => {
  Comment.findById(req.params.commentId, async function (err, doc) {
    if (err) {
      res.json({ message: err });
    }
    if (doc.user == req.user._id) {
      doc.delete();
    } else {
      res.send("Authorization failed");
    }
  });

  try {
    await Recipe.findOneAndUpdate(
      { _id: req.params.recipeId },
      { $pull: { comments: req.params.commentId } }
    );
  } catch (err) {
    res.json({ message: err });
    console.log(err);
  }
  res.send("Recipe deleted successfuly!");
};

module.exports = { createComment, updateComment, deleteComment };

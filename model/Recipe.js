const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 32,
  },
  description: {
    type: String,
    required: true,
    minLength: 20,
  },
  image_path: {
    type: String,
    required: true,
  },
  meal: {
    type: String,
    enum: ["Breakfast", "Dinner", "Supper", "Dessert"],
    default: "Breakfast",
  },
  ingredients: [
    {
      type: String,
      required: true,
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cooking_time: {
    type: Number,
    min: 0,
    required: true,
  },
  ratings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rating",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Recipe", recipeSchema);

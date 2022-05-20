// VALIDATION
const Joi = require("@hapi/joi");
const { join } = require("path");

// Register Validation
const registerValidation = data => {
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
      });  

      return schema.validate(data);
};

// Login Validation
const loginValidation = data => {
    const schema = Joi.object({
        login: Joi.string().min(6).required(),
        password: Joi.string().min(6).required(),
      });  

      return schema.validate(data);
};

const recipeValidation = data => {
  const schema = Joi.object({
    name: Joi.string().min(4).max(32).required(),
    description: Joi.string().min(20).required(),
    meal: Joi.string().valid(...["Breakfast", "Dinner", "Supper", "Dessert"]),
    ingredients: Joi.string().min(1).required(),
    cooking_time: Joi.number().min(1).required(),
  })

  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.recipeValidation = recipeValidation;
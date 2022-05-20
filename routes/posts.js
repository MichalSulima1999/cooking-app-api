const router = require("express").Router();
const User = require("../model/User");
const verify = require('./verifyToken');

router.get("/", verify, async (req, res) => {
  const user = await User.findById(req.user._id).exec();
  res.send(user);
});

module.exports = router;

const router = require("express").Router();
const User = require("../model/User");
const verify = require('./verifyToken');

router.get("/", verify, async (req, res) => {
  const user = await User.findById(req.user._id).exec();
  //console.log(user);
  res.send(user);
  //res.send(req.user);
});

module.exports = router;

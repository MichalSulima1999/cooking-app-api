// const jwt = require("jsonwebtoken");

// const { TokenExpiredError } = jwt;
// const catchError = (err, res) => {
//   if (err instanceof TokenExpiredError) {
//     return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
//   }
//   return res.sendStatus(401).send({ message: "Unauthorized!" });
// }

// module.exports =  function (req, res, next) {
//   const token = req.header("authorization").split(" ")[1];
//   if (!token) return res.status(401).send("Access Denied");

//   try {
//     const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     req.user = verified;
//     next();
//   } catch (err) {
//     return catchError(err, res);
//   }
// }


const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded;
    next();
  });
};

module.exports = verifyJWT;

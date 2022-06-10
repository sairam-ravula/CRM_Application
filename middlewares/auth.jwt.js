/*
 *Authentication
 */

const jwttoken = require("jsonwebtoken");
const secretKey = require("../configs/auth.config");
const User = require("../models/user.model");
const constant = require("../utils/constants");

/*
 * If no token is passed in the request header - Not allowed
 * If token is passed - Authenticated
 *    * If correct - allow, else reject the request
 */

verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token is provided",
    });
  }

  //If the token is provided we need to verify it

  jwttoken.verify(token, secretKey.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized",
      });
    }

    //I will try to read the userID from the decoded token and store it in req object
    req.userID = decoded.id;
    next();
  });
};

isAdmin = async (req, res, next) => {
  const user = await User.findOne({ userID: req.userID });

  if (user && user.userType == constant.userType.admin) {
    next();
  } else {
    return res.status(403).send({
      message: "Requires admin role",
    });
  }
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
};

module.exports = authJwt;

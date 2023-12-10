require("dotenv").config();
const jwt = require("jsonwebtoken");

//check if jwt access token sent from client is valid
const verifyToken = (req, res, next) => {
  //Authorization: bearer token...
  const authHeader = req.header("Authorization");
  let token = authHeader;
  if (authHeader) token = authHeader.split(" ")[1]; // [Bearer, access_token]

  //if no access token -> deny access
  if (!token)
    return res.status(401).json({ success: false, message: "token not found" });

  //check if jwt token is valid using the secret ACCESS_KEY key
  jwt.verify(token, process.env.ACCESS_KEY, (err, payload) => {
    if (err)
      return res.status(403).json({ success: false, message: "invalid token" });
    req.userId = payload.userId;
    next();
  });
};

module.exports = verifyToken;

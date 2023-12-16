const express = require("express");
const verifyToken = require("../middleware/auth");
const {
  checkAuthentication,
  register,
  login,
  changePassword,
} = require("../controllers/User");

const router = express.Router();

//@route GET /api/auth
//@desc verify if a user is authenticated (when access a react route)
//@accessability public
router.get("/", verifyToken, checkAuthentication);

//@route POST /api/auth/register
//@desc register user
//@accessability public
router.post("/register", register);

//@route POST /api/auth/login
//@desc login user
//@accessability public
router.post("/login", login);

//@route PUT /api/auth/change-password
//@desc change user password
//@accessability private
router.put("/change-password", verifyToken, changePassword);

module.exports = router;

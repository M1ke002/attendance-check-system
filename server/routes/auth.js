const express = require("express");
const verifyToken = require("../middleware/auth");
const {
  checkAuthentication,
  register,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
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

//@route POST /api/auth/forgot-password
//@desc send reset password to email
//@accessability public
router.post("/forgot-password", forgotPassword);

//@route POST /api/auth/reset-password
//@desc reset password
//@accessability public
router.post("/reset-password", resetPassword);

//@route PUT /api/auth/change-password
//@desc change user password
//@accessability private
router.put("/change-password", verifyToken, changePassword);

module.exports = router;

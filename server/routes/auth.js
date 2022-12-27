require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const User = require("../models/User");
const verifyToken = require("../middleware/auth");

const router = express.Router();

//@route GET /api/auth
//@desc verify if a user is authenticated (when access a react route)
//@accessability public
router.get("/", verifyToken, async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User found", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//@route POST /api/auth/register
//@desc register user
//@accessability public
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  //validation
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "Missing username or password" });

  try {
    //check if username already existed
    const existedUser = await User.findOne({ username: username });
    if (existedUser)
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });

    const hashedPassword = await argon2.hash(password);

    //save to db
    const user = new User({ username, password: hashedPassword });
    await user.save();

    //create access token for user
    const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_KEY);
    res.json({
      success: true,
      message: "User registered",
      accessToken,
      user: {
        _id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//@route POST /api/auth/login
//@desc login user
//@accessability public
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  //validation
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "Missing username or password" });

  try {
    //check if user exists
    const user = await User.findOne({ username: username });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid username" });

    //check if password matches
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid)
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });

    //create access token for user
    const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_KEY);
    res.json({
      success: true,
      message: "Login successfully",
      accessToken,
      user: {
        _id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//@route POST /api/auth/change-password
//@desc change user password
//@accessability private
router.post("/change-password", verifyToken, async (req, res) => {
  const { currPassword, newPassword } = req.body;
  if (!currPassword || !newPassword)
    return res
      .status(400)
      .json({ success: false, message: "Missing passwords" });

  try {
    //check if user exists
    const user = await User.findById(req.userId);
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    //check if password matches
    const isPasswordValid = await argon2.verify(user.password, currPassword);
    if (!isPasswordValid)
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    //hash and update new password
    const hashedPassword = await argon2.hash(newPassword);
    user.password = hashedPassword;
    await user.save();
    res.json({ success: true, message: "Password changed", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;

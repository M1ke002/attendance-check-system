require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

//@route PUT /api/profile
//@desc edit profile
//@accessability private
router.put("/", verifyToken, async (req, res) => {
  const { username } = req.body;

  //validation
  if (!username)
    return res
      .status(400)
      .json({ success: false, message: "Missing username" });

  //check for existing username
  try {
    const existedUser = await User.findOne({ _id: req.userId });
    if (existedUser)
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });

    //update
    let updatedUser = {
      username,
    };
    updatedUser = await User.findOneAndUpdate(
      { _id: req.userId },
      updatedUser,
      { new: true }
    );
    res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;

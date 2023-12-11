require("dotenv").config();
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const verifyToken = require("../middleware/auth");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, path.join(process.cwd(), "uploads"));
    if (process.env.NODE_ENV !== "production") {
      cb(null, "./tmp");
    } else {
      cb(null, "/tmp");
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
// const upload = multer();

//@route PUT /api/profile
//@desc edit profile
//@accessability private
router.put("/", verifyToken, async (req, res) => {
  const { username, name } = req.body;

  //validation
  if (!username || !name)
    return res
      .status(400)
      .json({ success: false, message: "Missing username or name" });

  //check for existing username
  try {
    const existedUser = await User.findOne({ username });
    if (existedUser && !existedUser._id.equals(req.userId))
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });

    //update
    let updatedUser = {
      username,
      name,
    };
    updatedUser = await User.findOneAndUpdate(
      { _id: req.userId },
      updatedUser,
      { new: true }
    );
    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//@route POST /api/profile/upload-avatar
//@desc upload avatar image
//@accessability private
router.post(
  "/upload-avatar",
  verifyToken,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const file = req.file;
      // const imageUrl = `http://localhost:${
      //   process.env.PORT
      // }/${file.path.replace("\\", "/")}`;
      console.log(file);
      const response = await cloudinary.uploader.upload(file.path, {
        public_id: req.userId,
        folder: "avatars",
        overwrite: true,
        use_filename: true,
      });

      if (!response)
        return res
          .status(400)
          .json({ success: false, message: "Can't upload avatar image" });

      //remove temporary file
      fs.unlinkSync(file.path);

      const imageUrl = response.secure_url;
      // console.log(response);
      const user = await User.findOneAndUpdate(
        { _id: req.userId },
        { avatar: imageUrl },
        { new: true }
      );
      if (!user)
        return res
          .status(400)
          .json({ success: false, message: "Can't upload avatar image" });
      res.json({
        success: true,
        message: "Avatar uploaded successfully",
        avatar: user.avatar,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

//@route DELETE /api/profile/delete-avatar
//@desc delete avatar image
//@accessability private
router.delete("/delete-avatar", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const response = await cloudinary.uploader.destroy(`avatars/${userId}`);
    if (!response.result === "ok") {
      return res
        .status(400)
        .json({ success: false, message: "Can't delete avatar image" });
    }
    const user = await User.findOneAndUpdate(
      { _id: req.userId },
      { avatar: "" },
      { new: true }
    );
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Can't delete avatar image" });
    res.json({
      success: true,
      message: "Avatar deleted",
      avatar: user.avatar,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;

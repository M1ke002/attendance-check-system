require("dotenv").config();
const fs = require("fs");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");

const User = require("../models/User");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const checkAuthentication = async (req, res) => {
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
};

const register = async (req, res) => {
  const { username, name, email, password } = req.body;

  //validation
  if (!username || !name || !password || !email)
    return res.status(400).json({
      success: false,
      message: "Missing name, username, email or password",
    });

  try {
    //check if username already existed
    let existedUser = await User.findOne({ username: username });
    if (existedUser)
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });

    //check if email already existed
    existedUser = await User.findOne({ email: email });
    if (existedUser)
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });

    const hashedPassword = await argon2.hash(password);

    //save to db
    const user = new User({ username, name, email, password: hashedPassword });
    await user.save();

    //creates jwt token for user and send it back to client
    //the payload contains the user id
    const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_KEY);
    res.json({
      success: true,
      message: "User registered",
      accessToken,
      user: {
        _id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        avatar: "",
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
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
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const changePassword = async (req, res) => {
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
    res.json({ success: true, message: "Password changed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const editProfile = async (req, res) => {
  const { username, name, email } = req.body;

  //validation
  if (!username || !name || !email)
    return res
      .status(400)
      .json({ success: false, message: "Missing username, name or email" });

  //check for existing username
  try {
    const existedUserWithUsername = await User.findOne({ username });
    if (
      existedUserWithUsername &&
      !existedUserWithUsername._id.equals(req.userId)
    )
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });

    //check for existing email
    const existedUserWithEmail = await User.findOne({ email });
    if (existedUserWithEmail && !existedUserWithEmail._id.equals(req.userId))
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });

    //update
    let updatedUser = {
      username,
      name,
      email,
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
        email: updatedUser.email,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const uploadAvatarImage = async (req, res) => {
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
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteAvatarImage = async (req, res) => {
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
};

module.exports = {
  checkAuthentication,
  register,
  login,
  changePassword,
  editProfile,
  uploadAvatarImage,
  deleteAvatarImage,
};

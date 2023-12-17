const express = require("express");
const multer = require("multer");
const verifyToken = require("../middleware/auth");
const {
  editProfile,
  uploadAvatarImage,
  deleteAvatarImage,
  deleteAccount,
} = require("../controllers/User");

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
router.put("/", verifyToken, editProfile);

//@route DELETE /api/profile
//@desc delete account
//@accessability private
router.delete("/", verifyToken, deleteAccount);

//@route POST /api/profile/upload-avatar
//@desc upload avatar image
//@accessability private
router.post(
  "/upload-avatar",
  verifyToken,
  upload.single("avatar"),
  uploadAvatarImage
);

//@route DELETE /api/profile/delete-avatar
//@desc delete avatar image
//@accessability private
router.delete("/delete-avatar", verifyToken, deleteAvatarImage);

module.exports = router;

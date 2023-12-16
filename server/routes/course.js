const express = require("express");
const verifyToken = require("../middleware/auth");
const {
  getAllCourses,
  createCourse,
  editCourse,
  deleteCourse,
} = require("../controllers/Course");

const router = express.Router();

//@route GET /api/courses
//@desc get all courses.
//@accessability private
router.get("/", verifyToken, getAllCourses);

//@route POST /api/courses
//@desc create a course
//@accessability private
router.post("/", verifyToken, createCourse);

//@route PUT /api/courses/:id
//@desc update a course
//@accessability private
router.put("/:id", verifyToken, editCourse);

//@route DELETE /api/courses/:id
//@desc delete a course
//@accessability private
router.delete("/:id", verifyToken, deleteCourse);

module.exports = router;

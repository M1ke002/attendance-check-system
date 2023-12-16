const Course = require("../models/Course");
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");

const getAllCourses = async (req, res) => {
  try {
    //populate the course with the students and the attendance records
    const courses = await Course.find({ user: req.userId })
      .populate("students")
      .populate("attendances");
    if (courses.length === 0)
      return res
        .status(400)
        .json({ success: false, message: "No courses found" });
    res.json({ success: true, courses });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const createCourse = async (req, res) => {
  const { name, courseCode, year } = req.body;

  //validation
  if (!name || !courseCode || !year)
    return res.status(400).json({
      success: false,
      message: "Missing name/course code/course year",
    });
  try {
    //check if there is already a course with same code and year
    const existedCourse = await Course.findOne({
      courseCode,
      year,
      user: req.userId,
    });
    if (existedCourse)
      return res.status(400).json({
        success: false,
        message: "Course cannot have same code and year",
      });

    const newCourse = new Course({
      name,
      courseCode,
      year,
      user: req.userId,
    });
    await newCourse.save();
    res.json({ success: true, message: "Course created", course: newCourse });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const editCourse = async (req, res) => {
  const { name, courseCode, year } = req.body;
  const id = req.params.id; //object id in db

  //validation
  if (!name || !courseCode || !year || !id)
    return res
      .status(400)
      .json({ success: false, message: "Missing name/course code/year/id" });
  try {
    //check if a course with same code and year already exists in db
    const existedCourse = await Course.findOne({
      courseCode,
      year,
      user: req.userId,
    });
    if (existedCourse && existedCourse._id != id)
      return res.status(400).json({
        success: false,
        message: "Course cannot have the same code and year",
      });

    let updatedCourse = {
      name,
      courseCode,
      year,
    };
    const courseFilter = { _id: id, user: req.userId };
    updatedCourse = await Course.findOneAndUpdate(courseFilter, updatedCourse, {
      new: true,
    })
      .populate("students")
      .populate("attendances");
    if (!updatedCourse)
      return res.status(400).json({
        success: false,
        message: "Course not found or user not authorized",
      });
    res.json({
      success: true,
      message: "Course updated",
      course: updatedCourse,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteCourse = async (req, res) => {
  const id = req.params.id;
  if (!id)
    return res
      .status(404)
      .json({ success: false, message: "missing course id" });
  try {
    const courseFilter = { _id: id, user: req.userId };
    const deletedCourse = await Course.findOneAndDelete(courseFilter);
    if (!deletedCourse)
      return res.status(400).json({
        success: false,
        message: "Course not found or user not authorized",
      });
    //delete all attendances of this course
    await Attendance.deleteMany({ course: id });
    //remove this course id from enrolledCourses array of all students
    await Student.updateMany(
      { _id: { $in: deletedCourse.students }, user: req.userId },
      { $pull: { enrolledCourses: deletedCourse._id } }
    );

    res.json({
      success: true,
      message: "Course deleted",
      course: deletedCourse,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getAllCourses,
  createCourse,
  editCourse,
  deleteCourse,
};

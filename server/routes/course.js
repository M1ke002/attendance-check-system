require("dotenv").config();
const express = require("express");
const verifyToken = require("../middleware/auth");
const Course = require("../models/Course");
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");

const router = express.Router();

//@route GET /api/courses
//@desc get all courses.
//@accessability private
router.get("/", verifyToken, async (req, res) => {
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
});

//@route POST /api/courses
//@desc create a course
//@accessability private
router.post("/", verifyToken, async (req, res) => {
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
});

//@route PUT /api/courses/:id
//@desc update a course
//@accessability private
router.put("/:id", verifyToken, async (req, res) => {
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
});

//@route DELETE /api/courses/:id
//@desc delete a course
//@accessability private
router.delete("/:id", verifyToken, async (req, res) => {
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

    // deletedCourse.students.forEach(async(studentId) => {
    //     await Student.findByIdAndUpdate(
    //         studentId,
    //         {$pull: {enrolledCourses: id}},
    //     )
    // })

    res.json({
      success: true,
      message: "Course deleted",
      course: deletedCourse,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//@route GET /api/courses/:id/attendance-status
//@desc get attendance status for a course
//@accessability private
router.get("/:id/attendance-status", verifyToken, async (req, res) => {
  const id = req.params.id;
  try {
    //get all students enrolled for this course
    const students = await Student.find({ course: id, user: req.userId });
    if (!students)
      return res
        .status(400)
        .json({ success: false, message: "No students found" });

    //get all attendance records for the course
    const attendanceList = await Attendance.find({
      course: id,
      user: req.userId,
    });
    if (!attendanceList)
      return res
        .status(400)
        .json({ success: false, message: "No attendance records found" });

    //get course info
    const course = await Course.find({ _id: id, user: req.userId });
    if (!course)
      return res
        .status(400)
        .json({ success: false, message: "Course not found" });

    //get total number of classes
    const totalClasses = attendanceList.length;

    //get student id, name, courseId, overall attendance count
    const studentMap = new Map();
    attendanceList.forEach((attendance) => {
      const { records } = attendance;
      records.forEach((record) => {
        const studentId = record.student;
        const present = record.present;
        if (studentMap.has(studentId)) {
          //if student already in map
          const studentRecord = studentMap.get(studentId);
          studentRecord.count += present ? 1 : 0;
          studentMap.set(studentId, studentRecord);
        } else {
          const student = students.find((student) => student._id == studentId);
          const studentRecord = {
            name: student.name,
            studentId: student.studentId,
            courseId: course.courseId,
            count: present ? 1 : 0,
          };
          studentMap.set(studentId, studentRecord);
        }
      });
    });
    //send res back to the client, sorted by student name
    res.json({
      success: true,
      attendanceStatus: [...studentMap.values()] //arr of student records
        .sort((a, b) => a.name.localeCompare(b.name)),
      totalClasses,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;

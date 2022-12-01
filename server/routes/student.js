require("dotenv").config();
const express = require("express");
const verifyToken = require("../middleware/auth");
const Course = require("../models/Course");
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");

const router = express.Router();

//@route POST /api/students/enroll
//@desc enroll student for a course
//@accessability private
router.post("/enroll", verifyToken, async (req, res) => {
  const { studentId, name, courseId } = req.body;
  //validation
  if (!studentId || !courseId)
    return res
      .status(400)
      .json({ success: false, message: "Missing student id/courseId" });

  try {
    //check if course exists
    const course = await Course.findOne({ _id: courseId, user: req.userId });
    if (!course)
      return res.status(400).json({
        success: false,
        message: "course not found/user not authenticated",
      });

    let student = null;

    //check if student already exists
    student = await Student.findOne({ studentId, user: req.userId });

    if (student) {
      //check if student is already enrolled in the course
      const existedCourseId = student.enrolledCourses.find((id) =>
        id.equals(courseId)
      );
      if (existedCourseId)
        return res.status(400).json({
          success: false,
          message: "student already enrolled in this course",
        });

      //if not add the course to student's enrolledCourses
      student.enrolledCourses.push(courseId);
    } else {
      if (!name)
        return res.status(400).json({
          success: false,
          message: "Missing student name",
        });
      //create new student with this course enrolled
      student = new Student({
        studentId,
        name,
        enrolledCourses: [courseId],
        user: req.userId,
      });
    }
    await student.save();

    //add student to course
    course.students.push(student._id);
    await course.save();

    //add student to all attendance list of that course
    await Attendance.updateMany(
      { course: courseId, user: req.userId },
      { $push: { records: { student: student._id } } }
    );
    res.json({ success: true, message: "student added", student });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//@route PUT /api/students/unenroll/studentId
//@desc remove student from a course
//@accessability private
router.put("/unenroll/:id", verifyToken, async (req, res) => {
  const id = req.params.id; //object id of student
  const { courseId } = req.body;

  //validation
  if (!id || !courseId)
    return res
      .status(400)
      .json({ success: false, message: "missing student id/course id" });

  try {
    //check if student exists
    let student = await Student.findOne({ _id: id, user: req.userId });
    if (!student)
      return res.status(400).json({
        success: false,
        message: "student not found/user not authenticated",
      });

    //check if student is enrolled in the course
    const existedCourseId = student.enrolledCourses.find((id) =>
      id.equals(courseId)
    );
    if (!existedCourseId)
      return res.status(400).json({
        success: false,
        message: "student not enrolled in this course",
      });

    //remove course from enrolledCourses of the student
    student = await Student.findOneAndUpdate(
      { _id: id, user: req.userId },
      { $pull: { enrolledCourses: courseId } }
    );

    //remove the student from the student list of the course
    await Course.findOneAndUpdate(
      { _id: courseId, user: req.userId },
      { $pull: { students: id } }
    );

    //remove the student from the attendances of the course
    await Attendance.updateMany(
      { course: courseId, user: req.userId },
      { $pull: { records: { student: id } } }
    );
    res.json({
      success: true,
      message: "student removed from course",
      student,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//@route GET /api/students/search?searchQuery=abc
//@desc get a student based on search query
//@accessability private
router.get("/search", verifyToken, async (req, res) => {
  const query = req.query.searchQuery;
  if (!query)
    return res.status(400).json({
      success: false,
      message: "empty query!",
    });
  try {
    const students = await Student.find({
      user: req.userId,
      $or: [
        { studentId: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
      ],
    });
    res.json({ success: true, students });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//@route GET /api/students
//@desc get all students
//@accessability private
router.get("/", verifyToken, async (req, res) => {
  try {
    const students = await Student.find({ user: req.userId });
    if (students.length === 0)
      return res
        .status(400)
        .json({ success: false, message: "no students found" });
    res.json({ success: true, message: "students found", students });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//@route POST /api/students
//@desc create new student
//@accessability private
router.post("/", verifyToken, async (req, res) => {
  const { studentId, name } = req.body;

  //validation
  if (!studentId || !name)
    return res
      .status(400)
      .json({ success: false, message: "Missing student id/name" });

  try {
    //check if student ID already exists
    const existedStudent = await Student.findOne({
      studentId,
      user: req.userId,
    });
    if (existedStudent)
      return res
        .status(400)
        .json({ success: false, message: "student ID must be unique" });

    //create new student with no courses enrolled
    const student = new Student({
      studentId,
      name,
      user: req.userId,
    });
    await student.save();
    res.json({ success: true, message: "student added", student });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//@route PUT /api/students
//@desc update student info
//@accessability private
router.put("/:id", verifyToken, async (req, res) => {
  const { name, studentId } = req.body;
  const id = req.params.id;

  //validation
  if (!name || !studentId || !id)
    return res
      .status(400)
      .json({ success: false, message: "missing name/studentId/id" });

  try {
    //check if student id already exists
    const existedStudent = await Student.findOne({
      studentId,
      user: req.userId,
    });
    if (existedStudent && !existedStudent._id.equals(id))
      return res
        .status(400)
        .json({ success: false, message: "student ID must be unique" });

    const student = await Student.findOneAndUpdate(
      { _id: id, user: req.userId },
      { name, studentId },
      { new: true }
    );
    if (!student)
      return res.status(400).json({
        success: false,
        message: "student not found/user not authenticated",
      });
    res.json({ success: true, message: "student updated", student });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//@route DELETE /api/students
//@desc delete student
//@accessability private
router.delete("/:id", verifyToken, async (req, res) => {
  const id = req.params.id; //id of student

  //validation
  if (!id)
    return res
      .status(400)
      .json({ success: false, message: "missing student id" });

  try {
    //delete student from db
    const deletedStudent = await Student.findOneAndDelete({
      _id: id,
      user: req.userId,
    });
    if (!deletedStudent)
      return res.status(400).json({
        success: false,
        message: "Student not found/user not authenticated",
      });

    //delete student from all courses that contain the student
    await Course.updateMany(
      { _id: { $in: deletedStudent.enrolledCourses }, user: req.userId },
      { $pull: { students: deletedStudent._id } }
    );

    // delete student from all attendances that contain the student
    await Attendance.updateMany(
      { course: { $in: deletedStudent.enrolledCourses }, user: req.userId },
      { $pull: { records: { student: deletedStudent._id } } }
    );
    res.json({ success: true, message: "student deleted", deletedStudent });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;

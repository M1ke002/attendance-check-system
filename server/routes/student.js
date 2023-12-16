const express = require("express");
const verifyToken = require("../middleware/auth");
const {
  enrollStudentForCourse,
  enrollStudentsForCourse,
  removeStudentFromCourse,
  removeStudentsFromCourse,
  searchStudent,
  getAllStudents,
  createStudent,
  editStudent,
  deleteAllStudents,
  deleteStudent,
} = require("../controllers/Student");

const router = express.Router();

//@route POST /api/students/enroll
//@desc enroll student for a course
//@accessability private
router.post("/enroll", verifyToken, enrollStudentForCourse);

//@route POST /api/students/enroll-multiple
//@desc enroll multiple students at once (input: array)
//@accessability private
router.post("/enroll-multiple", verifyToken, enrollStudentsForCourse);

//@route PUT /api/students/unenroll/studentId
//@desc remove student from a course
//@accessability private
router.put("/unenroll/:id", verifyToken, removeStudentFromCourse);

//@route PUT /api/students/unenroll-multiple
//@desc remove multiple students from course at once(input: arr)
//@accessability private
router.put("/unenroll-multiple", verifyToken, removeStudentsFromCourse);

//@route GET /api/students/search?searchQuery=abc
//@desc get a student based on search query
//@accessability private
router.get("/search", verifyToken, searchStudent);

//@route GET /api/students
//@desc get all students
//@accessability private
router.get("/", verifyToken, getAllStudents);

//@route POST /api/students
//@desc create new student
//@accessability private
router.post("/", verifyToken, createStudent);

//@route PUT /api/students/:id
//@desc update student info
//@accessability private
router.put("/:id", verifyToken, editStudent);

//@route DELETE /api/students
//@desc delete all students in the database
//@accessability private
router.delete("/", verifyToken, deleteAllStudents);

//@route DELETE /api/students/:id
//@desc delete student
//@accessability private
router.delete("/:id", verifyToken, deleteStudent);

module.exports = router;

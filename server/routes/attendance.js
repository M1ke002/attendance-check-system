const express = require("express");
const verifyToken = require("../middleware/auth");

const {
  setAttendanceValidity,
  checkAttendance,
  deleteAttendanceList,
  editAttendanceList,
  createAttendanceList,
  getAttendanceDetails,
  getAttendanceList,
} = require("../controllers/Attendance");

const router = express.Router();

//@route GET /api/attendance?attendanceId=123
//@desc get attendance list for a course
//@accessability private
router.get("/", verifyToken, getAttendanceList);

//@route GET /api/attendance/details?attendanceId=123
//@desc get attendance details for QR check
//@accessability public
router.get("/details", getAttendanceDetails);

//@route POST /api/attendance
//@desc create attendance list for a course (when click save data first time)
//@accessability private
router.post("/", verifyToken, createAttendanceList);

//@route PUT /api/attendance/attendanceId
//@desc edit existing attendance for enrolled students in a course (when click save data)
//@accessability private
router.put("/:attendanceId", verifyToken, editAttendanceList);

//@route DELETE /api/attendance/:attendanceId
//@desc delete attendance for enrolled students in a course
//@accessability private
router.delete("/:attendanceId", verifyToken, deleteAttendanceList);

//@route POST /api/attendance/check-student
//@desc check attendance for a student
//@accessability public
router.post("/check-student", checkAttendance);

//@route POST /api/attendance/set-valid
//@desc set whether student can check this attendance or not
//@accessability private
router.post("/set-valid", verifyToken, setAttendanceValidity);

module.exports = router;

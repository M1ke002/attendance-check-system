require("dotenv").config();
const express = require("express");
const verifyToken = require("../middleware/auth");

const Course = require("../models/Course");
const Attendance = require("../models/Attendance");

const router = express.Router();

//@route GET /api/attendance?courseId=123&date=dd/mm/yyyy
//@desc get attendance list for a course
//@accessability private
router.get("/", verifyToken, async (req, res) => {
  const { date, courseId } = req.query;
  if (!courseId || !date)
    return res
      .status(400)
      .json({ success: false, message: "Missing course id/date" });
  try {
    const course = await Course.findOne({ _id: courseId, user: req.userId });
    if (!course)
      return res
        .status(400)
        .json({ success: false, message: "Course not found" });
    //check if attendance for course on that date already exists
    const existedAttendance = await Attendance.findOne({
      course: courseId,
      date,
      user: req.userId,
    }).populate({
      path: "records",
      populate: {
        path: "student",
      },
    });

    //if no attendance existed
    if (!existedAttendance)
      return res
        .status(404)
        .json({ success: false, message: "attendance not found" });

    return res.json({
      success: true,
      message: "attendance found",
      attendance: existedAttendance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//@route GET /api/attendance/details?attendanceId=123
//@desc get attendance details for QR check
//@accessability public
router.get("/details", async (req, res) => {
  const { attendanceId } = req.query;
  if (!attendanceId)
    return res
      .status(400)
      .json({ success: false, message: "Missing attendance id" });
  try {
    const attendance = await Attendance.findOne({
      _id: attendanceId,
    })?.populate({
      path: "course",
      model: "courses",
      populate: {
        path: "students",
        model: "students",
      },
    });

    //if no attendance existed
    if (!attendance)
      return res
        .status(404)
        .json({ success: false, message: "attendance not found" });

    return res.json({
      success: true,
      message: "attendance found",
      attendance: attendance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//@route POST /api/attendance
//@desc create attendance list for a course
//@accessability private
router.post("/", verifyToken, async (req, res) => {
  const { date, courseId, records } = req.body;
  if (!courseId || !date || !records)
    return res
      .status(400)
      .json({ success: false, message: "Missing course id/date/records" });
  try {
    const course = await Course.findOne({ _id: courseId, user: req.userId });
    if (!course)
      return res
        .status(400)
        .json({ success: false, message: "Course not found" });

    //check if attendance for course on that date already exists
    const existedAttendance = await Attendance.findOne({
      course: courseId,
      date,
      user: req.userId,
    });
    if (existedAttendance)
      return res
        .status(400)
        .json({ success: false, message: "attendance already exists" });

    //create new attendance and return it
    const newAttendance = new Attendance({
      date,
      records,
      course: courseId,
      user: req.userId,
    });

    await (
      await newAttendance.save()
    ).populate({
      path: "records",
      populate: {
        path: "student",
      },
    });

    //push new attendance id to course.attendances
    course.attendances.push(newAttendance._id);
    await course.save();
    res.json({
      success: true,
      message: "attendance created",
      attendance: newAttendance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//@route PUT /api/attendance/attendanceId
//@desc edit attendance for enrolled students in a course (when click save data)
//@accessability private
router.put("/:attendanceId", verifyToken, async (req, res) => {
  const { records } = req.body; //only allow update records, not date atm
  const attendanceId = req.params.attendanceId;

  if (!records || !attendanceId)
    return res
      .status(400)
      .json({ success: false, message: "Missing records/attendanceId" });
  try {
    //update attendance
    let updatedAttendance = {
      records,
    };
    const filterAttendance = { _id: attendanceId, user: req.userId };
    updatedAttendance = await Attendance.findOneAndUpdate(
      filterAttendance,
      updatedAttendance,
      { new: true }
    ).populate({
      path: "records",
      populate: {
        path: "student",
      },
    });
    if (!updatedAttendance)
      return res.status(401).json({
        success: false,
        message: "User not authorized/ attendance list not found",
      });
    res.json({
      success: true,
      message: "attendance updated",
      attendance: updatedAttendance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//@route DELETE /api/attendance/:attendanceId
//@desc delete attendance for enrolled students in a course
//@accessability private
router.delete("/:attendanceId", verifyToken, async (req, res) => {
  const attendanceId = req.params.attendanceId;

  //validation
  if (!attendanceId)
    return res
      .status(400)
      .json({ success: false, message: "attendance list not found" });
  try {
    //delete attendance
    const deletedAttendance = await Attendance.findOneAndDelete({
      _id: attendanceId,
      user: req.userId,
    });
    if (!deletedAttendance)
      return res
        .status(400)
        .json({ success: false, message: "Attendance does not exist" });
    //delete attendance in course
    const courseId = deletedAttendance.course;
    await Course.findOneAndUpdate(
      { _id: courseId, user: req.userId },
      { $pull: { attendances: deletedAttendance._id } }
    );
    res.json({
      success: true,
      message: "Delete successful",
      attendance: deletedAttendance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;

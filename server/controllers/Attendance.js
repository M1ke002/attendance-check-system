// require("dotenv").config();

const Course = require("../models/Course");
const Attendance = require("../models/Attendance");

const getAttendanceList = async (req, res) => {
  const { attendanceId } = req.query;
  if (!attendanceId)
    return res
      .status(400)
      .json({ success: false, message: "Missing attendanceId" });
  try {
    //check if the attendance for course already exists
    const attendance = await Attendance.findOne({
      _id: attendanceId,
      user: req.userId,
    }).populate({
      path: "records",
      populate: {
        path: "student",
      },
    });

    //if no session existed
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
};

const getAttendanceDetails = async (req, res) => {
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
};

const createAttendanceList = async (req, res) => {
  const { date, courseId, records, sessionName, startTime, endTime } = req.body;
  if (!courseId || !date || !records || !sessionName || !startTime || !endTime)
    return res.status(400).json({ success: false, message: "Missing data" });
  try {
    const course = await Course.findOne({ _id: courseId, user: req.userId });
    if (!course)
      return res
        .status(400)
        .json({ success: false, message: "Course not found" });

    //create new attendance and return it
    const attendance = new Attendance({
      date,
      records,
      course: courseId,
      sessionName,
      startTime,
      endTime,
      user: req.userId,
    });

    await (
      await attendance.save()
    ).populate({
      path: "records",
      populate: {
        path: "student",
      },
    });

    //push new attendance id to course.attendances
    course.attendances.push(attendance._id);
    await course.save();
    res.json({
      success: true,
      message: "attendance created",
      attendance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const editAttendanceList = async (req, res) => {
  const { records, date, sessionName, startTime, endTime } = req.body;
  const attendanceId = req.params.attendanceId;

  if (
    !records ||
    !attendanceId ||
    !date ||
    !sessionName ||
    !startTime ||
    !endTime
  )
    return res
      .status(400)
      .json({ success: false, message: "Missing data for update attendance" });
  try {
    //update attendance
    let updatedAttendance = {
      records,
      date,
      sessionName,
      startTime,
      endTime,
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
};

const deleteAttendanceList = async (req, res) => {
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
};

const checkAttendance = async (req, res) => {
  const { studentId, attendanceId } = req.body;
  if (!studentId || !attendanceId)
    return res
      .status(400)
      .json({ success: false, message: "Missing student id/attendance id" });
  try {
    const attendance = await Attendance.findOne({ _id: attendanceId });
    if (!attendance)
      return res
        .status(400)
        .json({ success: false, message: "Attendance does not exist" });
    //if attendance is not valid anymore
    if (!attendance.valid)
      return res.status(400).json({
        success: false,
        message: "You can't check attendance on this date",
      });

    const updatedAttendance = await Attendance.findOneAndUpdate(
      { _id: attendanceId },
      {
        $set: {
          "records.$[record].present": true,
        },
      },
      {
        arrayFilters: [
          {
            "record.student": studentId,
          },
        ],
        new: true,
      }
    );
    res.json({
      success: true,
      message: "Attendance checked!",
      attendance: updatedAttendance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const setAttendanceValidity = async (req, res) => {
  const { attendanceId, isValid } = req.body;
  if (!attendanceId || isValid === null)
    return res
      .status(400)
      .json({ success: false, message: "Missing attendance id/isValid" });
  try {
    const attendance = await Attendance.findOne({
      _id: attendanceId,
      user: req.userId,
    });
    if (!attendance)
      return res
        .status(400)
        .json({ success: false, message: "Attendance does not exist" });

    const updatedAttendance = await Attendance.findOneAndUpdate(
      { _id: attendanceId, user: req.userId },
      {
        $set: {
          valid: isValid,
        },
      },
      { new: true }
    );
    res.json({
      success: true,
      message: `Attendance validity is set to ${isValid}`,
      attendance: updatedAttendance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getAttendanceList,
  getAttendanceDetails,
  createAttendanceList,
  editAttendanceList,
  deleteAttendanceList,
  checkAttendance,
  setAttendanceValidity,
};

const Course = require("../models/Course");
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");

const enrollStudentForCourse = async (req, res) => {
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

    //check if student already exists
    let student = await Student.findOne({ studentId, user: req.userId });

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
};

const enrollStudentsForCourse = async (req, res) => {
  const { studentData, courseId } = req.body;
  let studentCount = 0;
  const length = studentData.length;
  const addedStudents = [];
  //validation
  if (!studentData || !courseId)
    return res
      .status(400)
      .json({ success: false, message: "Missing student data/courseId" });

  try {
    //check if course exists
    const course = await Course.findOne({ _id: courseId, user: req.userId });
    if (!course)
      return res.status(400).json({
        success: false,
        message: "course not found/user not authenticated",
      });

    for (let data of studentData) {
      const { studentId, name } = data;

      if (!studentId) continue;

      //check if student already exists
      let student = await Student.findOne({ studentId, user: req.userId });

      if (student) {
        const existedCourseId = student.enrolledCourses.find((id) =>
          id.equals(courseId)
        );
        //already enrolled in course => skip
        if (existedCourseId) continue;
        student.enrolledCourses.push(courseId);
      } else {
        if (!name) continue;
        student = new Student({
          studentId,
          name,
          enrolledCourses: [courseId],
          user: req.userId,
        });
      }
      await student.save();
      course.students.push(student._id);
      addedStudents.push({ student });
      studentCount++;
    }
    //add students to all attendance list of that course
    await Attendance.updateMany(
      { course: courseId, user: req.userId },
      { $push: { records: { $each: [...addedStudents] } } }
    );
    course.markModified("students");
    await course.save();
    res.json({
      success: true,
      message: `${studentCount}/${length} students added`,
      students: addedStudents,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const removeStudentFromCourse = async (req, res) => {
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
    // student = await Student.findOneAndUpdate(
    //   { _id: id, user: req.userId },
    //   { $pull: { enrolledCourses: courseId } }
    // );

    student.enrolledCourses = student.enrolledCourses.filter(
      (id) => !id.equals(courseId)
    );
    await student.save();

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
};

const removeStudentsFromCourse = async (req, res) => {
  const { studentIds, courseId } = req.body;
  let studentCount = 0;
  const length = studentIds.length;
  const removedStudents = [];
  //validation
  if (!studentIds || studentIds.length === 0 || !courseId)
    return res
      .status(400)
      .json({ success: false, message: "Missing student ids/courseId" });

  try {
    for (let i = 0; i < studentIds.length; i++) {
      const id = studentIds[i];
      //check if student exists
      let student = await Student.findOne({ _id: id, user: req.userId });
      if (!student) continue;

      //check if student is enrolled in the course
      const existedCourseId = student.enrolledCourses.find((id) =>
        id.equals(courseId)
      );
      if (!existedCourseId) continue;

      //remove course from enrolledCourses of the student
      student.enrolledCourses = student.enrolledCourses.filter(
        (id) => !id.equals(courseId)
      );
      await student.save();
      removedStudents.push(student);
      studentCount++;
    }
    const removedStudentIds = removedStudents.map((student) => student._id);
    await Course.findOneAndUpdate(
      { _id: courseId, user: req.userId },
      { $pull: { students: { $in: [...removedStudentIds] } } }
    );
    await Attendance.updateMany(
      { course: courseId, user: req.userId },
      { $pull: { records: { student: { $in: [...removedStudentIds] } } } }
    );
    res.json({
      success: true,
      message: `${studentCount}/${length} students removed`,
      removedStudents,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const searchStudent = async (req, res) => {
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
};

const getAllStudents = async (req, res) => {
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
};

const createStudent = async (req, res) => {
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
};

const editStudent = async (req, res) => {
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
};

const deleteAllStudents = async (req, res) => {
  try {
    //delete all students from db
    const result = await Student.deleteMany({
      user: req.userId,
    });
    if (!result)
      return res.status(400).json({
        success: false,
        message: "Error while deleting students",
      });

    //set all courses 'students' field in Course model to empty array
    await Course.updateMany({ user: req.userId }, { $set: { students: [] } });

    //set all attendances 'records' field in Attendance model to empty array
    await Attendance.updateMany(
      { user: req.userId },
      { $set: { records: [] } }
    );
    res.json({
      success: true,
      message: `${result.deletedCount} student(s) deleted`,
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteStudent = async (req, res) => {
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
};

module.exports = {
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
};

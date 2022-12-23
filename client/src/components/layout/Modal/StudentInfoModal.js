import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { toast } from "react-toastify";
import { useState, useEffect, useContext } from "react";
import { courseContext } from "../../../contexts/CourseContext";
import { studentContext } from "../../../contexts/StudentContext";
import { attendanceContext } from "../../../contexts/AttendanceContext";

function StudentInfoModal({ data }) {
  const { setShowStudentInfoModal, showStudentInfoModal, student } = data;
  const [isEditable, setIsEditable] = useState(false);
  const [editBtnText, setEditBtnText] = useState("Edit");
  const [isSaving, setIsSaving] = useState(false);
  const [inputField, setInputField] = useState({
    name: student?.name,
    studentId: student?.studentId,
  });
  const { name, studentId } = inputField;
  console.log(student);

  const {
    courseState: { courses, selectedCourseInfo },
    getAllCourses,
  } = useContext(courseContext);
  const { course: selectedCourse, date } = selectedCourseInfo;
  const { deselectStudent, updateStudent } = useContext(studentContext);
  const { getAttendance } = useContext(attendanceContext);

  //update input field state when selected student is changed
  useEffect(() => {
    setInputField({
      name: student?.name,
      studentId: student?.studentId,
    });
  }, [student]);

  const getCoursesInfo = (courseIds, courses) => {
    if (!courseIds || !courses) return [];
    return courseIds.map((courseId) => {
      return courses.find((course) => course._id === courseId);
    });
  };

  const handleFormInput = (e) => {
    setInputField({
      ...inputField,
      [e.target.name]: e.target.value,
    });
  };

  const onCancel = () => {
    setInputField({
      name: student?.name,
      studentId: student?.studentId,
    });
    setIsEditable(false);
    setEditBtnText("Edit");
  };

  const onCloseModal = () => {
    if (isSaving) return;
    setShowStudentInfoModal(false);
    setInputField({
      name: student?.name,
      studentId: student?.studentId,
    });
    setIsEditable(false);
    setEditBtnText("Edit");
    deselectStudent(null);
    // setTimeout(() => deselectStudent(null), 0);
  };

  const handleEditStudentInfo = async (e) => {
    e.preventDefault();
    if (editBtnText === "Edit") {
      setIsEditable(true);
      setEditBtnText("Save");
      return;
    }
    //validate input
    if (name.trim() === "" || studentId.trim() === "") {
      console.log("Can't leave empty field!");
      toast.error("Can't leave empty field!", {
        theme: "colored",
        autoClose: 2000,
      });
      return;
    }
    setIsSaving(true);
    const res = await updateStudent({
      name,
      studentId,
      _id: student?._id,
    });
    if (res.success) {
      //update foundStudents ->done by student context
      //if student enrolled in course(s) -> get all courses
      const updatedStudent = res.student;
      if (updatedStudent.courseIds.length > 0) {
        await getAllCourses();
        //if there is selected course and date and that course is one of student's enrolled courses -> get attendance
        if (
          selectedCourse &&
          date &&
          updatedStudent.courseIds.find(
            (courseId) => courseId === selectedCourse._id
          )
        )
          await getAttendance({
            courseId: selectedCourse._id,
            date,
          });
      }
      console.log("updated student");
      toast.success(res.message, {
        theme: "colored",
        autoClose: 2000,
      });
    } else {
      toast.error(res.message, {
        theme: "colored",
        autoClose: 2000,
      });
    }
    setIsSaving(false);
  };

  return (
    <Modal show={showStudentInfoModal} centered onHide={onCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Student Info</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleEditStudentInfo}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name"
              name="name"
              disabled={!isEditable}
              value={name ? name : ""}
              onChange={handleFormInput}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="mt-2">Student ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Student ID"
              name="studentId"
              disabled={!isEditable}
              value={studentId ? studentId : ""}
              onChange={handleFormInput}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="mt-2">Enrolled courses</Form.Label>
            <Card style={{ maxHeight: "100px", overflowY: "scroll" }}>
              <ListGroup variant="flush">
                {getCoursesInfo(student?.courseIds, courses).map(
                  (course, index) => (
                    <ListGroup.Item key={index}>
                      <Card.Link
                        href={`/courses/${course._id}`}
                        className="link"
                      >
                        {course.name} - {course.year}
                      </Card.Link>
                    </ListGroup.Item>
                  )
                )}
                {(!student?.courseIds ||
                  !courses ||
                  student?.courseIds.length === 0 ||
                  courses.length === 0) && (
                  <ListGroup.Item>No courses enrolled</ListGroup.Item>
                )}
              </ListGroup>
            </Card>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="info" type="submit" disabled={isSaving}>
            {editBtnText}
          </Button>
          {isEditable && (
            <Button
              className="ms-2"
              variant="danger"
              onClick={onCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default StudentInfoModal;

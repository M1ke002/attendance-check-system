import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import AlertMessage from "../AlertMessage";
import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { courseContext } from "../../../contexts/CourseContext";
import { studentContext } from "../../../contexts/StudentContext";
import { attendanceContext } from "../../../contexts/AttendanceContext";

function StudentInfoModal({ data }) {
  const { setShowStudentInfoModal, showStudentInfoModal } = data;

  const {
    courseState: { courses, selectedCourseInfo },
    getAllCourses,
  } = useContext(courseContext);
  const { course: selectedCourse } = selectedCourseInfo;
  const {
    studentState: { selectedStudent },
    updateStudent,
  } = useContext(studentContext);
  const {
    getAttendance,
    attendanceState: { attendance },
  } = useContext(attendanceContext);

  const [isEditable, setIsEditable] = useState(false);
  const [editBtnText, setEditBtnText] = useState("Edit");
  const [isSaving, setIsSaving] = useState(false);
  const [alert, setAlert] = useState({
    message: "",
    show: false,
    type: "",
  });
  const [inputField, setInputField] = useState({
    name: selectedStudent?.name,
    studentId: selectedStudent?.studentId,
  });
  const { name, studentId } = inputField;
  // console.log(selectedStudent);

  //update input field state when selected student is changed
  useEffect(() => {
    setInputField({
      name: selectedStudent?.name,
      studentId: selectedStudent?.studentId,
    });
  }, [selectedStudent]);

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
      name: selectedStudent?.name,
      studentId: selectedStudent?.studentId,
    });
    setIsEditable(false);
    setEditBtnText("Edit");
  };

  const onCloseModal = () => {
    if (isSaving) return;
    setShowStudentInfoModal(false);
    setInputField({
      name: selectedStudent?.name,
      studentId: selectedStudent?.studentId,
    });
    setIsEditable(false);
    setEditBtnText("Edit");
    setAlert({ ...alert, show: false });
    // deselectStudent(null);
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
      setAlert({
        ...alert,
        message: "Can't leave empty field",
        show: true,
        type: "light-danger",
      });
      return;
    }
    setIsSaving(true);
    const res = await updateStudent({
      name,
      studentId,
      _id: selectedStudent?._id,
    });
    if (res.success) {
      //update foundStudents ->done by student context
      //if student enrolled in course(s) -> get all courses
      const updatedStudent = res.student;
      if (updatedStudent.enrolledCourses.length > 0) {
        await getAllCourses();
        //if there is selected course and date and that course is one of student's enrolled courses -> get attendance
        if (
          selectedCourse &&
          attendance &&
          updatedStudent.enrolledCourses.find(
            (courseId) => courseId === selectedCourse._id
          )
        )
          await getAttendance({
            attendanceId: attendance._id,
          });
      }
      console.log("updated student");
      setAlert({
        ...alert,
        message: res.message,
        show: true,
        type: "light-success",
      });
      setIsEditable(false);
      setEditBtnText("Edit");
    } else {
      setAlert({
        ...alert,
        message: res.message,
        show: true,
        type: "light-danger",
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
                {getCoursesInfo(selectedStudent?.courseIds, courses).map(
                  (course, index) => (
                    <ListGroup.Item key={index}>
                      <Link to={`/courses/${course?._id}`} className="link">
                        {course?.name} - {course?.year}
                      </Link>
                    </ListGroup.Item>
                  )
                )}
                {(!selectedStudent?.courseIds ||
                  !courses ||
                  selectedStudent?.courseIds.length === 0 ||
                  courses.length === 0) && (
                  <ListGroup.Item>No courses enrolled</ListGroup.Item>
                )}
              </ListGroup>
            </Card>
          </Form.Group>
          {alert.show && (
            <AlertMessage
              data={{
                alert,
                setAlert,
                otherStyles: { margin: "11px 0 -4px" },
              }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="info" type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : editBtnText}
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

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import AlertMessage from "../AlertMessage";
import { useState, useContext } from "react";
import { courseContext } from "../../../contexts/CourseContext";
import { attendanceContext } from "../../../contexts/AttendanceContext";
import { studentContext } from "../../../contexts/StudentContext";

const getDisplayedCourses = (courses) => {
  const displayedCourses = courses.map((course) => {
    return {
      ...course,
      value: course._id,
      label: `${course.name} - ${course.year}`,
    };
  });
  return displayedCourses;
};

function AddStudentModal({ data }) {
  const { showAddStudentModal, setShowAddStudentModal } = data;
  const [isAdding, setIsAdding] = useState(false);
  const [alert, setAlert] = useState({
    message: "",
    show: false,
    type: "",
  });
  const [inputField, setInputField] = useState({
    name: "",
    studentId: "",
    selectedCourseId: null,
  });
  const { name, studentId, selectedCourseId } = inputField;

  const { addStudent, enrollStudentForCourse } = useContext(studentContext);
  const { getAttendance } = useContext(attendanceContext);
  const {
    courseState: { courses, isCourseLoading, selectedCourseInfo },
    getAllCourses,
  } = useContext(courseContext);
  const { course, date } = selectedCourseInfo;

  const onCloseModal = () => {
    if (isAdding) return;
    setInputField({
      name: "",
      studentId: "",
      selectedCourseId: null,
    });
    setShowAddStudentModal(false);
    setAlert({ ...alert, show: false });
  };

  const handleFormInput = (e) => {
    setInputField({
      ...inputField,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    //validate input field
    if (name.trim() === "" || studentId.trim() === "") {
      console.log("Can't leave empty field");
      setAlert({
        ...alert,
        message: "Can't leave empty field",
        show: true,
        type: "light-danger",
      });
      return;
    }
    setIsAdding(true);
    let res = await addStudent({
      name,
      studentId,
    });
    if (res.success) {
      if (selectedCourseId) {
        res = await enrollStudentForCourse({
          name,
          studentId,
          courseId: selectedCourseId,
        });
        if (res.success) {
          await getAllCourses();
          if (course && date && course._id === selectedCourseId)
            await getAttendance({
              courseId: course._id,
              date,
            });
          console.log("added student and enrolled");
        } else {
          console.log("added student but couldnt enroll");
        }
      }
      setAlert({
        ...alert,
        message: res.message,
        show: true,
        type: "light-success",
      });
    } else {
      setAlert({
        ...alert,
        message: res.message ? res.message : res,
        show: true,
        type: "light-danger",
      });
    }
    setIsAdding(false);
  };

  return (
    <Modal show={showAddStudentModal} centered onHide={onCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Add student</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleAddStudent}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name"
              name="name"
              value={name}
              onChange={handleFormInput}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="mt-2">Student ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Student ID"
              name="studentId"
              value={studentId}
              onChange={handleFormInput}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="mt-2">Course</Form.Label>
            <Select
              isLoading={isCourseLoading}
              options={isCourseLoading ? [] : getDisplayedCourses(courses)}
              placeholder="Leave blank if no courses for this student"
              noOptionsMessage={() => "No courses found"}
              isClearable
              onChange={(e) => {
                setInputField({
                  ...inputField,
                  selectedCourseId: e ? e.value : null,
                });
              }}
            />
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
          <Button variant="info" type="submit" disabled={isAdding}>
            {isAdding ? "Adding..." : "Add"}
          </Button>
          <Button variant="danger" disabled={isAdding} onClick={onCloseModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddStudentModal;

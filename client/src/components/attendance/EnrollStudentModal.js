import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import SearchIcon from "@mui/icons-material/Search";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Spinner from "react-bootstrap/Spinner";

import { studentContext } from "../../contexts/StudentContext";
import { courseContext } from "../../contexts/CourseContext";
import { attendanceContext } from "../../contexts/AttendanceContext";
import { useState, useContext } from "react";

// import { toast } from 'react-toastify';

function EnrollStudentModal() {
  const [isFinding, setIsFinding] = useState(false);
  const [key, setKey] = useState("add students");
  const [foundStudents, setFoundStudents] = useState([]);
  const [studentInputField, setStudentInputField] = useState({
    studentId: "",
    name: "",
    findStudentsField: "",
    selectedStudentField: "",
  });
  const {
    showEnrollStudentModal,
    setShowEnrollStudentModal,
    enrollStudentForCourse,
    findStudents,
  } = useContext(studentContext);

  const {
    courseState: {
      selectedCourseInfo: { course, date },
    },
    getAllCourses,
  } = useContext(courseContext);

  const { getAttendance } = useContext(attendanceContext);

  const { studentId, name, findStudentsField, selectedStudentField } =
    studentInputField;

  const handleFormInput = (e) => {
    setStudentInputField({
      ...studentInputField,
      [e.target.name]: e.target.value,
    });
  };

  const getSearchResults = async () => {
    const searchValue = findStudentsField.trim().toLowerCase();
    if (searchValue === "") return;
    setIsFinding(true);
    const res = await findStudents(searchValue);
    setIsFinding(false);
    if (res.success) {
      setFoundStudents(res.students);
    } else {
      setFoundStudents([]);
    }
  };

  const onCloseModal = () => {
    setShowEnrollStudentModal(false);
    setStudentInputField({
      studentId: "",
      name: "",
      findStudentsField: "",
      selectedStudentField: "",
    });
    setFoundStudents([]);
  };

  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    if (!course) {
      console.log("Must go to a course first!");
      return;
    }
    let enrollInfo = null;
    if (key === "find students") {
      if (
        selectedStudentField === "not selected" ||
        selectedStudentField === ""
      ) {
        console.log("please select a student");
        return;
      }
      // console.log(selectedStudentField, course._id);
      enrollInfo = {
        studentId: selectedStudentField,
        courseId: course._id,
      };
    } else if (key === "add students") {
      if (studentId.trim() === "") {
        console.log("Can't leave empty field");
        return;
      }
      // console.log(studentId, name, course._id);
      enrollInfo = {
        studentId,
        name,
        courseId: course._id,
      };
    }
    if (!enrollInfo) {
      console.log("sth wrong when enroll student");
    }
    const res = await enrollStudentForCourse(enrollInfo);
    console.log(res);
    if (res.success) {
      await getAllCourses();
      await getAttendance({
        courseId: course._id,
        date,
      });
    }
  };

  return (
    <Modal show={showEnrollStudentModal} centered onHide={onCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Enroll student(s)</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleEnrollStudent}>
        <Modal.Body>
          <Tabs activeKey={key} onSelect={(k) => setKey(k)}>
            <Tab eventKey="add students" title="Add students">
              <Form.Group>
                <Form.Label className="mt-2">Student ID*</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ex: BI11-001"
                  name="studentId"
                  className="mb-1"
                  value={studentId}
                  onChange={handleFormInput}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label className="mt-2">Student Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="optional if student already exists in system"
                  name="name"
                  className="mb-1"
                  value={name}
                  onChange={handleFormInput}
                />
              </Form.Group>
            </Tab>
            <Tab eventKey="find students" title="Find students">
              <Form.Group>
                <Form.Label className="mt-2">Find existing students</Form.Label>
                <InputGroup className="mb-3">
                  <Form.Control
                    type="text"
                    name="findStudentsField"
                    placeholder="Search by ID or name"
                    value={findStudentsField}
                    onChange={handleFormInput}
                  />
                  <Button
                    variant="primary"
                    style={{ height: 38 }}
                    className="d-flex align-items-center"
                    onClick={() => {
                      getSearchResults();
                      setStudentInputField({
                        ...studentInputField,
                        selectedStudentField: "",
                      });
                    }}
                  >
                    {isFinding ? (
                      <Spinner animation="border" size="sm" variant="light" />
                    ) : (
                      <SearchIcon />
                    )}
                  </Button>
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  Found: {foundStudents.length > 0 ? foundStudents.length : 0}{" "}
                  student(s)
                </Form.Label>
                <Form.Select
                  name="selectedStudentField"
                  onChange={handleFormInput}
                >
                  <option value="not selected">Select a student</option>
                  {foundStudents.map((student) => (
                    <option
                      key={student._id}
                      value={student.studentId}
                    >{`${student.studentId} ${student.name}`}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="info" type="submit">
            Add
          </Button>
          <Button variant="danger" onClick={onCloseModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default EnrollStudentModal;

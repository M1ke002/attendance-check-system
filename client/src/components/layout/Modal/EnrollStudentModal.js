import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import SearchIcon from "@mui/icons-material/Search";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Spinner from "react-bootstrap/Spinner";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import AlertMessage from "../AlertMessage";
import { studentContext } from "../../../contexts/StudentContext";
import { courseContext } from "../../../contexts/CourseContext";
import { attendanceContext } from "../../../contexts/AttendanceContext";
import { useState, useContext } from "react";

function EnrollStudentModal({ data }) {
  const { showEnrollStudentModal, setShowEnrollStudentModal } = data;
  const [isFinding, setIsFinding] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [key, setKey] = useState("add students");
  const [foundStudents, setFoundStudents] = useState([]);
  const [alert, setAlert] = useState({
    message: "",
    show: false,
    type: "",
  });
  const [studentInputField, setStudentInputField] = useState({
    studentId: "",
    name: "",
    findStudentsField: "",
    selectedStudentField: "",
  });
  const { enrollStudentForCourse, findStudents } = useContext(studentContext);

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
    if (isAdding) return;
    setShowEnrollStudentModal(false);
    setStudentInputField({
      studentId: "",
      name: "",
      findStudentsField: "",
      selectedStudentField: "",
    });
    setFoundStudents([]);
    setAlert({ ...alert, show: false });
  };

  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    if (!course) {
      console.log("Must go to a course first!");
      setAlert({
        ...alert,
        message: "Must go to a course first!",
        show: true,
        type: "light-danger",
      });
      return;
    }
    let enrollInfo = null;
    if (key === "find students") {
      if (
        selectedStudentField === "not selected" ||
        selectedStudentField === ""
      ) {
        console.log("please select a student");
        setAlert({
          ...alert,
          message: "please select a student",
          show: true,
          type: "light-danger",
        });
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
        setAlert({
          ...alert,
          message: "Can't leave empty field",
          show: true,
          type: "light-danger",
        });
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
    setIsAdding(true);
    const res = await enrollStudentForCourse(enrollInfo);
    console.log(res);
    if (res.success) {
      await getAllCourses();
      await getAttendance({
        courseId: course._id,
        date,
      });
      setAlert({
        ...alert,
        message: `${res.message}: ${res.student.name}`,
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
    <>
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
                  <Form.Label className="mt-2">
                    Find existing students
                  </Form.Label>
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
            <Button variant="danger" onClick={onCloseModal} disabled={isAdding}>
              Cancel
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgb(0 0 0 / 30%);",
        }}
        open={isAdding}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

export default EnrollStudentModal;

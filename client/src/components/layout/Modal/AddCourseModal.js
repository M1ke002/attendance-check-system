import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import AlertMessage from "../AlertMessage";
import { useState, useContext } from "react";
import { courseContext } from "../../../contexts/CourseContext";
import { getYearRange } from "../../../utils/utilsFunction";

const currYear = new Date().getFullYear();
const years = getYearRange(currYear);

function AddCourseModal({ data }) {
  const { setShowAddCourseModal, showAddCourseModal } = data;
  const [isAdding, setIsAdding] = useState(false);
  const [inputField, setInputField] = useState({
    courseName: "",
    courseCode: "",
    year: currYear,
  });
  const { courseName, courseCode, year } = inputField;
  const { createCourse } = useContext(courseContext);
  const [alert, setAlert] = useState({
    message: "",
    show: false,
    type: "",
  });

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (courseName.trim() === "" || courseCode.trim() === "") {
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
    const res = await createCourse({
      name: courseName,
      courseCode,
      year,
    });
    setIsAdding(false);
    console.log(res);
    if (res.success) {
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
  };

  const handleFormInput = (e) => {
    setInputField({
      ...inputField,
      [e.target.name]: e.target.value,
    });
  };

  const onCloseModal = () => {
    if (isAdding) return;
    setShowAddCourseModal(false);
    setInputField({
      courseName: "",
      courseCode: "",
      year: currYear,
    });
    setAlert({ ...alert, show: false });
  };

  return (
    <Modal show={showAddCourseModal} centered onHide={onCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Add course</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleAddCourse}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Course name</Form.Label>
            <Form.Control
              type="text"
              name="courseName"
              placeholder="Course name"
              value={courseName}
              onChange={handleFormInput}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="mt-2">Course code</Form.Label>
            <Form.Control
              type="text"
              name="courseCode"
              placeholder="Course code"
              value={courseCode}
              onChange={handleFormInput}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="mt-2">Year</Form.Label>
            <Form.Select value={year} name="year" onChange={handleFormInput}>
              {years.map((year, index) => {
                return (
                  <option key={`year${index}`} value={year}>
                    {year}
                  </option>
                );
              })}
            </Form.Select>
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
          <Button variant="danger" onClick={onCloseModal} disabled={isAdding}>
            Cancel
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddCourseModal;

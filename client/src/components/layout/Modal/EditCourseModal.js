import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import AlertMessage from "../AlertMessage";
import { useState, useContext, useEffect } from "react";
import { courseContext } from "../../../contexts/CourseContext";

const getYears = (year) => {
  const arr = [];
  for (let i = year - 2; i <= year + 2; i++) arr.push(i);
  return arr;
};

const currYear = new Date().getFullYear();
const years = getYears(currYear);

function EditCourseModal({ data }) {
  const { showEditCourseModal, setShowEditCourseModal, selectedCourse } = data;
  const [isSaving, setIsSaving] = useState(false);
  const [inputField, setInputField] = useState(selectedCourse);
  const { name, code, year, _id } = inputField;
  const { getAllCourses, updateCourse } = useContext(courseContext);
  const [alert, setAlert] = useState({
    message: "",
    show: false,
    type: "",
  });

  //update input field state when selected course is changed
  useEffect(() => setInputField(selectedCourse), [selectedCourse]);

  const handleEditCourse = async (e) => {
    e.preventDefault();
    if (name.trim() === "" || code.trim() === "") {
      console.log("Can't leave empty field");
      setAlert({
        ...alert,
        message: "Can't leave empty field",
        show: true,
        type: "light-danger",
      });
      return;
    }
    setIsSaving(true);
    const res = await updateCourse({
      name,
      courseCode: code,
      year,
      _id,
    });
    console.log(res);
    if (res.success) {
      await getAllCourses();
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
    setIsSaving(false);
  };

  const handleFormInput = (e) => {
    setInputField({
      ...inputField,
      [e.target.name]: e.target.value,
    });
  };

  const onCloseModal = () => {
    if (isSaving) return;
    setShowEditCourseModal(false);
    setInputField(selectedCourse);
    setAlert({ ...alert, show: false });
  };

  return (
    <Modal show={showEditCourseModal} centered onHide={onCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Edit course</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleEditCourse}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Course name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Course name"
              value={name}
              onChange={handleFormInput}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="mt-2">Course code</Form.Label>
            <Form.Control
              type="text"
              name="code"
              placeholder="Course code"
              value={code}
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
          <Button variant="info" type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button variant="danger" onClick={onCloseModal} disabled={isSaving}>
            Cancel
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default EditCourseModal;

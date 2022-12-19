import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState, useEffect, useContext } from "react";
import { courseContext } from "../../contexts/CourseContext";
import { getYearRange } from "../../utils/utilsFunction";
import { toast } from "react-toastify";

const currYear = new Date().getFullYear();
const years = getYearRange(currYear);

function CourseInfo({ course }) {
  const { updateCourse } = useContext(courseContext);
  const [editBtnText, setEditBtnText] = useState("Edit");
  const [isSaving, setIsSaving] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [inputField, setInputField] = useState(course);
  const { attendances, courseCode, name, students, year, _id } = inputField;

  //update input field state when selected course is changed
  useEffect(() => setInputField(course), [course]);

  const handleFormInput = (e) => {
    setInputField({
      ...inputField,
      [e.target.name]: e.target.value,
    });
  };

  const onCancel = () => {
    setInputField(course);
    setIsEditable(false);
    setEditBtnText("Edit");
  };

  const handleEditCourse = async (e) => {
    e.preventDefault();
    if (editBtnText === "Edit") {
      setIsEditable(true);
      setEditBtnText("Save");
      return;
    }
    //validate input
    if (name.trim() === "" || courseCode.trim() === "") {
      console.log("Can't leave empty field!");
      toast.error("Can't leave empty field!", {
        theme: "colored",
        autoClose: 2000,
      });
      return;
    }
    setIsSaving(true);
    const res = await updateCourse({
      name,
      courseCode,
      year,
      _id,
    });
    setIsSaving(false);
    if (res.success) {
      toast.success(res.message, {
        theme: "colored",
        autoClose: 2000,
      });
    } else {
      toast.error(res.message, {
        theme: "colored",
        autoClose: 2000,
      });
      return;
    }
    setIsEditable(false);
    setEditBtnText("Edit");
  };

  return (
    <Card border="0" className="mt-3 p-2">
      <Form onSubmit={handleEditCourse}>
        <Card.Body>
          <Form.Group>
            <Form.Label>Course name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={name}
              onChange={handleFormInput}
              disabled={!isEditable}
            />
          </Form.Group>
          <Row className="mt-3">
            <Form.Group as={Col}>
              <Form.Label>Course code</Form.Label>
              <Form.Control
                type="text"
                name="courseCode"
                value={courseCode}
                onChange={handleFormInput}
                disabled={!isEditable}
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Year</Form.Label>
              <Form.Select
                value={year}
                name="year"
                disabled={!isEditable}
                onChange={handleFormInput}
              >
                {years.map((year, index) => {
                  return (
                    <option key={`year${index}`} value={year}>
                      {year}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
          </Row>
          <Row className="mt-3">
            <Form.Group as={Col}>
              <Form.Label>
                <strong>Enrolled students:</strong> {students.length}
              </Form.Label>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>
                <strong>Total attendances:</strong> {attendances.length}
              </Form.Label>
            </Form.Group>
          </Row>
        </Card.Body>
        <hr style={{ opacity: 0.15, margin: "0 0 10px 0" }} />
        <div className="mt-3 mb-2 me-1 d-flex justify-content-end">
          <Button
            variant="info"
            type="submit"
            className="me-2"
            disabled={isSaving}
          >
            {editBtnText}
          </Button>
          {isEditable && (
            <Button
              className="ms-2"
              variant="danger"
              disabled={isSaving}
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
        </div>
      </Form>
    </Card>
  );
}

export default CourseInfo;

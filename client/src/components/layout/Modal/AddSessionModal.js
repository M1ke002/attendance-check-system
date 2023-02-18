import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import AlertMessage from "../AlertMessage";

import { courseContext } from "../../../contexts/CourseContext";
import { attendanceContext } from "../../../contexts/AttendanceContext";
import {
  convertDateFormat,
  isValidTime,
  validateTimeRange,
} from "../../../utils/utilsFunction";
import { useState, useContext } from "react";

function AddSessionModal({ data }) {
  const { showAddSessionModal, setShowAddSessionModal, course } = data;
  const { getSelectedCourseInfo } = useContext(courseContext);
  const { clearAttendance } = useContext(attendanceContext);
  const [alert, setAlert] = useState({
    message: "",
    show: false,
    type: "",
  });
  const [inputField, setInputField] = useState({
    sessionName: "",
    date: null,
    startTime: "",
    endTime: "",
  });

  const { sessionName, date, startTime, endTime } = inputField;

  const onCloseModal = () => {
    setShowAddSessionModal(false);
    setInputField({
      sessionName: "",
      date: null,
      startTime: "",
      endTime: "",
    });
    setAlert({ ...alert, show: false });
  };

  const handleChangeTimeInput = (e, type, timeLength) => {
    // console.log(e.target.value, type);
    let newTime = e.target.value.trim();
    if (newTime === "") {
      //when delete
      setInputField({
        ...inputField,
        [type]: newTime,
      });
      return;
    }
    if (isValidTime(newTime)) {
      if (newTime.length === 2 && timeLength === 1) {
        //add ':'
        newTime += ":";
      } else if (newTime.length === 2 && timeLength === 3) {
        //remove ':'
        newTime = newTime.substring(0, 1);
      }
      setInputField({
        ...inputField,
        [type]: newTime,
      });
    }
  };

  const handleBlurTimeInput = (e, type) => {
    let time = e.target.value;
    if (time.length < 3)
      setInputField({
        ...inputField,
        [type]: "",
      });
    else {
      while (time.length !== 5) time += "0";
      setInputField({
        ...inputField,
        [type]: time,
      });
    }
  };

  //create new attendance
  const handleCreateClass = async (e) => {
    e.preventDefault();
    //validate input field
    if (sessionName === "" || !date || startTime === "" || endTime === "") {
      console.log("missing input");
      setAlert({
        ...alert,
        message: "Can't leave empty field",
        show: true,
        type: "light-danger",
      });
      return;
    }
    if (!validateTimeRange(startTime, endTime)) {
      console.log("Invalid time range");
      setAlert({
        ...alert,
        message: "Invalid time range",
        show: true,
        type: "light-danger",
      });
      return;
    }
    clearAttendance();
    getSelectedCourseInfo({
      //to display the draft attendance
      courseId: course._id,
      session: {
        date,
        timeRange: [startTime, endTime],
        sessionName,
      },
    });
    onCloseModal();
  };

  return (
    <Modal show={showAddSessionModal} centered onHide={onCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>New session</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleCreateClass}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Course name</Form.Label>
            <Form.Control
              type="text"
              value={`${course.name} - ${course.year}`}
              disabled
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="mt-2">Session name</Form.Label>
            <Form.Control
              type="text"
              name="sessionName"
              placeholder="Session name"
              value={sessionName}
              onChange={(e) =>
                setInputField({
                  ...inputField,
                  sessionName: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="mt-2">Date</Form.Label>
            <Form.Control
              type="date"
              onChange={(e) => {
                setInputField({
                  ...inputField,
                  date:
                    e.target.value === ""
                      ? null
                      : convertDateFormat(e.target.value, "dd/mm/yyyy"),
                });
              }}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="mt-2">Start time - End time</Form.Label>
          </Form.Group>
          <div className="d-inline-flex align-items-center">
            <Form.Control
              type="text"
              placeholder="08:30"
              value={startTime}
              onChange={(event) =>
                handleChangeTimeInput(event, "startTime", startTime.length)
              }
              onBlur={(event) => handleBlurTimeInput(event, "startTime")}
              style={{ width: "68px", marginRight: "10px" }}
            />
            to
            <Form.Control
              type="text"
              placeholder="11:30"
              value={endTime}
              onChange={(event) =>
                handleChangeTimeInput(event, "endTime", endTime.length)
              }
              onBlur={(event) => handleBlurTimeInput(event, "endTime")}
              style={{ width: "68px", marginLeft: "10px" }}
            />
          </div>

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

export default AddSessionModal;

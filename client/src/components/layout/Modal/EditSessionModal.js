import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import AlertMessage from "../AlertMessage";

import {
  convertDateFormat,
  isValidTime,
  validateTimeRange,
} from "../../../utils/utilsFunction";
import { useState, useEffect, useContext } from "react";
import { courseContext } from "../../../contexts/CourseContext";
import { attendanceContext } from "../../../contexts/AttendanceContext";

function EditSessionModal({ data }) {
  const { showEditSessionModal, setShowEditSessionModal, sessionInfo } = data;

  const [isUpdating, setIsUpdating] = useState(false);
  const {
    attendanceState: { attendance },
    updateAttendance,
  } = useContext(attendanceContext);
  const {
    getSelectedCourseInfo,
    courseState: { selectedCourseInfo },
    getAllCourses,
  } = useContext(courseContext);
  const [alert, setAlert] = useState({
    message: "",
    show: false,
    type: "",
  });
  const [inputField, setInputField] = useState({
    sessionName: sessionInfo.sessionName,
    date: convertDateFormat(sessionInfo.date, "yyyy-mm-dd"),
    startTime: sessionInfo.timeRange[0],
    endTime: sessionInfo.timeRange[1],
  });

  // console.log("session", sessionInfo);

  const { sessionName, date, startTime, endTime } = inputField;

  //update input field state when sessionInfo is changed (avoid state being slow behind 1 step)
  useEffect(
    () =>
      setInputField({
        sessionName: sessionInfo.sessionName,
        date: convertDateFormat(sessionInfo.date, "yyyy-mm-dd"),
        startTime: sessionInfo.timeRange[0],
        endTime: sessionInfo.timeRange[1],
      }),
    [sessionInfo]
  );

  const onCloseModal = () => {
    if (isUpdating) return;
    setShowEditSessionModal(false);
    setInputField({
      sessionName: sessionInfo.sessionName,
      date: convertDateFormat(sessionInfo.date, "yyyy-mm-dd"),
      startTime: sessionInfo.timeRange[0],
      endTime: sessionInfo.timeRange[1],
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

  const handleEditSession = async (e) => {
    e.preventDefault();
    //validate input
    if (
      sessionName.trim() === "" ||
      date === "" ||
      startTime === "" ||
      endTime === ""
    ) {
      console.log("invalid input");
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
    //2 cases: edit an unsaved (new) session or an existing session
    setIsUpdating(true);
    if (!attendance) {
      //new unsaved session
      getSelectedCourseInfo({
        courseId: selectedCourseInfo.course._id,
        session: {
          date: convertDateFormat(date, "dd/mm/yyyy"),
          timeRange: [startTime, endTime],
          sessionName,
        },
      });
      setAlert({
        ...alert,
        message: "Session updated!",
        show: true,
        type: "light-success",
      });
    } else {
      //existing session
      const attendanceData = {
        ...attendance,
        date: convertDateFormat(date, "dd/mm/yyyy"),
        startTime,
        endTime,
        sessionName,
      };
      const res = await updateAttendance(attendanceData);
      if (res.success) {
        getSelectedCourseInfo({
          courseId: res.attendance.course,
          session: {
            date: res.attendance.date,
            timeRange: [res.attendance.startTime, res.attendance.endTime],
            sessionName: res.attendance.sessionName,
          },
        });
        await getAllCourses();
        setAlert({
          ...alert,
          message: "Session updated!",
          show: true,
          type: "light-success",
        });
      } else {
        setAlert({
          ...alert,
          message: res.message,
          show: true,
          type: "light-danger",
        });
      }
    }
    setIsUpdating(false);
  };

  return (
    <Modal show={showEditSessionModal} centered onHide={onCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Session Information</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleEditSession}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Course name</Form.Label>
            <Form.Control type="text" value={sessionInfo.courseInfo} disabled />
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
              value={date}
              onChange={(e) => {
                setInputField({
                  ...inputField,
                  date: e.target.value,
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
          <Button variant="info" type="submit" disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update"}
          </Button>
          <Button variant="danger" onClick={onCloseModal} disabled={isUpdating}>
            Close
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default EditSessionModal;

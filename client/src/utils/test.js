import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { convertDateFormat } from "./utilsFunction";
import { useState } from "react";

function EditSessionModal() {
  const [inputField, setInputField] = useState({
    className: "Python programming",
    date: null,
    timeStart: "08:30",
    timeEnd: "11:30",
  });

  const { className, date, timeStart, timeEnd } = inputField;

  const handleChangeTimeInput = (e, type, timeLength) => {
    console.log(e.target.value, type);
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

  const isValidTime = (time) => {
    if (time.length >= 6) return false;
    if (time.length >= 3 && !time.includes(":")) return false;
    //case 30:00 -> invalid
    if (time.length === 1 && !isNaN(time)) return parseInt(time.charAt(0)) < 3;
    //case 24:00 -> invalid
    if (time.length === 2 && !isNaN(time)) {
      if (parseInt(time.charAt(0)) === 2) return parseInt(time.charAt(1)) < 4;
      else return true;
    }
    if (time.length === 3) return true;
    //case 21:60 -> invalid
    if (time.length === 4 && !isNaN(time.charAt(3)))
      return parseInt(time.charAt(3)) < 6;
    if (time.length === 5) return !isNaN(time.charAt(4));
    return false;
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

  return (
    <Modal show={true} centered>
      <Modal.Header closeButton>
        <Modal.Title>Session Information</Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Course name</Form.Label>
            <Form.Control
              type="text"
              value="Python programming - 2023"
              disabled
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="mt-2">Session name</Form.Label>
            <Form.Control
              type="text"
              name="className"
              placeholder="Session name"
              value={className}
              onChange={(e) =>
                setInputField({
                  ...inputField,
                  className: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="mt-2">Date</Form.Label>
            <Form.Control
              type="date"
              value="2023-05-22"
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
              value={timeStart}
              onChange={(event) =>
                handleChangeTimeInput(event, "timeStart", timeStart.length)
              }
              onBlur={(event) => handleBlurTimeInput(event, "timeStart")}
              style={{ width: "68px", marginRight: "10px" }}
            />
            to
            <Form.Control
              type="text"
              placeholder="11:30"
              value={timeEnd}
              onChange={(event) =>
                handleChangeTimeInput(event, "timeEnd", timeEnd.length)
              }
              onBlur={(event) => handleBlurTimeInput(event, "timeEnd")}
              style={{ width: "68px", marginLeft: "10px" }}
            />
          </div>

          {/* {alert.show && (
            <AlertMessage
              data={{
                alert,
                setAlert,
                otherStyles: { margin: "11px 0 -4px" },
              }}
            />
          )} */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="info" type="submit">
            Update
          </Button>
          <Button variant="danger">Close</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default EditSessionModal;

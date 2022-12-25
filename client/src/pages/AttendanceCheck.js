import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import AlertMessage from "../components/layout/AlertMessage";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { attendanceContext } from "../contexts/AttendanceContext";

const getDisplayedStudents = (students) => {
  return students.map((student) => {
    return {
      ...student,
      value: student._id,
      label: `${student.studentId} ${student.name}`,
    };
  });
};

function AttendanceCheck() {
  const { attendanceId } = useParams();
  const [attendanceInfo, setAttendanceInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [alert, setAlert] = useState({
    message: "",
    show: false,
    type: "",
  });

  const { getAttendanceDetails } = useContext(attendanceContext);

  console.log(attendanceId);

  useEffect(() => {
    document.body.style.backgroundColor = "#f7f7f9";
    return () => {
      document.body.style.backgroundColor = "#fff";
    };
  }, []);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const res = await getAttendanceDetails(attendanceId);
      setAttendanceInfo(res.attendance);
      setIsLoading(false);
      console.log(res);
    };
    getData();
  }, [attendanceId, getAttendanceDetails]);

  const handleSelectStudent = () => {
    setIsChecked(true);
    setAlert({
      ...alert,
      message: "Attendance checked!",
      show: true,
      type: "light-success",
    });
  };

  if (isLoading) {
    return (
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgb(0 0 0 / 30%);",
        }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <Container>
      <Card
        border="0"
        className="d-flex justify-content-center shadow-sm px-4 pb-2"
        style={{ marginTop: "18px", marginBottom: "15px" }}
      >
        <Card.Body>
          <p
            style={{
              fontSize: "22px",
              margin: "10px 0 15px 0",
              fontWeight: "600",
              color: "rgb(62 67 73)",
            }}
          >
            Attendance check
          </p>
          <hr
            style={{
              opacity: 0.15,
              marginTop: "10px",
              marginBottom: "15px",
            }}
          />
          <p>
            <strong>Course:</strong>{" "}
            {attendanceInfo ? attendanceInfo.course.name : ""}
          </p>
          <p>
            <strong>Date:</strong> {attendanceInfo ? attendanceInfo.date : ""}
          </p>
          {isChecked && (
            <p>
              <strong>Student:</strong> BI11-100 Mit
            </p>
          )}
          {isChecked ? (
            alert.show && (
              <AlertMessage
                data={{
                  alert,
                  setAlert,
                  dismissible: false,
                  otherStyles: { margin: "11px 0 -4px" },
                }}
              />
            )
          ) : (
            <>
              <p
                style={{
                  fontSize: "16px",
                  margin: "10px 0 10px 0",
                  fontWeight: "600",
                  color: "rgb(62 67 73)",
                }}
              >
                Who are you?
              </p>
              <Select
                isLoading={isLoading}
                options={
                  isLoading
                    ? []
                    : getDisplayedStudents(attendanceInfo.course.students)
                }
                placeholder="Select a student"
                noOptionsMessage={() => "No students found"}
                isClearable
                onChange={(e) => {
                  setSelectedStudent({
                    selectedStudent: e ? e.value : null,
                  });
                }}
              />
              <span
                style={{
                  display: "block",
                  fontSize: "14px",
                  marginTop: "8px",
                }}
              >
                Note: once selected, you won't be able to change the information
              </span>
              <hr
                style={{
                  opacity: 0.15,
                  marginTop: "20px",
                  marginBottom: "15px",
                }}
              />
              <div className="d-flex justify-content-end">
                <Button variant="info" onClick={handleSelectStudent}>
                  Submit
                </Button>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AttendanceCheck;

import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import AlertMessage from "../components/layout/AlertMessage";
import Backdrop from "@mui/material/Backdrop";
import Spinner from "react-bootstrap/Spinner";
import CircularProgress from "@mui/material/CircularProgress";

import { useParams } from "react-router-dom";
import { useState, useEffect, useContext, useMemo } from "react";
import { attendanceContext } from "../contexts/AttendanceContext";
import { STUDENT_TOKEN_NAME } from "../contexts/constants";

const getDisplayedStudents = (students) => {
  return students.map((student) => {
    return {
      ...student,
      value: student._id,
      label: `${student.studentId} ${student.name}`,
    };
  });
};

const getStudentInfoById = (id, students) => {
  const student = students.find((student) => student._id === id);
  if (!student) return "";
  return `${student.studentId} ${student.name}`;
};

function AttendanceCheck() {
  const { attendanceId } = useParams();
  const [attendanceInfo, setAttendanceInfo] = useState(null);
  const [studentId, setStudentId] = useState(() => {
    return localStorage.getItem(STUDENT_TOKEN_NAME);
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [alert, setAlert] = useState({
    message: "",
    show: false,
    type: "",
  });

  const { getAttendanceDetails, checkAttendance } =
    useContext(attendanceContext);

  useEffect(() => {
    document.body.style.backgroundColor = "#f7f7f9";
    return () => {
      document.body.style.backgroundColor = "#fff";
    };
  }, []);

  const check = useMemo(() => {
    //TODO: move check into useeffect?
    return async () => {
      if (attendanceId && studentId) {
        setIsChecking(true);
        const res = await checkAttendance(studentId, attendanceId);
        if (res.success) {
          setAlert((alert) => {
            return {
              ...alert,
              message: res.message,
              show: true,
              type: "light-success",
            };
          });
        } else {
          console.log("check attendance failed", res);
          setAlert((alert) => {
            return {
              ...alert,
              message: res.message,
              show: true,
              type: "light-danger",
            };
          });
        }
        setIsChecking(false);
      }
    };
  }, [studentId, attendanceId, checkAttendance]);

  useEffect(() => {
    check();
  }, [studentId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const res = await getAttendanceDetails(attendanceId);
      if (res.success) {
        setAttendanceInfo(res.attendance);
      } else {
        console.log("Attendance not found!");
      }
      setIsLoading(false);
      // console.log(res);
    };
    getData();
  }, [attendanceId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectStudent = () => {
    if (selectedStudentId === "") {
      console.log("Please select a student!");
      return;
    }
    setStudentId(() => {
      localStorage.setItem(STUDENT_TOKEN_NAME, selectedStudentId);
      return selectedStudentId;
    });
  };

  if (isLoading) {
    return (
      <Backdrop
        sx={{
          color: "#ccc",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgba(166, 174, 176, 0.1)",
        }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (!attendanceInfo) {
    return (
      <AlertMessage
        data={{
          alert: {
            type: "light-danger",
            message: "Page not found",
          },
          setAlert,
          dismissible: false,
          otherStyles: { margin: "11px" },
        }}
      />
    );
  }

  if (studentId && attendanceInfo) {
    if (getStudentInfoById(studentId, attendanceInfo.course.students) === "") {
      return (
        <AlertMessage
          data={{
            alert: {
              type: "light-danger",
              message: "You are not enrolled in this course",
            },
            setAlert,
            dismissible: false,
            otherStyles: { margin: "11px" },
          }}
        />
      );
    }
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
          {studentId && (
            <p>
              <strong>Student:</strong>{" "}
              {attendanceInfo &&
                getStudentInfoById(studentId, attendanceInfo.course.students)}
            </p>
          )}
          {studentId ? (
            isChecking ? (
              <div className="d-flex align-items-center justify-content-center">
                <Spinner
                  as="span"
                  animation="border"
                  role="status"
                  aria-hidden="true"
                />
              </div>
            ) : (
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
                  setSelectedStudentId(e ? e.value : "");
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

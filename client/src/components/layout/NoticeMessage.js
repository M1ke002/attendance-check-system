import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import ClearIcon from "@mui/icons-material/Clear";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { useState } from "react";
import { courseContext } from "../../contexts/CourseContext";
import { attendanceContext } from "../../contexts/AttendanceContext";
import { getDayOfWeek } from "../../utils/utilsFunction";
import { useContext } from "react";
import ConfirmDeleteModal from "../attendance/ConfirmDeleteModal";

function NoticeMessage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const {
    courseState: {
      selectedCourseInfo: { course, date },
    },
    clearSelectedCourseInfo,
    getAllCourses,
  } = useContext(courseContext);

  const {
    deleteAttendance,
    attendanceState: { attendance },
  } = useContext(attendanceContext);

  const handleDeleteAttendance = async () => {
    //remove selected course info and attendance if exists
    if (attendance) {
      setIsLoading(true);
      const res = await deleteAttendance(attendance._id);
      await getAllCourses();
      setIsLoading(false);
      console.log(res);
    }
    clearSelectedCourseInfo();
  };

  if (!course || !date) return null;

  return (
    <>
      <style type="text/css">
        {`
                    .alert-light-success {
                        background-color: #ddf3d8;
                    }
                `}
      </style>

      <Alert
        variant="light-success"
        style={{ height: "4rem" }}
        className="d-flex align-items-center justify-content-between text-black"
      >
        <h5 style={{ color: "#336239", marginBottom: "0" }}>
          Attendance for course {course.courseCode} - {course.year} on{" "}
          {getDayOfWeek(date)}, {date}{" "}
          <span className="ms-1 fs-6 text-dark">
            ({attendance ? "existed" : "new"})
          </span>
        </h5>
        <Button
          variant="link"
          style={{ textDecoration: "none", color: "rgb(204 87 98)" }}
          onClick={() => setShowConfirmDeleteModal(true)}
        >
          <span className="me-1">Click to cancel this class</span>
          <ClearIcon fontSize="small" />
        </Button>
      </Alert>
      <ConfirmDeleteModal
        showConfirmDeleteModal={showConfirmDeleteModal}
        onHide={() => {
          setShowConfirmDeleteModal(false);
        }}
        message={{
          body: isLoading ? "Deleting..." : "Delete this attendance?",
          footer: "Delete",
        }}
        onDelete={async () => {
          setShowConfirmDeleteModal(false);
          await handleDeleteAttendance();
        }}
        onCancel={() => setShowConfirmDeleteModal(false)}
      />

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
    </>
  );
}

export default NoticeMessage;

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import ClearIcon from "@mui/icons-material/Clear";
import InfoIcon from "@mui/icons-material/Info";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import { toast } from "react-toastify";

import { useState } from "react";
import { courseContext } from "../../contexts/CourseContext";
import { attendanceContext } from "../../contexts/AttendanceContext";
import { getDayOfWeek } from "../../utils/utilsFunction";
import { useContext } from "react";
import ConfirmDeleteModal from "./Modal/ConfirmDeleteModal";
import EditSessionModal from "./Modal/EditSessionModal";

function NoticeMessage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [showEditSessionModal, setShowEditSessionModal] = useState(false);
  const {
    courseState: {
      selectedCourseInfo: { course, session },
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
    let message = null;
    if (attendance) {
      setIsLoading(true);
      const res = await deleteAttendance(attendance._id);
      await getAllCourses();
      setIsLoading(false);
      // console.log(res);
      message = res.message;
      if (!res.success) {
        toast.error(res.message, {
          theme: "colored",
          autoClose: 2000,
        });
      }
    }
    clearSelectedCourseInfo();
    toast.success(message ? message : "attendance removed!", {
      theme: "colored",
      autoClose: 2000,
    });
  };

  if (!course || !session) return null;

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
        className="d-flex align-items-center justify-content-between text-black"
      >
        <h5
          style={{ color: "#336239", marginBottom: "0" }}
          className="d-flex align-items-center justify-content-center"
        >
          Attendance for course {course.courseCode} - {course.year} on{" "}
          {getDayOfWeek(session.date)}, {session.date}{" "}
          {!attendance && (
            <span className="ms-1 fs-6 text-dark">(not saved)</span>
          )}
          <Tooltip title="session info" placement="top">
            <Button
              style={{ marginLeft: "15px" }}
              className="d-flex align-items-center"
              variant="primary"
              onClick={() => setShowEditSessionModal(true)}
            >
              <InfoIcon fontSize="small" style={{ color: "white" }} />
            </Button>
          </Tooltip>
        </h5>
        <Button
          variant="link"
          style={{ textDecoration: "none", color: "rgb(204 87 98)" }}
          onClick={() => setShowConfirmDeleteModal(true)}
        >
          <span className="me-1">Delete session</span>
          <ClearIcon fontSize="small" />
        </Button>
      </Alert>
      <EditSessionModal
        data={{
          showEditSessionModal,
          setShowEditSessionModal,
          sessionInfo: {
            ...session,
            courseInfo: `${course.name} - ${course.year}`,
          },
        }}
      />
      <ConfirmDeleteModal
        showConfirmDeleteModal={showConfirmDeleteModal}
        onHide={() => {
          setShowConfirmDeleteModal(false);
        }}
        message={{
          body: isLoading ? "Deleting..." : "Delete this session?",
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

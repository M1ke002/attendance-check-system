import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import ClearIcon from "@mui/icons-material/Clear";

import { courseContext } from "../../contexts/CourseContext";
import { attendanceContext } from "../../contexts/AttendanceContext";
import { getDayOfWeek } from "../../utils/utilsFunction";
import { useContext } from "react";

function NoticeMessage({ setIsFetching }) {
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
      setIsFetching(true);
      const res = await deleteAttendance(attendance._id);
      await getAllCourses();
      setIsFetching(false);
      console.log(res);
    }
    clearSelectedCourseInfo();
  };

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
          onClick={handleDeleteAttendance}
        >
          <span className="me-1">Click to cancel this class</span>
          <ClearIcon fontSize="small" />
        </Button>
      </Alert>
    </>
  );
}

export default NoticeMessage;

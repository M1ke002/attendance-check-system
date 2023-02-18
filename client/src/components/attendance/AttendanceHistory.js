import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import GroupIcon from "@mui/icons-material/Group";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { courseContext } from "../../contexts/CourseContext";
import { attendanceContext } from "../../contexts/AttendanceContext";

function AttendanceHistory({ course }) {
  const navigate = useNavigate();
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);
  const [sortDirection, setSortDirection] = useState("desc");
  const { attendances, students, _id } = course;
  const { getSelectedCourseInfo } = useContext(courseContext);
  const { getAttendance } = useContext(attendanceContext);

  const sortAttendances = () => {
    if (sortDirection === "asc") {
      //sort in desc
      attendances.sort((a, b) => {
        const dateA = a.date.split("/").reverse().join();
        const dateB = b.date.split("/").reverse().join();
        return dateA > dateB ? -1 : dateA < dateB ? 1 : 0;
      });
      setSortDirection("desc");
    } else {
      //sort in asc
      attendances.sort((a, b) => {
        const dateA = a.date.split("/").reverse().join();
        const dateB = b.date.split("/").reverse().join();
        return dateA < dateB ? -1 : dateA > dateB ? 1 : 0;
      });
      setSortDirection("asc");
    }
  };

  const viewAttendance = async (courseId, attendance) => {
    //set selected course info
    //get attendance
    //redirect to attendance page
    setIsLoadingAttendance(true);
    await getAttendance({
      attendanceId: attendance._id,
    });
    setIsLoadingAttendance(false);
    getSelectedCourseInfo({
      courseId,
      session: {
        date: attendance.date,
        timeRange: [attendance.startTime, attendance.endTime],
        sessionName: attendance.sessionName,
      },
    });
    navigate("/attendance");
  };

  const getTotalPresence = (records) => {
    return records.filter((record) => record.present).length;
  };

  return (
    <>
      <Card
        border="0"
        className="my-3 pt-2 px-2 shadow-sm"
        style={{ minHeight: "180px" }}
      >
        <Card.Body>
          <p>
            <strong>Session records</strong>
          </p>
          <TableContainer sx={{ maxHeight: 370, overflow: "scroll-y" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>#</strong>
                  </TableCell>
                  <TableCell align="center">
                    <TableSortLabel
                      active={true}
                      direction={sortDirection}
                      onClick={sortAttendances}
                    >
                      <div className="d-flex justify-content-center align-items-center">
                        <CalendarMonthOutlinedIcon
                          fontSize="small"
                          className="me-1"
                        />
                        <strong>Date</strong>
                      </div>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">
                    <div className="d-flex justify-content-center align-items-center">
                      <LibraryBooksOutlinedIcon
                        fontSize="small"
                        className="me-1"
                      />
                      <strong>Session name</strong>
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    <div className="d-flex justify-content-center align-items-center">
                      <GroupIcon fontSize="small" className="me-1" />
                      <strong>Presence</strong>
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    <div className="d-flex justify-content-center align-items-center">
                      <BorderColorIcon fontSize="small" className="me-1" />
                      <strong>Actions</strong>
                    </div>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendances.map((attendance, index) => {
                  return (
                    <TableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:nth-of-type(odd)": { backgroundColor: "#f7f7f9" },
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell align="center" style={{ padding: "0" }}>
                        {attendance.date}
                      </TableCell>
                      <TableCell align="center" style={{ padding: "0" }}>
                        {/* {`${attendance.startTime} - ${attendance.endTime}`} */}
                        {`${attendance.sessionName}`}
                      </TableCell>
                      <TableCell align="center" style={{ padding: "0" }}>
                        {`${getTotalPresence(attendance.records)}/${
                          students.length
                        }`}
                      </TableCell>
                      <TableCell align="center" style={{ padding: "0" }}>
                        <Button
                          className="btn-sm"
                          variant="info"
                          onClick={() => viewAttendance(_id, attendance)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {attendances.length === 0 && (
                  <TableRow>
                    <TableCell colSpan="5" align="center">
                      No records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card.Body>
      </Card>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgb(0 0 0 / 30%);",
        }}
        open={isLoadingAttendance}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

export default AttendanceHistory;

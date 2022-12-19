import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import EditIcon from "@mui/icons-material/Edit";
import GroupIcon from "@mui/icons-material/Group";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

function AttendanceHistory({ course }) {
  const { attendances, students } = course;

  console.log(attendances);

  const getTotalPresence = (records) => {
    return records.filter((record) => record.present).length;
  };

  return (
    <Card border="0" className="my-3 pt-2 px-2" style={{ minHeight: "180px" }}>
      <Card.Body>
        <p>
          <strong>Attendance records</strong>
        </p>
        <TableContainer sx={{ maxHeight: 370, overflow: "scroll-y" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>#</strong>
                </TableCell>
                <TableCell align="center">
                  <div className="d-flex justify-content-center align-items-center">
                    <CalendarMonthOutlinedIcon
                      fontSize="small"
                      className="me-1"
                    />
                    <strong>Date</strong>
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
                    <EditIcon fontSize="small" className="me-1" />
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
                      {`${getTotalPresence(attendance.records)}/${
                        students.length
                      }`}
                    </TableCell>
                    <TableCell align="center" style={{ padding: "0" }}>
                      <Button className="btn-sm" variant="info">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {attendances.length === 0 && (
                <TableRow>
                  <TableCell colSpan="4" align="center">
                    No records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card.Body>
    </Card>
  );
}

export default AttendanceHistory;

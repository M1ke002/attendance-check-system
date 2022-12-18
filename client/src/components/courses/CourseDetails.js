import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
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

const attendanceData = [
  { date: "18/12/2022", attendance: "89/105" },
  { date: "18/12/2022", attendance: "89/105" },
  { date: "18/12/2022", attendance: "89/105" },
  { date: "18/12/2022", attendance: "89/105" },
  { date: "18/12/2022", attendance: "89/105" },
  { date: "18/12/2022", attendance: "89/105" },
  { date: "18/12/2022", attendance: "89/105" },
  { date: "18/12/2022", attendance: "89/105" },
  { date: "18/12/2022", attendance: "89/105" },
  { date: "18/12/2022", attendance: "89/105" },
];

function CourseDetails() {
  return (
    <>
      <Card border="0" className="mt-3 p-2">
        <Form>
          <Card.Body>
            <Form.Group>
              <Form.Label>Course name</Form.Label>
              <Form.Control type="text" />
            </Form.Group>
            <Row className="mt-3">
              <Form.Group as={Col}>
                <Form.Label>Course code</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Year</Form.Label>
                <Form.Select>
                  <option>2022</option>
                </Form.Select>
              </Form.Group>
            </Row>
            {/* <Form.Group className="mt-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Description"
              name="description"
            />
          </Form.Group> */}
            <Row className="mt-3">
              <Form.Group as={Col}>
                <Form.Label>
                  <strong>Enrolled students:</strong> 105
                </Form.Label>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>
                  <strong>Total attendances:</strong> 4
                </Form.Label>
              </Form.Group>
            </Row>
          </Card.Body>
          <hr style={{ opacity: 0.15, margin: "0 0 10px 0" }} />
          <div className="mt-3 mb-2 me-3 d-flex justify-content-end">
            <Button variant="info" type="submit" className="me-2">
              Edit
            </Button>
            <Button variant="danger">Cancel</Button>
          </div>
        </Form>
      </Card>
      <Card
        border="0"
        className="my-3 pt-2 px-2"
        style={{ minHeight: "180px" }}
      >
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
                      <strong>Attendance record</strong>
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
                {attendanceData.map((record, index) => {
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
                        {record.date}
                      </TableCell>
                      <TableCell align="center" style={{ padding: "0" }}>
                        {record.attendance}
                      </TableCell>
                      <TableCell align="center" style={{ padding: "0" }}>
                        <Button className="btn-sm" variant="info">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {attendanceData.length === 0 && (
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
    </>
  );
}

export default CourseDetails;

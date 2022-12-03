import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import AttendanceSearch from "../components/attendance/AttendanceSearch";
import NoticeMessage from "../components/layout/NoticeMessage";
import AttendanceTable from "../components/attendance/AttendanceTable";

function Attendance() {
  return (
    <>
      <Container className="page-bg">
        <AttendanceSearch />
        <Row className="mt-3 mb-2">
          <Col>{<NoticeMessage />}</Col>
        </Row>
        <AttendanceTable />
      </Container>
    </>
  );
}

export default Attendance;

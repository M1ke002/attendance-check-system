import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import AttendanceSearch from "../components/attendance/AttendanceSearch";
import NoticeMessage from "../components/layout/NoticeMessage";
import AttendanceTable from "../components/attendance/AttendanceTable";
import { useState } from "react";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

function Attendance() {
  const [isFetching, setIsFetching] = useState(false);

  return (
    <>
      <Container className="page-bg">
        <AttendanceSearch />
        <Row className="mt-3 mb-2">
          <Col>{<NoticeMessage setIsFetching={setIsFetching} />}</Col>
        </Row>
        <AttendanceTable />
      </Container>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgb(0 0 0 / 30%);",
        }}
        open={isFetching}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

export default Attendance;

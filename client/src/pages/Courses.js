import Container from "react-bootstrap/Container";

import CoursesTable from "../components/courses/CoursesTable";

function Courses() {
  return (
    <>
      <Container className="page-bg">
        <CoursesTable />
      </Container>
    </>
  );
}

export default Courses;

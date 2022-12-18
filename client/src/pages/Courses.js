import Container from "react-bootstrap/Container";

import CourseTable from "../components/courses/CourseTable";

function Courses() {
  return (
    <>
      <Container className="page-bg">
        <CourseTable />
      </Container>
    </>
  );
}

export default Courses;

import Container from "react-bootstrap/Container";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Card from "react-bootstrap/Card";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { courseContext } from "../contexts/CourseContext";
import CourseDetails from "../components/courses/CourseDetails";
import EnrolledStudentsTable from "../components/courses/EnrolledStudentsTable";
import CourseStats from "../components/courses/CourseStats";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

function CoursePage() {
  const { courseId } = useParams();
  const { courseState } = useContext(courseContext);
  const [key, setKey] = useState("details");

  let name = "Loading...";

  const { courses } = courseState;
  const course = courses.find((course) => course._id === courseId);
  if (course) {
    name = course.name;
  }

  useEffect(() => {
    document.body.style.backgroundColor = "#f7f7f9";
    return () => {
      document.body.style.backgroundColor = "#fff";
    };
  }, []);
  return (
    <>
      <Container>
        <div
          style={{
            margin: "20px 0 10px 0",
            fontWeight: "bold",
          }}
        >
          <Link style={{ color: "black", marginRight: "5px" }} to="/courses">
            Courses
          </Link>
          {<ChevronRightIcon fontSize="small" />} {name}
        </div>
        <Card border="0" className="d-flex justify-content-center shadow-sm">
          <Card.Body>
            <Tabs variant="pills" activeKey={key} onSelect={(k) => setKey(k)}>
              <Tab eventKey="details" title="Details" />
              <Tab eventKey="students" title="Enrolled students" />
              <Tab eventKey="stats" title="Stats" />
            </Tabs>
          </Card.Body>
        </Card>
        {key === "details"
          ? course && <CourseDetails course={course} />
          : key === "students"
          ? course && <EnrolledStudentsTable course={course} />
          : course && <CourseStats course={course} />}
      </Container>
    </>
  );
}

export default CoursePage;

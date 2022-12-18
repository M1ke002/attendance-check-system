import Container from "react-bootstrap/Container";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Card from "react-bootstrap/Card";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import CourseDetails from "../components/courses/CourseDetails";
import EnrolledStudentsTable from "../components/courses/EnrolledStudentsTable";

document.body.style.backgroundColor = "#f7f7f9";
function CoursePage() {
  const { courseId } = useParams();
  console.log(courseId);
  const [key, setKey] = useState("details");
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
          {">"} Machine learning
        </div>
        <Card
          border="0"
          className="d-flex justify-content-center"
          style={{ height: "70px" }}
        >
          <Card.Body>
            <Tabs variant="pills" activeKey={key} onSelect={(k) => setKey(k)}>
              <Tab eventKey="details" title="Details" />
              <Tab eventKey="students" title="Enrolled students" />
              <Tab eventKey="stats" title="Stats" />
            </Tabs>
          </Card.Body>
        </Card>
        {key === "details" ? (
          <CourseDetails />
        ) : key === "students" ? (
          <EnrolledStudentsTable />
        ) : (
          "Statistics"
        )}
      </Container>
    </>
  );
}

export default CoursePage;

import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";

import { useEffect } from "react";

import StudentsSearch from "../components/students/StudentsSearch";
import StudentsTable from "../components/students/StudentsTable";

function Student() {
  useEffect(() => {
    document.body.style.backgroundColor = "#f7f7f9";
    return () => {
      document.body.style.backgroundColor = "#fff";
    };
  }, []);

  return (
    <Container>
      <h4
        style={{
          fontSize: "18px",
          margin: "20px 0 10px 0",
          fontWeight: "600",
          color: "rgb(62 67 73)",
        }}
      >
        Students management
      </h4>
      <StudentsSearch />
      <Card border="0" className="my-3 p-2 shadow-sm">
        <Card.Body>
          <div>
            <span>
              <strong>Search results</strong>
            </span>
          </div>
          <StudentsTable />
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Student;

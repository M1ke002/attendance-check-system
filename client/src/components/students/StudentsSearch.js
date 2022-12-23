import InputGroup from "react-bootstrap/InputGroup";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect, useContext } from "react";
import { studentContext } from "../../contexts/StudentContext";

function StudentsSearch() {
  const [searchField, setSearchField] = useState("");
  const [isFinding, setIsFinding] = useState(false);
  const { findStudents, setFoundStudents } = useContext(studentContext);

  //remove found results when component abt to unmount
  useEffect(() => {
    return () => setFoundStudents([]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getSearchResults = async () => {
    const searchValue = searchField.trim().toLowerCase();
    if (searchValue === "") return;
    setIsFinding(true);
    const res = await findStudents(searchValue);
    setIsFinding(false);
    if (res.success) {
      setFoundStudents(
        res.students.map((student, index) => {
          return {
            id: index + 1,
            _id: student._id,
            name: student.name,
            studentId: student.studentId,
            courseIds: student.enrolledCourses,
            totalCourses: student.enrolledCourses.length,
          };
        })
      );
    } else {
      setFoundStudents([]);
      console.log("not found");
    }
  };

  return (
    <Card border="0" className="mt-3 p-2 shadow-sm">
      <Card.Body>
        <Form>
          <Form.Group>
            <Form.Label>
              <strong>Search existing students</strong>
            </Form.Label>
            <InputGroup className="mb-2 mt-1">
              <Form.Control
                type="text"
                placeholder="Search by ID or name"
                value={searchField}
                onChange={(e) => {
                  setSearchField(e.target.value);
                }}
              />
              <Button
                variant="primary"
                style={{ height: 38 }}
                className="d-flex align-items-center"
                onClick={getSearchResults}
              >
                {isFinding ? (
                  <Spinner animation="border" size="sm" variant="light" />
                ) : (
                  <SearchIcon />
                )}
              </Button>
            </InputGroup>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default StudentsSearch;

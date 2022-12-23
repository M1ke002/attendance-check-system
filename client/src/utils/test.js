import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

function StudentInfoModal() {
  return (
    <Modal show={true} centered>
      <Modal.Header closeButton>
        <Modal.Title>Student Info</Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Name" name="name" />
          </Form.Group>
          <Form.Group>
            <Form.Label className="mt-2">Student ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Student ID"
              name="studentId"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="mt-2">Enrolled courses</Form.Label>
            <Card style={{ maxHeight: "100px", overflowY: "scroll" }}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Card.Link href="/" className="link">
                    Python programming - 2022
                  </Card.Link>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Card.Link href="/" className="link">
                    Object oriented programming - 2021
                  </Card.Link>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Card.Link href="/" className="link">
                    Cryptography - 2022
                  </Card.Link>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="info" type="submit">
            Edit
          </Button>
          <Button variant="danger">Cancel</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default StudentInfoModal;

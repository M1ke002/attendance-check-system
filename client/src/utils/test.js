import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

function ConfirmDeleteModal() {
  return (
    <Modal show={true} centered>
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center justify-content-center">
          <ErrorOutlineIcon fontSize="large" className="me-2" />
          Cofirmation
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Remove student: BI11-001 John Doe from this course?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger">Delete</Button>
        <Button variant="light">Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmDeleteModal;

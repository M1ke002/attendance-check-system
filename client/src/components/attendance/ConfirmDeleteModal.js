import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

function ConfirmDeleteModal(props) {
  const {
    showConfirmDeleteModal,
    onHide,
    message = {},
    onDelete,
    onCancel,
  } = props;

  return (
    <Modal show={showConfirmDeleteModal} centered onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center justify-content-center">
          <ErrorOutlineIcon fontSize="large" className="me-2" />
          {message.header ? message.header : "Confirmation"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message.body ? message.body : "Are you sure you want to delete this?"}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onDelete}>
          {message.footer ? message.footer : "Delete"}
        </Button>
        <Button variant="light" onClick={onCancel}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmDeleteModal;

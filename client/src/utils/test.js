import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import QRCode from "react-qr-code";

function QRCodeModal() {
  return (
    <Modal show={true} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "20px" }}>
          Python programming - 2022, 25/12/2022
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="py-3">
        <div
          style={{
            height: "400px",
            margin: "0 auto",
            width: "100%",
          }}
          className="d-flex align-items-center justify-content-center"
        >
          <QRCode
            size={256}
            style={{ height: "100%", width: "100%" }}
            value={"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger">Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default QRCodeModal;

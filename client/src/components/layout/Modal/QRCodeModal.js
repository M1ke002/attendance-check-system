import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import QRCode from "react-qr-code";

const IP = "192.168.1.4:3000";

function QRCodeModal({ data }) {
  const { showQRCodeModal, setShowQRCodeModal, attendance } = data;

  const onCloseModal = () => {
    setShowQRCodeModal(false);
  };

  return (
    <Modal show={showQRCodeModal} centered size="lg" onHide={onCloseModal}>
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
            value={`${IP}/attendance/check/${attendance?._id}`}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onCloseModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default QRCodeModal;

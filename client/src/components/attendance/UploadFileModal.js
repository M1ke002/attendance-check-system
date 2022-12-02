import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ClearIcon from "@mui/icons-material/Clear";

import excelIcon from "../../assets/excel.svg";
import uploadImg from "../../assets/cloud-upload-regular-240.png";

import { useRef, useState } from "react";

function UploadFileModal({ data }) {
  const wrapperRef = useRef(null);
  const [file, setFile] = useState(null);

  const { showUploadFileModal, setShowUploadFileModal } = data;

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleAddFile = (e) => {
    wrapperRef.current.classList.remove("dragover");
    const file = e.target.files[0];
    if (file) {
      const extension = file.name.split(".").pop();
      if (extension === "xlsx" || extension === "xls") setFile(file);
      else console.log("invalid file type");
    }
  };

  return (
    <Modal
      show={showUploadFileModal}
      centered
      onHide={() => setShowUploadFileModal(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Upload excel file</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="pb-0">
          <Form.Group
            ref={wrapperRef}
            className="drop-file-input"
            onDrop={() => wrapperRef.current.classList.add("dragover")}
            onDragEnter={() => wrapperRef.current.classList.add("dragover")}
            onDragLeave={() => wrapperRef.current.classList.remove("dragover")}
          >
            <Form.Group className="drop-file-label">
              <img src={uploadImg} alt="upload icon" />
              <p>Choose or drop the file of the class list here</p>
            </Form.Group>
            <Form.Control
              type="file"
              value=""
              accept="application/vnd.ms-excel"
              onChange={handleAddFile}
            />
          </Form.Group>
          {file && (
            <>
              <Form.Group className="my-2 mt-3">
                <Form.Text>File uploaded</Form.Text>
              </Form.Group>
              <Form.Group className="drop-file-item">
                <img src={excelIcon} alt="file icon" />
                <Form.Group className="drop-file-item-info">
                  <Form.Text>Name: {file.name}</Form.Text>
                  <Form.Text>Size: {file.size}B</Form.Text>
                </Form.Group>
                <span
                  className="drop-file-item-del"
                  onClick={() => setFile(null)}
                >
                  <ClearIcon fontSize="small" />
                </span>
              </Form.Group>
            </>
          )}
          <Form.Group>
            <Form.Label className="mt-2">
              *Excel file must contain an ID and a name column
            </Form.Label>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="info" type="submit">
            Submit
          </Button>
          <Button
            variant="danger"
            onClick={() => setShowUploadFileModal(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default UploadFileModal;

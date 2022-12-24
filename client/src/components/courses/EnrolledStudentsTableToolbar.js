import { GridToolbarContainer, GridToolbarQuickFilter } from "@mui/x-data-grid";
import Button from "react-bootstrap/Button";
import { useState } from "react";

import UploadFileModal from "../layout/Modal/UploadFileModal";
import EnrollStudentModal from "../layout/Modal/EnrollStudentModal";
import ConfirmDeleteModal from "../layout/Modal/ConfirmDeleteModal";

import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";

function EnrolledStudentsTableToolbar(props) {
  const { handleRemoveStudent, course } = props;
  const [showEnrollStudentModal, setShowEnrollStudentModal] = useState(false);
  const [showUploadFileModal, setShowUploadFileModal] = useState(false);
  const [
    showConfirmDeleteAllStudentsModal,
    setShowConfirmDeleteAllStudentsModal,
  ] = useState(false);

  return (
    <>
      <GridToolbarContainer style={{ justifyContent: "flex-end" }}>
        <div>
          <Button
            variant="success"
            className="me-2 d-inline-flex justify-content-center w-2"
            style={{ width: "50px" }}
            onClick={() => setShowUploadFileModal(true)}
          >
            <UploadFileIcon fontSize="small" />
          </Button>
          <Button
            variant="danger"
            className="me-2 d-inline-flex justify-content-center w-2"
            style={{ width: "50px" }}
            onClick={() => setShowConfirmDeleteAllStudentsModal(true)}
          >
            <GroupRemoveIcon fontSize="small" />
          </Button>
          <Button
            variant="info"
            className="me-4 d-inline-flex justify-content-center w-2"
            style={{ width: "50px" }}
            onClick={() => setShowEnrollStudentModal(true)}
          >
            <PersonAddAlt1Icon fontSize="small" />
          </Button>
          <GridToolbarQuickFilter />
        </div>
      </GridToolbarContainer>
      <UploadFileModal
        data={{ setShowUploadFileModal, showUploadFileModal, course }}
      />
      <EnrollStudentModal
        data={{ setShowEnrollStudentModal, showEnrollStudentModal, course }}
      />
      <ConfirmDeleteModal
        showConfirmDeleteModal={showConfirmDeleteAllStudentsModal}
        onHide={() => {
          setShowConfirmDeleteAllStudentsModal(false);
        }}
        onDelete={() => {
          handleRemoveStudent("all");
          setShowConfirmDeleteAllStudentsModal(false);
        }}
        onCancel={() => {
          setShowConfirmDeleteAllStudentsModal(false);
        }}
        message={{
          body: "Remove all students from this course?",
          footer: "Remove",
        }}
      />
    </>
  );
}

export default EnrolledStudentsTableToolbar;

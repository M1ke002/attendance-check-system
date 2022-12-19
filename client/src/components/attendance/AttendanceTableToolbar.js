import { GridToolbarContainer, GridToolbarQuickFilter } from "@mui/x-data-grid";
import SaveIcon from "@mui/icons-material/Save";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { toast } from "react-toastify";

import { useState } from "react";

import UploadFileModal from "../layout/Modal/UploadFileModal";
import EnrollStudentModal from "../layout/Modal/EnrollStudentModal";
import ConfirmDeleteModal from "../layout/Modal/ConfirmDeleteModal";

function AttendanceTableToolbar(props) {
  const [showEnrollStudentModal, setShowEnrollStudentModal] = useState(false);
  const [showUploadFileModal, setShowUploadFileModal] = useState(false);
  const [
    showConfirmDeleteAllStudentsModal,
    setShowConfirmDeleteAllStudentsModal,
  ] = useState(false);

  const [isSavingData, setIsSavingData] = useState(false);
  const {
    selectionModel,
    rows,
    attendanceData,
    getAllCourses,
    handleRemoveStudent,
  } = props;

  const { attendance, createAttendance, updateAttendance, course, date } =
    attendanceData;

  const checkCourseSelected = () => {
    if (!course || !date) {
      console.log("missing course date!");
      toast.error("Go to a course first!", {
        theme: "colored",
        autoClose: 2000,
      });
      return false;
    }
    return true;
  };

  const saveData = async () => {
    if (!checkCourseSelected()) return;
    const records = rows.map((row) => {
      const present = selectionModel.includes(row.id);
      return {
        student: row._id,
        present,
      };
    });
    //check if save existing attendance or create new one
    let result = null;
    setIsSavingData(true);
    if (attendance) {
      const attendanceData = {
        records,
        _id: attendance._id,
      };
      const res = await updateAttendance(attendanceData);
      console.log(res);
      result = res;
    } else {
      const attendanceData = {
        records,
        date,
        courseId: course._id,
      };
      const res = await createAttendance(attendanceData);
      console.log(res);
      result = res;
    }
    await getAllCourses();
    if (result.success) {
      toast.success(result.message, {
        theme: "colored",
        autoClose: 2000,
      });
    } else {
      toast.error(result.message, {
        theme: "colored",
        autoClose: 2000,
      });
    }
    setIsSavingData(false);
  };

  return (
    <>
      <GridToolbarContainer style={{ justifyContent: "space-between" }}>
        <div>
          <Button
            variant="info"
            className="me-2 d-inline-flex align-items-center"
            onClick={saveData}
            disabled={isSavingData}
          >
            {isSavingData ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-1"
              />
            ) : (
              <SaveIcon /> //TODO: disable btn if course has no students?
            )}
            <span className="ms-1">{isSavingData ? "Saving..." : "Save"}</span>
          </Button>
          <Button variant="success" className="me-2">
            Generate QR
          </Button>
        </div>
        <div>
          <Button
            variant="success"
            className="me-2 d-inline-flex justify-content-center w-2"
            style={{ width: "50px" }}
            onClick={() => {
              if (checkCourseSelected()) setShowUploadFileModal(true);
            }}
          >
            <UploadFileIcon fontSize="small" />
          </Button>
          <Button
            variant="danger"
            className="me-2 d-inline-flex justify-content-center w-2"
            style={{ width: "50px" }}
            onClick={() => {
              if (checkCourseSelected())
                setShowConfirmDeleteAllStudentsModal(true);
            }}
          >
            <GroupRemoveIcon fontSize="small" />
          </Button>
          <Button
            variant="info"
            className="me-4 d-inline-flex justify-content-center w-2"
            style={{ width: "50px" }}
            onClick={() => {
              if (checkCourseSelected()) setShowEnrollStudentModal(true);
            }}
          >
            <PersonAddAlt1Icon fontSize="small" />
          </Button>
          <GridToolbarQuickFilter />
        </div>
      </GridToolbarContainer>
      <UploadFileModal data={{ setShowUploadFileModal, showUploadFileModal }} />
      <EnrollStudentModal
        data={{ setShowEnrollStudentModal, showEnrollStudentModal }}
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
        }}
      />
    </>
  );
}

export default AttendanceTableToolbar;

import { GridToolbarContainer, GridToolbarQuickFilter } from "@mui/x-data-grid";
import SaveIcon from "@mui/icons-material/Save";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import { useState } from "react";

import UploadFileModal from "../attendance/UploadFileModal";
import EnrollStudentModal from "../attendance/EnrollStudentModal";

function CustomToolBar(props) {
  const [showEnrollStudentModal, setShowEnrollStudentModal] = useState(false);
  const [showUploadFileModal, setShowUploadFileModal] = useState(false);

  const [isSavingData, setIsSavingData] = useState(false);
  const { selectionModel, rows, attendanceData, getAllCourses } = props;

  const { attendance, createAttendance, updateAttendance, course, date } =
    attendanceData;

  const saveData = async () => {
    if (!course || !date) {
      console.log("missing course date, cant save yet");
      return;
    }
    const records = rows.map((row) => {
      const present = selectionModel.includes(row.id);
      return {
        student: row._id,
        present,
      };
    });
    //check if save existing attendance or create new one
    setIsSavingData(true);
    if (attendance) {
      const attendanceData = {
        records,
        _id: attendance._id,
      };
      const res = await updateAttendance(attendanceData);
      console.log(res);
    } else {
      const attendanceData = {
        records,
        date,
        courseId: course._id,
      };
      const res = await createAttendance(attendanceData);
      console.log(res);
    }
    await getAllCourses();
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
              <SaveIcon />
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
            onClick={() => setShowUploadFileModal(true)}
          >
            <UploadFileIcon fontSize="small" />
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
      <UploadFileModal data={{ setShowUploadFileModal, showUploadFileModal }} />
      <EnrollStudentModal
        data={{ setShowEnrollStudentModal, showEnrollStudentModal }}
      />
    </>
  );
}

export default CustomToolBar;

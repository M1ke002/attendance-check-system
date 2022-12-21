import { GridToolbarContainer, GridToolbarQuickFilter } from "@mui/x-data-grid";
import SaveIcon from "@mui/icons-material/Save";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { toast } from "react-toastify";

import { useState } from "react";

function AttendanceTableToolbar(props) {
  const [isSavingData, setIsSavingData] = useState(false);
  const { selectionModel, rows, attendanceData, getAllCourses } = props;

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
    if (course.students.length === 0) {
      toast.error("course has no students!", {
        theme: "colored",
        autoClose: 2000,
      });
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
              <SaveIcon />
            )}
            <span className="ms-1">{isSavingData ? "Saving..." : "Save"}</span>
          </Button>
          <Button variant="success" className="me-2">
            Generate QR
          </Button>
        </div>
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    </>
  );
}

export default AttendanceTableToolbar;

import { GridToolbarContainer, GridToolbarQuickFilter } from "@mui/x-data-grid";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import QRCodeModal from "../../components/layout/Modal/QRCodeModal";
import { toast } from "react-toastify";
import { useState } from "react";

const VALID = "Open";
const INVALID = "Closed";

function AttendanceTableToolbar(props) {
  const { selectionModel, rows, attendanceData, getAllCourses } = props;
  const {
    attendance,
    getAttendance,
    createAttendance,
    updateAttendance,
    setAttendanceValid,
    selectedCourseInfo,
  } = attendanceData;

  const { course, session } = selectedCourseInfo;

  const date = session?.date;
  const timeRange = session?.timeRange;
  const sessionName = session?.sessionName;

  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [isSavingData, setIsSavingData] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [isLoadingQR, setIsLoadingQR] = useState(false);

  const checkCourseSelected = () => {
    if (!course || !session) {
      console.log("missing course!");
      toast.error("Go to a course first!", {
        theme: "colored",
        autoClose: 2000,
      });
      return false;
    }
    return true;
  };

  const handleAttendaneValid = async (e) => {
    const valid = e.target.value === VALID ? true : false;
    if (valid !== attendance.valid) {
      setIsChanging(true);
      const res = await setAttendanceValid(attendance._id, valid);
      await getAttendance({
        attendanceId: attendance._id,
      });
      // await getAllCourses();
      console.log(res);
      setIsChanging(false);
    }
  };

  const generateQR = async () => {
    if (!checkCourseSelected()) return;
    if (course.students.length === 0) {
      toast.error("course has no students!", {
        theme: "colored",
        autoClose: 2000,
      });
      return;
    }
    //if attendance not created yet
    if (!attendance) {
      const records = rows.map((row) => {
        return {
          student: row._id,
        };
      });
      const attendanceData = {
        records,
        date,
        sessionName,
        startTime: timeRange[0],
        endTime: timeRange[1],
        courseId: course._id,
      };
      setIsLoadingQR(true);
      const res = await createAttendance(attendanceData);
      await getAllCourses();
      setIsLoadingQR(false);
      console.log(res);
    }
    setShowQRCodeModal(true);
  };

  const refreshAttendance = async () => {
    if (!course || !session) return;
    setIsRefreshing(true);
    if (attendance) {
      await getAttendance({
        attendanceId: attendance._id,
      });
    }
    await getAllCourses();
    setIsRefreshing(false);
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
        ...attendance,
        records,
      };
      const res = await updateAttendance(attendanceData);
      console.log(res);
      result = res;
    } else {
      const attendanceData = {
        records,
        date,
        sessionName,
        startTime: timeRange[0],
        endTime: timeRange[1],
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
          <Button
            variant="success"
            className="me-2"
            onClick={generateQR}
            disabled={isLoadingQR}
          >
            {isLoadingQR ? "Generating" : "Generate QR"}
          </Button>
          <Tooltip title="Refresh" placement="top">
            <span>
              <Button
                style={{ height: "38px" }}
                className="d-inline-flex align-items-center justify-content-center"
                disabled={!course || !session}
                onClick={refreshAttendance}
              >
                {isRefreshing ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  <RefreshIcon />
                )}
              </Button>
            </span>
          </Tooltip>
        </div>
        <div className="d-flex align-items-center">
          {attendance && (
            <Tooltip title="Attendance status" placement="top">
              <TextField
                select
                size="small"
                style={{
                  backgroundColor: attendance.valid ? "#ddf3d8" : "#ffd8dc",
                  borderRadius: 20,
                }}
                sx={{
                  mr: 3,
                  "& fieldset": { borderRadius: 10 },
                }}
                variant="outlined"
                value={attendance.valid ? "Open" : "Closed"}
                onChange={handleAttendaneValid}
              >
                <MenuItem value={VALID}>Open</MenuItem>
                <MenuItem value={INVALID}>Closed</MenuItem>
              </TextField>
            </Tooltip>
          )}

          <GridToolbarQuickFilter />
        </div>
      </GridToolbarContainer>
      <QRCodeModal
        data={{
          showQRCodeModal,
          setShowQRCodeModal,
          attendance,
        }}
      />
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgb(0 0 0 / 30%);",
        }}
        open={isRefreshing || isChanging}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

export default AttendanceTableToolbar;

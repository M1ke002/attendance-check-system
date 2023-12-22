import { GridToolbarContainer, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { CSVLink } from "react-csv";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import QRCodeModal from "../../components/layout/Modal/QRCodeModal";
import { toast } from "react-toastify";
import { useState, useRef, useEffect } from "react";
import { getCurrentPosition } from "../../utils/utilsFunction";

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
  const [csvData, setCsvData] = useState({
    data: [],
    filename: "",
  });

  const csvLinkRef = useRef();

  useEffect(() => {
    if (csvData.data.length === 0 || !csvData.filename || !csvLinkRef.current)
      return;

    //trigger the download
    csvLinkRef.current.link.click();
  }, [csvData]);

  const checkCourseSelected = () => {
    if (!course || !session) {
      console.log("missing course!");
      toast.error("Select a session first!", {
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
        latitude: null,
        longitude: null,
      };
      setIsLoadingQR(true);

      //get the geolocation of the session -> need to add the lat and lon to attendanceData before creating attendance
      const position = await getCurrentPosition();
      if (position) {
        const { latitude, longitude } = position.coords;
        console.log(latitude, longitude);
        attendanceData.latitude = latitude;
        attendanceData.longitude = longitude;
      }
      const res = await createAttendance(attendanceData);
      await getAllCourses();
      setIsLoadingQR(false);
      console.log(res);
    }
    setShowQRCodeModal(true);
  };

  const handleExportCSV = () => {
    console.log(attendance);
    const attendanceData = [["Student ID", "Student Name", "Present"]];
    attendance.records.forEach((record) => {
      const { student, present } = record;
      const { studentId, name } = student;
      attendanceData.push([studentId, name, present ? "Yes" : "No"]);
    });

    const csvData = {
      data: attendanceData,
      filename: `attendance_${attendance.sessionName}.csv`,
    };

    setCsvData(csvData);
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
        latitude: null,
        longitude: null,
      };

      //get the geolocation of the session -> need to add the lat and lon to attendanceData before creating attendance
      const position = await getCurrentPosition();
      if (position) {
        const { latitude, longitude } = position.coords;
        console.log(latitude, longitude);
        attendanceData.latitude = latitude;
        attendanceData.longitude = longitude;
      }
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
          <Tooltip title="Export CSV" placement="top">
            <span>
              <Button
                variant="info"
                style={{ height: "38px" }}
                className="d-inline-flex align-items-center justify-content-center me-2"
                disabled={isRefreshing || !attendance}
                onClick={handleExportCSV}
              >
                <FileDownloadIcon />
              </Button>
            </span>
          </Tooltip>
          <CSVLink
            data={csvData.data}
            filename={csvData.filename}
            className="hidden"
            target="_blank"
            ref={csvLinkRef}
          />
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
                  marginRight: 15,
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

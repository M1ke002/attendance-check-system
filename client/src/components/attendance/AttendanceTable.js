import { useState, useMemo, useContext, useEffect } from "react";
import { alpha, styled } from "@mui/material/styles";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import GlobalStyles from "@mui/material/GlobalStyles";
import Badge from "react-bootstrap/Badge";
import AttendanceTableToolbar from "./AttendanceTableToolbar";
import { attendanceContext } from "../../contexts/AttendanceContext";
import { courseContext } from "../../contexts/CourseContext";

import NumbersIcon from "@mui/icons-material/Numbers";
import HelpIcon from "@mui/icons-material/Help";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import GroupIcon from "@mui/icons-material/Group";

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
    "&:hover, &.Mui-hovered": {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-selected": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      "&:hover, &.Mui-hovered": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },
}));

const getTotalAttendanceForStudent = (studentId, course) => {
  let count = 0;
  course.attendances.forEach((attendance) => {
    const isPresent = attendance.records.find(
      (record) => record.student === studentId
    )?.present;
    if (isPresent) count++;
  });
  return `${count}/${course.attendances.length}`;
};

function AttendanceTable() {
  // console.log("rerender");
  const {
    attendanceState: { attendance },
    createAttendance,
    updateAttendance,
  } = useContext(attendanceContext);

  const {
    courseState: { selectedCourseInfo },
    getAllCourses,
  } = useContext(courseContext);

  const { course, date } = selectedCourseInfo;

  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);

  useEffect(() => {
    if (attendance && course && date) {
      const attendanceList = attendance.records.map((record, index) => {
        return {
          id: index + 1,
          _id: record.student._id,
          status: record.present ? "present" : "absent",
          studentId: record.student.studentId,
          name: record.student.name,
          course: course.name,
          date: attendance.date,
          attendance: getTotalAttendanceForStudent(record.student._id, course),
        };
      });
      setRows(attendanceList);

      setSelectionModel(
        attendanceList
          .filter((row) => row.status === "present")
          .map((row) => row.id)
      );
    } else if (course && date) {
      //generate attendance draft, status: not set
      const attendanceList = course.students.map((student, index) => {
        return {
          id: index + 1,
          _id: student._id,
          status: "not set",
          studentId: student.studentId,
          name: student.name,
          course: course.name,
          date,
          attendance: getTotalAttendanceForStudent(student._id, course),
        };
      });
      setRows(attendanceList);
      setSelectionModel([]);
    } else {
      //empty rows
      if (rows.length > 0) setRows([]);
    }
  }, [attendance, course, date]); // eslint-disable-line react-hooks/exhaustive-deps

  const columns = useMemo(
    () => [
      {
        field: "id",
        width: 90,
        headerAlign: "center",
        align: "center",
        renderHeader: () => (
          <div className="d-flex align-items-center">
            <NumbersIcon fontSize="small" />
          </div>
        ),
      },
      {
        field: "_id",
      },
      {
        field: "status",
        width: 110,
        headerAlign: "center",
        align: "center",
        sortable: false,
        renderHeader: () => (
          <div className="d-flex align-items-center">
            <HelpIcon fontSize="small" />
            <span className="ms-1">Status</span>
          </div>
        ),
        renderCell: (param) => {
          return (
            <Badge
              bg={
                param.value === "not set"
                  ? "info"
                  : param.value === "present"
                  ? "success"
                  : "danger"
              }
              style={{ width: "3rem" }}
              className="d-flex align-items-center justify-content-center"
            >
              {param.value}
            </Badge>
          );
        },
      },
      {
        field: "studentId",
        width: 140,
        headerAlign: "center",
        align: "center",
        renderHeader: () => (
          <div className="d-flex align-items-center">
            <BookmarkIcon fontSize="small" />
            <span className="ms-1">Student ID</span>
          </div>
        ),
      },
      {
        field: "name",
        width: 320,
        headerAlign: "center",
        align: "center",
        renderHeader: () => (
          <div className="d-flex align-items-center">
            <PermIdentityOutlinedIcon fontSize="small" />
            <span className="ms-1">Student Name</span>
          </div>
        ),
      },
      {
        field: "course",
        sortable: false,
        flex: 1,
        headerAlign: "center",
        align: "center",
        getApplyQuickFilterFn: undefined,
        renderHeader: () => (
          <div className="d-flex align-items-center">
            <LibraryBooksOutlinedIcon fontSize="small" />
            <span className="ms-1">Course</span>
          </div>
        ),
      },
      {
        field: "date",
        width: 150,
        sortable: false,
        headerAlign: "center",
        align: "center",
        getApplyQuickFilterFn: undefined,
        renderHeader: () => (
          <div className="d-flex align-items-center">
            <CalendarMonthOutlinedIcon fontSize="small" />
            <span className="ms-1">Date</span>
          </div>
        ),
      },
      {
        field: "attendance",
        width: 130,
        sortable: false,
        headerAlign: "center",
        align: "center",
        renderHeader: () => (
          <div className="d-flex align-items-center">
            <GroupIcon fontSize="small" />
            <span className="ms-1">Presence</span>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <>
      <h4 className="text-center">Attendance list</h4>
      <hr style={{ opacity: 0.15 }} />
      <div style={{ height: rows.length === 0 ? 350 : 500, width: "100%" }}>
        <StripedDataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
          disableColumnMenu={true}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[10, 50, 100]}
          pagination
          disableSelectionOnClick
          sx={{ border: 0 }}
          localeText={{
            noRowsLabel: "No students found",
            footerRowSelected: (count) =>
              count !== 1
                ? `${count.toLocaleString()} students selected (tick to check attendance)`
                : `${count.toLocaleString()} student selected (tick to check attendance)`,
          }}
          components={{ Toolbar: AttendanceTableToolbar }}
          componentsProps={{
            toolbar: {
              selectionModel,
              rows,
              attendanceData: {
                attendance,
                createAttendance,
                updateAttendance,
                course,
                date,
              },
              getAllCourses,
            },
          }}
          selectionModel={selectionModel}
          onSelectionModelChange={(newSelectionModel) =>
            setSelectionModel(newSelectionModel)
          }
          initialState={{
            columns: {
              columnVisibilityModel: {
                _id: false,
              },
            },
          }}
        />
        {/* custom styles */}
        <GlobalStyles styles={{ p: { marginTop: "auto" } }} />
      </div>
    </>
  );
}

export default AttendanceTable;

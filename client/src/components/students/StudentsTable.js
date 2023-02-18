import GlobalStyles from "@mui/material/GlobalStyles";
import { useState, useContext, useMemo, useCallback } from "react";
import { studentContext } from "../../contexts/StudentContext";
import { courseContext } from "../../contexts/CourseContext";
import { attendanceContext } from "../../contexts/AttendanceContext";
import { toast } from "react-toastify";
import { StripedHoverDataGrid } from "../../utils/TableStyle";
import StudentsTableToolbar from "./StudentsTableToolbar";
import Button from "react-bootstrap/Button";
import ConfirmDeleteModal from "../layout/Modal/ConfirmDeleteModal";
import StudentInfoModal from "../layout/Modal/StudentInfoModal";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import NumbersIcon from "@mui/icons-material/Numbers";
import DeleteIcon from "@mui/icons-material/Delete";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";

function StudentTables() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [showStudentInfoModal, setShowStudentInfoModal] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState([]);

  const {
    getAttendance,
    attendanceState: { attendance },
  } = useContext(attendanceContext);
  const {
    getAllCourses,
    courseState: { selectedCourseInfo },
  } = useContext(courseContext);
  const { course: selectedCourse } = selectedCourseInfo;
  const {
    studentState: { selectedStudent },
    getSelectedStudent,
    deleteStudent,
    deleteAllStudents,
  } = useContext(studentContext);

  const onRowDoubleClick = (row) => {
    getSelectedStudent(row);
    setShowStudentInfoModal(true);
  };

  const onViewStudentInfo = useCallback(
    (id) => {
      setRows((prevRows) => {
        getSelectedStudent(prevRows.find((row) => row.id === id));
        return prevRows;
      });
      setShowStudentInfoModal(true);
    },
    [getSelectedStudent]
  );

  const onDeleteStudent = useCallback(
    (id) => {
      setRows((prevRows) => {
        getSelectedStudent(prevRows.find((row) => row.id === id));
        return prevRows;
      });
      setShowConfirmDeleteModal(true);
    },
    [getSelectedStudent]
  );

  const handleDeleteStudent = async () => {
    setIsDeleting(true);
    const res = await deleteStudent(selectedStudent._id);
    if (res.success) {
      //if student enrolled in course(s) -> get all courses
      if (selectedStudent.courseIds.length > 0) {
        await getAllCourses();
        //if there is selected course and session and the selected course is in the list of courses student enrolled in -> get attendance
        if (
          selectedCourse &&
          attendance &&
          selectedStudent.courseIds.find(
            (courseId) => courseId === selectedCourse._id
          )
        )
          await getAttendance({
            attendanceId: attendance._id,
          });
      }
      console.log("deleted student");
      toast.success(res.message, {
        theme: "colored",
        autoClose: 2000,
      });
    } else {
      toast.error(res.message, {
        theme: "colored",
        autoClose: 2000,
      });
    }
    setIsDeleting(false);
  };

  const handleDeleteAllStudents = async () => {
    setIsDeleting(true);
    const res = await deleteAllStudents();
    if (res.success) {
      //get all courses
      await getAllCourses();
      //if there is selected course and session -> get attendance
      if (selectedCourse && attendance)
        await getAttendance({
          attendanceId: attendance._id,
        });
      console.log("deleted all students");
      toast.success(res.message, {
        theme: "colored",
        autoClose: 2000,
      });
    } else {
      toast.error(res.message, {
        theme: "colored",
        autoClose: 2000,
      });
    }
    setIsDeleting(false);
  };

  const columns = useMemo(
    () => [
      {
        field: "id",
        width: 80,
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
        field: "courseIds",
      },
      {
        field: "studentId",
        width: 170,
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
        flex: 1,
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
        field: "totalCourses",
        sortable: false,
        width: 400,
        headerAlign: "center",
        align: "center",
        getApplyQuickFilterFn: undefined,
        renderHeader: () => (
          <div className="d-flex align-items-center">
            <LibraryBooksOutlinedIcon fontSize="small" />
            <span className="ms-1">Enrolled courses</span>
          </div>
        ),
      },
      {
        field: "actions",
        width: 160,
        sortable: false,
        headerAlign: "center",
        align: "center",
        renderHeader: () => (
          <div className="d-flex align-items-center">
            <BorderColorOutlinedIcon fontSize="small" />
            <span className="ms-1">Actions</span>
          </div>
        ),
        renderCell: (params) => {
          return (
            <>
              <Button
                className="btn-sm me-2"
                variant="info"
                onClick={() => onViewStudentInfo(params.id)}
              >
                View
              </Button>
              <Button
                className="btn-sm"
                variant="danger"
                onClick={() => onDeleteStudent(params.id)}
              >
                <DeleteIcon fontSize="small" />
              </Button>
            </>
          );
        },
      },
    ],
    [onDeleteStudent, onViewStudentInfo]
  );

  return (
    <>
      <StudentsTableToolbar data={{ setRows, handleDeleteAllStudents }} />
      <div style={{ height: rows.length === 0 ? 340 : 370, width: "100%" }}>
        <StripedHoverDataGrid
          rows={rows}
          columns={columns}
          disableColumnMenu={true}
          disableSelectionOnClick
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[10, 50, 100]}
          onRowDoubleClick={(params) => onRowDoubleClick(params.row)}
          pagination
          localeText={{ noRowsLabel: "No students found" }}
          initialState={{
            columns: {
              columnVisibilityModel: {
                _id: false,
                courseIds: false,
              },
            },
          }}
        />
        <GlobalStyles styles={{ p: { marginTop: "auto" } }} />
      </div>
      <ConfirmDeleteModal
        showConfirmDeleteModal={showConfirmDeleteModal}
        onHide={() => {
          setShowConfirmDeleteModal(false);
          // deselectStudent(null);
        }}
        onDelete={() => {
          handleDeleteStudent();
          setShowConfirmDeleteModal(false);
        }}
        onCancel={() => {
          setShowConfirmDeleteModal(false);
          // deselectStudent(null);
        }}
        message={{
          body: selectedStudent ? (
            <>
              Delete student:{" "}
              <strong>
                {selectedStudent.studentId} {selectedStudent.name}{" "}
              </strong>
            </>
          ) : (
            "Deleting..."
          ),
        }}
      />
      <StudentInfoModal
        data={{
          setShowStudentInfoModal,
          showStudentInfoModal,
        }}
      />
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgb(0 0 0 / 30%);",
        }}
        open={isDeleting}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

export default StudentTables;

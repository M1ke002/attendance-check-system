import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { alpha, styled } from "@mui/material/styles";
import { DataGrid, GridActionsCellItem, gridClasses } from "@mui/x-data-grid";
import GlobalStyles from "@mui/material/GlobalStyles";
import StudentsTableToolbar from "./StudentsTableToolbar";
import { studentContext } from "../../contexts/StudentContext";
import { courseContext } from "../../contexts/CourseContext";
import ConfirmDeleteModal from "../layout/Modal/ConfirmDeleteModal";
import { toast } from "react-toastify";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import NumbersIcon from "@mui/icons-material/Numbers";
import DeleteIcon from "@mui/icons-material/Delete";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";

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

function EnrolledStudentsTable({ course }) {
  const { getAllCourses } = useContext(courseContext);
  const {
    studentState: { selectedStudent },
    getSelectedStudent,
    removeMultipleStudentsFromCourse,
    removeStudentFromCourse,
    deselectStudent,
  } = useContext(studentContext);

  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState([]);
  const { students, name: courseName } = course;

  useEffect(() => {
    const studentList = students.map((student, index) => {
      return {
        id: index + 1,
        _id: student._id,
        studentId: student.studentId,
        name: student.name,
        course: courseName,
      };
    });
    setRows(studentList);
  }, [students.length]);

  const onDeleteStudent = useCallback((id) => {
    setRows((prevRows) => {
      getSelectedStudent({
        student: prevRows.find((row) => row.id === id),
      });
      return prevRows;
    });
    setShowConfirmDeleteModal(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRemoveStudent = async (type) => {
    setIsDeleting(true);
    let res = null;
    if (type === "single") {
      const { student } = selectedStudent;
      res = await removeStudentFromCourse({
        studentId: student._id,
        courseId: course._id,
      });
    } else if (type === "all") {
      const studentIds = rows.map((row) => row._id);
      res = await removeMultipleStudentsFromCourse({
        studentIds,
        courseId: course._id,
      });
    }
    console.log(res);
    if (res.success) {
      await getAllCourses();
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
    // setShowConfirmDeleteModal(false); //FIX when pass to custom toolbar
    setIsDeleting(false);
  };

  const columns = useMemo(
    () => [
      {
        field: "id",
        width: 120,
        headerAlign: "center",
        align: "center",
        renderHeader: () => (
          <div className="d-flex align-items-center">
            <NumbersIcon fontSize="small" />
            <span className="ms-1">No.</span>
          </div>
        ),
      },
      {
        field: "_id",
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
        field: "course",
        sortable: false,
        width: 400,
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
        field: "actions",
        width: 140,
        type: "actions",
        sortable: false,
        renderHeader: () => (
          <div className="d-flex align-items-center">
            <BorderColorOutlinedIcon fontSize="small" />
            <span className="ms-1">Actions</span>
          </div>
        ),
        getActions: (params) => [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => onDeleteStudent(params.id)}
          />,
        ],
      },
    ],
    [onDeleteStudent]
  );

  return (
    <>
      <h4 className="text-center" style={{ marginTop: "25px" }}>
        Enrolled students
      </h4>
      <hr style={{ opacity: 0.15 }} />
      <div style={{ height: rows.length === 0 ? 460 : 500, width: "100%" }}>
        <StripedDataGrid
          rows={rows}
          columns={columns}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
          disableColumnMenu={true}
          disableSelectionOnClick
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[10, 50, 100]}
          pagination
          sx={{ border: 0 }}
          initialState={{
            columns: {
              columnVisibilityModel: {
                _id: false,
              },
            },
          }}
          localeText={{ noRowsLabel: "No students found" }}
          components={{ Toolbar: StudentsTableToolbar }}
          componentsProps={{
            toolbar: {
              rows,
              handleRemoveStudent,
            },
          }}
        />
        <GlobalStyles styles={{ p: { marginTop: "auto" } }} />
      </div>
      <ConfirmDeleteModal
        showConfirmDeleteModal={showConfirmDeleteModal}
        onHide={() => {
          setShowConfirmDeleteModal(false);
          deselectStudent();
        }}
        onDelete={() => {
          // handleRemoveStudent("single");
          setShowConfirmDeleteModal(false);
        }}
        onCancel={() => {
          setShowConfirmDeleteModal(false);
          deselectStudent();
        }}
        message={{
          body: selectedStudent ? (
            <>
              Remove student:{" "}
              <strong>
                {selectedStudent.student.studentId}{" "}
                {selectedStudent.student.name}{" "}
              </strong>
              from this course?
            </>
          ) : (
            "Removing..."
          ),
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

export default EnrolledStudentsTable;

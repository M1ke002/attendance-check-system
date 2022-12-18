import { DataGrid, GridActionsCellItem, gridClasses } from "@mui/x-data-grid";
import { alpha, styled } from "@mui/material/styles";
import GlobalStyles from "@mui/material/GlobalStyles";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { courseContext } from "../../contexts/CourseContext";
import Button from "react-bootstrap/Button";
import CoursesTableToolbar from "./CoursesTableToolbar";
import ConfirmDeleteModal from "../layout/Modal/ConfirmDeleteModal";
import EditCourseModal from "../layout/Modal/EditCourseModal";
import { toast } from "react-toastify";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import ClassIcon from "@mui/icons-material/Class";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NumbersIcon from "@mui/icons-material/Numbers";

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
    cursor: "pointer",
  },
  [`& .${gridClasses.row}.odd`]: {
    cursor: "pointer",
  },
}));
//   {
//     id: 1,
//     _id: 0,
//     name: "Object Oriented Programming",
//     code: "OOP",
//     year: "2022",
//   },
//   {
//     id: 2,
//     _id: 0,
//     name: "Object Oriented Programming",
//     code: "OOP",
//     year: "2022",
//   },
//   {
//     id: 3,
//     _id: 0,
//     name: "Object Oriented Programming",
//     code: "OOP",
//     year: "2022",
//   },
//   {
//     id: 4,
//     _id: 0,
//     name: "Object Oriented Programming",
//     code: "OOP",
//     year: "2022",
//   },
//   {
//     id: 5,
//     _id: 0,
//     name: "Object Oriented Programming",
//     code: "OOP",
//     year: "2022",
//   },
// ];

function CourseTable() {
  console.log("render coursetable");
  const navigate = useNavigate();
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    courseState: { courses },
    getAllCourses,
    deleteCourse,
  } = useContext(courseContext);

  useEffect(() => {
    const courseList = courses.map((course, index) => {
      return {
        id: index + 1,
        _id: course._id,
        name: course.name,
        code: course.courseCode,
        year: course.year,
      };
    });
    setRows(courseList);
  }, [courses]);

  const onEditCourse = (id) => {
    const course = rows.find((row) => row.id === id);
    setSelectedCourse(course);
    setShowEditCourseModal(true);
  };

  const onDeleteCourse = (id) => {
    const course = rows.find((row) => row.id === id);
    setSelectedCourse(course);
    setShowConfirmDeleteModal(true);
  };

  const handleDeleteCourse = async () => {
    setIsDeleting(true);
    const res = await deleteCourse(selectedCourse._id);
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
    setIsDeleting(false);
  };

  const columns = [
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
      field: "name",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderHeader: () => (
        <div className="d-flex align-items-center">
          <LibraryBooksOutlinedIcon fontSize="small" />
          <span className="ms-1">Course Name</span>
        </div>
      ),
    },
    {
      field: "code",
      width: 160,
      headerAlign: "center",
      align: "center",
      renderHeader: () => (
        <div className="d-flex align-items-center">
          <ClassIcon fontSize="small" />
          <span className="ms-1">Code</span>
        </div>
      ),
    },
    {
      field: "year",
      width: 140,
      headerAlign: "center",
      align: "center",
      renderHeader: () => (
        <div className="d-flex align-items-center">
          <CalendarMonthIcon fontSize="small" />
          <span className="ms-1">Year</span>
        </div>
      ),
    },
    {
      field: "actions",
      width: 200,
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
          icon={<EditIcon />}
          label="Edit"
          onClick={() => onEditCourse(params.id)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => onDeleteCourse(params.id)}
        />,
      ],
    },
    {
      field: " ",
      width: 140,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <Button
            className="btn-sm"
            variant="info"
            onClick={() => {
              const course = rows.find((row) => row.id === params.id);
              navigate(`/courses/${course._id}`);
            }}
          >
            View
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <h4 style={{ textAlign: "center", paddingTop: "2rem" }}>All courses</h4>
      <hr style={{ opacity: 0.15 }} />
      <div style={{ height: 580, width: "100%" }}>
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
          onRowDoubleClick={(params) => {
            navigate(`/courses/${params.row._id}`);
          }}
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
          localeText={{ noRowsLabel: "No courses found" }}
          components={{ Toolbar: CoursesTableToolbar }}
        />
        <GlobalStyles styles={{ p: { marginTop: "auto" } }} />
      </div>
      <ConfirmDeleteModal
        showConfirmDeleteModal={showConfirmDeleteModal}
        onHide={() => {
          setShowConfirmDeleteModal(false);
          setSelectedCourse(null);
        }}
        onDelete={() => {
          handleDeleteCourse();
          setShowConfirmDeleteModal(false);
        }}
        onCancel={() => {
          setShowConfirmDeleteModal(false);
          setSelectedCourse(null);
        }}
        message={{
          body: selectedCourse ? (
            <>
              Delete course: <strong>{selectedCourse.name} </strong>?
            </>
          ) : (
            "Deleting..."
          ),
        }}
      />
      {selectedCourse && (
        <EditCourseModal
          data={{
            showEditCourseModal,
            setShowEditCourseModal,
            selectedCourse,
          }}
        />
      )}
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

export default CourseTable;

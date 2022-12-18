import { useState, useCallback, useMemo, useContext, useEffect } from "react";
import { alpha, styled } from "@mui/material/styles";
import { DataGrid, GridActionsCellItem, gridClasses } from "@mui/x-data-grid";
import GlobalStyles from "@mui/material/GlobalStyles";
import StudentsTableToolbar from "./StudentsTableToolbar";

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

function EnrolledStudentsTable() {
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState([
    {
      id: 1,
      studentId: "BI11-001",
      name: "John Doe",
      course: "Machine learning",
    },
    {
      id: 2,
      studentId: "BI11-001",
      name: "John Doe",
      course: "Machine learning",
    },
    {
      id: 3,
      studentId: "BI11-001",
      name: "John Doe",
      course: "Machine learning",
    },
    {
      id: 4,
      studentId: "BI11-001",
      name: "John Doe",
      course: "Machine learning",
    },
    {
      id: 5,
      studentId: "BI11-001",
      name: "John Doe",
      course: "Machine learning",
    },
    {
      id: 6,
      studentId: "BI11-001",
      name: "John Doe",
      course: "Machine learning",
    },
    {
      id: 7,
      studentId: "BI11-001",
      name: "John Doe",
      course: "Machine learning",
    },
  ]);
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
        <GridActionsCellItem icon={<DeleteIcon />} label="Delete" />,
      ],
    },
  ];

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
        />
        <GlobalStyles styles={{ p: { marginTop: "auto" } }} />
      </div>
    </>
  );
}

export default EnrolledStudentsTable;

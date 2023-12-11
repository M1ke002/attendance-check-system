import { GridToolbarContainer, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import PostAddIcon from "@mui/icons-material/PostAdd";

import AddCourseModal from "../layout/Modal/AddCourseModal";

function CoursesTableToolbar() {
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  return (
    <>
      <GridToolbarContainer>
        <div className="ms-auto">
          <Button
            variant="success"
            className="me-4 d-inline-flex justify-content-center w-2"
            style={{ width: "50px" }}
            onClick={() => setShowAddCourseModal(true)}
          >
            <PostAddIcon fontSize="small" />
          </Button>
          <GridToolbarQuickFilter />
        </div>
      </GridToolbarContainer>
      <AddCourseModal data={{ setShowAddCourseModal, showAddCourseModal }} />
    </>
  );
}

export default CoursesTableToolbar;

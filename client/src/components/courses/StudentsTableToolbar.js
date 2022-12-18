import { GridToolbarContainer, GridToolbarQuickFilter } from "@mui/x-data-grid";
import Button from "react-bootstrap/Button";

import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";

function StudentsTableToolbar() {
  return (
    <>
      <GridToolbarContainer style={{ justifyContent: "flex-end" }}>
        {/* <div>
          <Button variant="success" className="me-2">
            Generate QR
          </Button>
        </div> */}
        <div>
          <Button
            variant="success"
            className="me-2 d-inline-flex justify-content-center w-2"
            style={{ width: "50px" }}
          >
            <UploadFileIcon fontSize="small" />
          </Button>
          <Button
            variant="danger"
            className="me-2 d-inline-flex justify-content-center w-2"
            style={{ width: "50px" }}
          >
            <GroupRemoveIcon fontSize="small" />
          </Button>
          <Button
            variant="info"
            className="me-4 d-inline-flex justify-content-center w-2"
            style={{ width: "50px" }}
          >
            <PersonAddAlt1Icon fontSize="small" />
          </Button>
          <GridToolbarQuickFilter />
        </div>
      </GridToolbarContainer>
    </>
  );
}

export default StudentsTableToolbar;

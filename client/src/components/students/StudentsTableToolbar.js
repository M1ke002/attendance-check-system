import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "react-bootstrap/Button";
import { useState, useEffect, useContext } from "react";
import { studentContext } from "../../contexts/StudentContext";
import AddStudentModal from "../layout/Modal/AddStudentModal";

import SearchIcon from "@mui/icons-material/Search";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

function StudentsTableToolbar({ data }) {
  const { setRows } = data;
  const {
    studentState: { foundStudents },
    setFoundStudents,
  } = useContext(studentContext);
  const [searchInput, setSearchInput] = useState("");
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  useEffect(() => {
    const values = searchInput.trim().toLowerCase().split(" ");
    if (values[0] === "") {
      setRows(foundStudents);
    } else {
      setRows(
        foundStudents.filter((data) =>
          values.every((value) => {
            return (
              data.studentId.toLowerCase().includes(value) ||
              data.name.toLowerCase().includes(value)
            );
          })
        )
      );
    }
  }, [foundStudents, setRows]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const id = setTimeout(() => {
      const values = searchInput.trim().toLowerCase().split(" ");
      //if empty search -> show all
      if (values[0] === "") {
        setRows(foundStudents);
      } else {
        setRows(
          foundStudents.filter((data) =>
            values.every((value) => {
              return (
                data.studentId.toLowerCase().includes(value) ||
                data.name.toLowerCase().includes(value)
              );
            })
          )
        );
      }
    }, 600);

    return () => clearTimeout(id);
  }, [searchInput, setRows]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="mt-1 mb-2 d-flex align-items-center justify-content-end">
        <Button
          variant="danger"
          className="me-2 d-inline-flex justify-content-center"
          style={{ height: "34px" }}
          onClick={() => setFoundStudents([])}
        >
          <span style={{ fontSize: "14px" }}>Clear</span>
        </Button>
        <Button
          variant="info"
          className="me-4 d-inline-flex justify-content-center"
          style={{ width: "50px" }}
          onClick={() => setShowAddStudentModal(true)}
        >
          <PersonAddAlt1Icon fontSize="small" />
        </Button>
        <TextField
          id="standard-search"
          placeholder="Search..."
          style={{ width: 220 }}
          type="search"
          variant="standard"
          value={searchInput}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ color: "black" }}>
                <SearchIcon className="mb-1" fontSize="small" />
              </InputAdornment>
            ),
          }}
          size="small"
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      <AddStudentModal data={{ showAddStudentModal, setShowAddStudentModal }} />
    </>
  );
}

export default StudentsTableToolbar;

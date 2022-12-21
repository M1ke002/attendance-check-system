import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import ClearIcon from "@mui/icons-material/Clear";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";

import excelIcon from "../../../assets/excel.svg";
import uploadImg from "../../../assets/cloud-upload-regular-240.png";

import { useRef, useState, useContext } from "react";
import readXlsxFile from "read-excel-file";
import { courseContext } from "../../../contexts/CourseContext";
import { studentContext } from "../../../contexts/StudentContext";
import { attendanceContext } from "../../../contexts/AttendanceContext";

function UploadFileModal({ data }) {
  const {
    showUploadFileModal,
    setShowUploadFileModal,
    course: currCoursePage,
  } = data;

  const {
    courseState: {
      selectedCourseInfo: { course, date },
    },
    getAllCourses,
  } = useContext(courseContext);

  const { enrollMultipleStudentsForCourse } = useContext(studentContext);

  const { getAttendance } = useContext(attendanceContext);

  const wrapperRef = useRef(null);
  const [isAdding, setIsAdding] = useState(false);
  const [file, setFile] = useState(null);
  const [inputField, setInputField] = useState({
    studentIdField: "",
    studentNameField: "",
  });
  const { studentIdField, studentNameField } = inputField;

  const onCloseModal = () => {
    setShowUploadFileModal(false);
    setInputField({
      studentIdField: "",
      studentNameField: "",
    });
    setFile(null);
  };

  const getDataFromFile = (rows) => {
    //check if file contains a row called 'student ID' and 'full name'
    let idField = studentIdField.trim(),
      nameField = studentNameField.trim();
    let studentIdIndex = null;
    let nameIndex = null;
    let rowIndex = null;
    rows.forEach((row, index) => {
      if (row.includes(idField) && row.includes(nameField)) {
        studentIdIndex = row.indexOf(idField);
        nameIndex = row.indexOf(nameField);
        rowIndex = index;
      }
    });
    if (!rowIndex) return null;
    // console.log(rowIndex);
    const data = [];
    for (let i = rowIndex + 1; i < rows.length; i++) {
      const row = rows[i];
      //if element at required indexes is null -> continue
      if (!row[studentIdIndex] || !row[nameIndex]) continue;
      data.push({
        studentId: row[studentIdIndex],
        name: row[nameIndex],
      });
    }
    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Missing file!", {
        theme: "colored",
        autoClose: 2000,
      });
      return;
    }
    if (studentIdField.trim() === "" || studentNameField.trim() === "") {
      console.log("Missing column names");
      toast.error("Missing column names", {
        theme: "colored",
        autoClose: 2000,
      });
      return;
    }
    setIsAdding(true);
    const rows = await readXlsxFile(file);
    console.log(rows);
    const extractedData = getDataFromFile(rows);
    console.log(extractedData, currCoursePage._id);
    if (!extractedData || extractedData.length === 0) {
      console.log("can't find student information in file");
      toast.error("can't find student information in file", {
        theme: "colored",
        autoClose: 2000,
      });
      setIsAdding(false);
      return;
    }
    const res = await enrollMultipleStudentsForCourse(
      extractedData,
      currCoursePage._id
    );
    if (res.success && res.students.length > 0) {
      await getAllCourses();
      //if there is a course selected at attendance page and it is same as the course in course details
      if (course && date && course._id === currCoursePage._id) {
        await getAttendance({
          courseId: course._id,
          date,
        });
      }
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
    setIsAdding(false);
  };

  const handleAddFile = (e) => {
    wrapperRef.current.classList.remove("dragover");
    const file = e.target.files[0];
    if (file) {
      const extension = file.name.split(".").pop();
      if (extension === "xlsx" || extension === "xls") setFile(file);
      else console.log("invalid file type");
    }
  };

  return (
    <>
      <Modal show={showUploadFileModal} centered onHide={onCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Upload excel file</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="pb-0">
            <Form.Group
              ref={wrapperRef}
              className="drop-file-input"
              onDrop={() => wrapperRef.current.classList.add("dragover")}
              onDragEnter={() => wrapperRef.current.classList.add("dragover")}
              onDragLeave={() =>
                wrapperRef.current.classList.remove("dragover")
              }
            >
              <Form.Group className="drop-file-label">
                <img src={uploadImg} alt="upload icon" />
                <p>Choose or drop the file of the class list here</p>
              </Form.Group>
              <Form.Control
                type="file"
                value=""
                accept="application/vnd.ms-excel"
                onChange={handleAddFile}
              />
            </Form.Group>
            {file && (
              <>
                <Form.Group className="my-2">
                  <Form.Text>File uploaded</Form.Text>
                </Form.Group>
                <Form.Group className="drop-file-item">
                  <img src={excelIcon} alt="file icon" />
                  <Form.Group className="drop-file-item-info">
                    <Form.Text>Name: {file.name}</Form.Text>
                    <Form.Text>Size: {file.size}B</Form.Text>
                  </Form.Group>
                  <span
                    className="drop-file-item-del"
                    onClick={() => setFile(null)}
                  >
                    <ClearIcon fontSize="small" />
                  </span>
                </Form.Group>
              </>
            )}
            <Form.Group>
              <Form.Label className="mt-3">
                <Form.Text style={{ fontSize: "1rem" }}>
                  Enter column names of student ID and student name in file
                </Form.Text>
              </Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Text>Column names</InputGroup.Text>
                <Form.Control
                  placeholder="Student ID"
                  required
                  value={studentIdField}
                  onChange={(e) =>
                    setInputField({
                      ...inputField,
                      studentIdField: e.target.value,
                    })
                  }
                />
                <Form.Control
                  placeholder="Full name"
                  required
                  value={studentNameField}
                  onChange={(e) =>
                    setInputField({
                      ...inputField,
                      studentNameField: e.target.value,
                    })
                  }
                />
              </InputGroup>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="info" type="submit">
              Submit
            </Button>
            <Button variant="danger" onClick={onCloseModal}>
              Cancel
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgb(0 0 0 / 30%);",
        }}
        open={isAdding}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

export default UploadFileModal;

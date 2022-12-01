import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Select from "react-select/";

import NoticeMessage from "../components/layout/NoticeMessage";
import AttendanceTable from "../components/attendance/AttendanceTable";
import EnrollStudentModal from "../components/attendance/EnrollStudentModal";
import UploadFileModal from "../components/attendance/UploadFileModal";
import ConfirmDeleteModal from "../components/attendance/ConfirmDeleteModal";
import { useEffect, useContext, useState } from "react";
import { courseContext } from "../contexts/CourseContext";
import { attendanceContext } from "../contexts/AttendanceContext";
import { convertDateFormat } from "../utils/utilsFunction";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const getDisplayedCourses = (courses) => {
  const displayCourses = courses.map((course) => {
    return {
      ...course,
      value: course._id,
      label: `${course.name} - ${course.year}`,
    };
  });
  return displayCourses;
};

function Attendance() {
  const [isFetching, setIsFetching] = useState(false);
  const [courseInfoField, setCourseInfoField] = useState({
    courseField: null,
    dateField: null,
  });
  const { courseField, dateField } = courseInfoField;

  const {
    courseState,
    getAllCourses,
    getSelectedCourseInfo,
    clearSelectedCourseInfo,
  } = useContext(courseContext);

  const {
    courses,
    isCourseLoading,
    selectedCourseInfo: { course, date },
  } = courseState;

  const { getAttendance, clearAttendance } = useContext(attendanceContext);

  // console.log(course, date);

  useEffect(() => {
    const getCourses = async () => {
      await getAllCourses();
    };
    getCourses();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault();
    //validation
    if (!courseField || !dateField) {
      console.log("Please enter course and date");
      return;
    }

    setIsFetching(true);
    const res = await getAttendance({
      courseId: courseField,
      date: dateField,
    });
    setIsFetching(false);

    getSelectedCourseInfo({
      courseId: courseField,
      date: dateField,
    });
    //fail -> generate attendance draft from selected course
    //else -> generate attendance
  };

  return (
    <>
      <Container className="page-bg">
        <Form className="p-3" onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>
              <strong>Select your course</strong>
            </Form.Label>
            <Select
              isLoading={isCourseLoading}
              options={isCourseLoading ? [] : getDisplayedCourses(courses)}
              placeholder="Select a course"
              noOptionsMessage={() => "No results found"}
              isClearable
              autoFocus
              className="mb-3"
              onChange={(e) => {
                setCourseInfoField({
                  ...courseInfoField,
                  courseField: e ? e.value : null,
                });
              }}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>
              <strong>Select date</strong>
            </Form.Label>
            <Form.Control
              type="date"
              className="mb-3"
              onChange={(e) => {
                setCourseInfoField({
                  ...courseInfoField,
                  dateField:
                    e.target.value === ""
                      ? null
                      : convertDateFormat(e.target.value),
                });
              }}
            />
          </Form.Group>
          <Button variant="success" type="submit">
            Go to course
          </Button>
          <Button
            variant="danger"
            className="ms-2"
            onClick={() => {
              clearAttendance();
              clearSelectedCourseInfo();
            }}
          >
            Reset
          </Button>
        </Form>
        <Row className="mt-3 mb-2">
          <Col>
            {course && date && <NoticeMessage setIsFetching={setIsFetching} />}
          </Col>
        </Row>
        <h4 className="text-center">Enrolled students</h4>
        <hr style={{ opacity: 0.15 }} />
        <AttendanceTable />
      </Container>
      <EnrollStudentModal />
      <UploadFileModal />
      <ConfirmDeleteModal />
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgb(0 0 0 / 30%);",
        }}
        open={isFetching}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

export default Attendance;

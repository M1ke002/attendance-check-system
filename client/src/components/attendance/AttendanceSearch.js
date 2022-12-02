import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Select from "react-select/";

import { useEffect, useContext, useState } from "react";
import { courseContext } from "../../contexts/CourseContext";
import { attendanceContext } from "../../contexts/AttendanceContext";
import { convertDateFormat } from "../../utils/utilsFunction";

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

function AttendanceSearch() {
  const [courseInfoField, setCourseInfoField] = useState({
    courseField: null,
    dateField: null,
  });
  const { courseField, dateField } = courseInfoField;

  const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);

  const {
    courseState,
    getAllCourses,
    getSelectedCourseInfo,
    clearSelectedCourseInfo,
  } = useContext(courseContext);

  const { courses, isCourseLoading } = courseState;

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

    setIsLoadingAttendance(true);
    const res = await getAttendance({
      courseId: courseField,
      date: dateField,
    });
    setIsLoadingAttendance(false);

    getSelectedCourseInfo({
      courseId: courseField,
      date: dateField,
    });
    //fail -> generate attendance draft from selected course
    //else -> generate attendance
  };

  return (
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
      <Button variant="success" type="submit" disabled={isLoadingAttendance}>
        {isLoadingAttendance ? "Loading course..." : "Go to course"}
      </Button>
      <Button
        variant="danger"
        className="ms-2"
        disabled={isLoadingAttendance}
        onClick={() => {
          clearAttendance();
          clearSelectedCourseInfo();
        }}
      >
        Reset
      </Button>
    </Form>
  );
}

export default AttendanceSearch;

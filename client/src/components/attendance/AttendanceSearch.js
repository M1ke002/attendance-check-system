import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import { toast } from "react-toastify";

import { useContext, useState, useEffect } from "react";
import { courseContext } from "../../contexts/CourseContext";
import { convertDateFormat } from "../../utils/utilsFunction";
import { attendanceContext } from "../../contexts/AttendanceContext";
import AddSessionModal from "../layout/Modal/AddSessionModal";

import AddIcon from "@mui/icons-material/Add";

const getDisplayedCourses = (courses) => {
  const displayedCourses = courses.map((course) => {
    return {
      ...course,
      value: course,
      label: `${course.name} - ${course.year}`,
    };
  });
  return displayedCourses;
};

const getDisplayedAttendance = (attendances) => {
  const displayedAttendance = attendances.map((attendance) => {
    return {
      ...attendance,
      value: attendance,
      label: `${attendance.sessionName} - ${convertDateFormat(
        attendance.date,
        "dd/mm/yyyy"
      )} (${attendance.startTime} - ${attendance.endTime})`,
    };
  });
  return displayedAttendance;
};

function AttendanceSearch() {
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [courseInfoField, setCourseInfoField] = useState({
    courseField: null,
    attendanceField: null,
  });
  const { courseField, attendanceField } = courseInfoField;

  const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);

  const {
    courseState,
    getSelectedCourseInfo,
    clearSelectedCourseInfo,
    getAllCourses,
  } = useContext(courseContext);

  const { courses, isCourseLoading, selectedCourseInfo } = courseState;
  console.log("courses: ", courses); //updated

  const {
    getAttendance,
    clearAttendance,
    attendanceState: { attendance },
  } = useContext(attendanceContext);

  useEffect(() => {
    //when save new attendance
    setCourseInfoField((prevState) => {
      if (!prevState.courseField) return prevState;
      const updatedCourse = courses.find(
        (c) => c._id === prevState.courseField._id
      );
      return {
        ...prevState,
        courseField: updatedCourse,
      };
    });
  }, [courses]);

  useEffect(() => {
    //when delete attendance
    //if selectedcourseinfo: session and course is null but input field is not null then set courseinfofield
    setCourseInfoField((prevState) => {
      const attendanceSelectField = prevState.attendanceField;
      const courseSelectField = prevState.courseField;
      if (
        !selectedCourseInfo.course &&
        !selectedCourseInfo.session &&
        courseSelectField &&
        attendanceSelectField
      ) {
        const updatedCourse = courses.find(
          (c) => c._id === courseSelectField._id
        );
        const currAttendance = updatedCourse.attendances.find(
          (a) => a._id === attendanceSelectField._id
        );
        if (!currAttendance) {
          //clear the select input value because the attendance already deleted
          return {
            ...prevState,
            attendanceField: null,
          };
        }
        //if update selectedcourseinfo: session info, and attendanceField is not empty
      } else if (courseSelectField && attendanceSelectField && attendance) {
        //check if attendanceSelectField is same as attendanceField value
        //TODO: optimize
        if (
          attendanceSelectField._id === attendance._id &&
          (attendanceSelectField._date !== attendance._date ||
            attendanceSelectField._sessionName !== attendance.sessionName ||
            attendanceSelectField.startTime !== attendance.startTime ||
            attendanceSelectField.endTime !== attendance.endTime)
        )
          return {
            ...prevState,
            attendanceField: attendance,
          };
      }
      return prevState;
    });
  }, [
    courses,
    selectedCourseInfo.course,
    selectedCourseInfo.session,
    attendance,
  ]);

  // console.log(course, date);

  //TODO: existing classes not update automatically after saving a new attendance

  const handleSubmit = async (e) => {
    //only for viewing existing attendances
    e.preventDefault();
    //validation
    if (!courseField || !attendanceField) {
      console.log("Missing session");
      toast.error("Missing session!", {
        theme: "colored",
        autoClose: 2000,
      });
      return;
    }
    // console.log("yot", attendanceId);
    setIsLoadingAttendance(true);
    let res = await getAttendance({
      attendanceId: attendanceField._id,
    });
    const attendance = res.attendance;

    res = await getAllCourses();
    //TODO: why getSelectedCourseInfo still uses old courses state?
    getSelectedCourseInfo({
      courseId: courseField._id,
      session: {
        date: attendance.date,
        timeRange: [attendance.startTime, attendance.endTime],
        sessionName: attendance.sessionName,
      },
      newCourses: res?.courses,
    });
    setIsLoadingAttendance(false);
    //fail -> generate attendance draft from selected course
    //else -> generate attendance
  };

  return (
    <>
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
              //if the selected course has no attendances or the selected course is different from the previous selected course
              //then clear the existing sessions field
              if (
                e?.value.attendances.length === 0 ||
                (courseField &&
                  attendanceField &&
                  courseField._id !== e?.value._id)
              ) {
                setCourseInfoField({
                  ...courseInfoField,
                  courseField: e ? e.value : null,
                  attendanceField: null,
                });
              } else {
                setCourseInfoField({
                  ...courseInfoField,
                  courseField: e ? e.value : null,
                  attendanceField: e ? attendanceField : null,
                });
              }
            }}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            <strong>Existing Sessions</strong>
          </Form.Label>
          <Select
            isLoading={isCourseLoading}
            options={
              courseField ? getDisplayedAttendance(courseField.attendances) : []
            }
            placeholder="View existing sessions"
            noOptionsMessage={() => "No results found"}
            isClearable
            autoFocus
            className="mb-3"
            value={
              attendanceField
                ? getDisplayedAttendance([attendanceField])[0]
                : null
            }
            onChange={(e) => {
              setCourseInfoField({
                ...courseInfoField,
                attendanceField: e ? e.value : null,
              });
            }}
          />
        </Form.Group>
        <div className="d-flex justify-content-between">
          <div>
            <Button
              variant="success"
              type="submit"
              disabled={isLoadingAttendance}
            >
              {isLoadingAttendance ? "Loading session..." : "View session"}
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
              Clear
            </Button>
          </div>
          <Button
            variant="primary"
            className="d-inline-flex align-items-center"
            onClick={() => {
              if (!courseField) {
                console.log("Missing course");
                toast.error("Missing course!", {
                  theme: "colored",
                  autoClose: 2000,
                });
              } else setShowAddSessionModal(true);
            }}
          >
            <AddIcon fontSize="small" className="me-1" />
            New session
          </Button>
        </div>
      </Form>
      {courseField && (
        <AddSessionModal
          data={{
            showAddSessionModal,
            setShowAddSessionModal,
            course: courses.find((c) => c._id === courseField._id),
          }}
        />
      )}
    </>
  );
}

export default AttendanceSearch;

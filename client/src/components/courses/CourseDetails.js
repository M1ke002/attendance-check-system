import CourseInfo from "./CourseInfo";
import AttendanceHistory from "../attendance/AttendanceHistory";

function CourseDetails({ course }) {
  // console.log(course);

  return (
    <>
      <CourseInfo course={course} />
      <AttendanceHistory course={course} />
    </>
  );
}

export default CourseDetails;

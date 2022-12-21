import CourseInfo from "./CourseInfo";
import AttendanceHistory from "../attendance/AttendanceHistory";

function CourseDetails({ course }) {
  // console.log(course);
  const sortedCourse = {
    ...course,
    //sort desc date by default
    attendances: course.attendances.sort((a, b) => {
      const dateA = a.date.split("/").reverse().join();
      const dateB = b.date.split("/").reverse().join();
      return dateA > dateB ? -1 : dateA < dateB ? 1 : 0;
    }),
  };

  return (
    <>
      <CourseInfo course={course} />
      <AttendanceHistory course={sortedCourse} />
    </>
  );
}

export default CourseDetails;

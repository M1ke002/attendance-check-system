import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

function ConfirmDeleteModal(props) {
  const {
    showConfirmDeleteModal,
    onHide,
    message = {},
    onDelete,
    onCancel,
  } = props;

  return (
    <Modal show={showConfirmDeleteModal} centered onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center justify-content-center">
          <ErrorOutlineIcon fontSize="large" className="me-2" />
          {message.header ? message.header : "Confirmation"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message.body ? message.body : "Are you sure you want to delete this?"}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onDelete}>
          {message.footer ? message.footer : "Delete"}
        </Button>
        <Button variant="light" onClick={onCancel}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmDeleteModal;

// import Modal from "react-bootstrap/Modal";
// import Button from "react-bootstrap/Button";
// import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

// import { useContext } from "react";
// import { studentContext } from "../../contexts/StudentContext";
// import { courseContext } from "../../contexts/CourseContext";
// import { attendanceContext } from "../../contexts/AttendanceContext";

// function ConfirmDeleteModal({ data }) {
//   const { showConfirmDeleteModal, setShowConfirmDeleteModal } = data;
//   const {
//     studentState: { selectedStudent },
//     removeStudentFromCourse,
//     deselectStudent,
//   } = useContext(studentContext);

//   const {
//     courseState: {
//       selectedCourseInfo: { course, date },
//     },
//     getAllCourses,
//     // updateCourseOnStudentUnenroll,
//   } = useContext(courseContext);

//   const { getAttendance } = useContext(attendanceContext);

//   const handleRemoveStudent = async () => {
//     const { student } = selectedStudent;
//     const res = await removeStudentFromCourse({
//       studentId: student._id,
//       courseId: course._id,
//     });
//     console.log(res);
//     await getAllCourses();
//     await getAttendance({
//       courseId: course._id,
//       date,
//     });
//     setShowConfirmDeleteModal(false);
//     // updateCourseOnStudentUnenroll(student._id);
//   };

//   return (
//     <Modal
//       show={showConfirmDeleteModal}
//       centered
//       onHide={() => {
//         setShowConfirmDeleteModal(false);
//         deselectStudent();
//       }}
//     >
//       <Modal.Header closeButton>
//         <Modal.Title className="d-flex align-items-center justify-content-center">
//           <ErrorOutlineIcon fontSize="large" className="me-2" />
//           Confirmation
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         {selectedStudent ? (
//           <>
//             Remove student:{" "}
//             <strong>
//               {selectedStudent.student.studentId} {selectedStudent.student.name}{" "}
//             </strong>
//             from this course?
//           </>
//         ) : (
//           "Removing..."
//         )}
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="danger" onClick={handleRemoveStudent}>
//           Remove
//         </Button>
//         <Button
//           variant="light"
//           onClick={() => {
//             setShowConfirmDeleteModal(false);
//             deselectStudent();
//           }}
//         >
//           Cancel
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// }

// export default ConfirmDeleteModal;

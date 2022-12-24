import {
  UPDATE_STUDENT,
  DELETE_STUDENT,
  SELECT_STUDENT,
  SET_FOUND_STUDENTS,
  REMOVE_STUDENT_FROM_COURSE,
} from "./constants";

const studentReducer = (state, action) => {
  const { type, payload } = action;
  const { foundStudents, selectedStudent, studentInfo } = payload;

  switch (type) {
    case SET_FOUND_STUDENTS:
      return {
        ...state,
        foundStudents,
      };
    case SELECT_STUDENT:
      return {
        ...state,
        selectedStudent: studentInfo,
      };
    case REMOVE_STUDENT_FROM_COURSE:
      return {
        ...state,
        selectedStudent: null,
      };
    case DELETE_STUDENT:
      return {
        ...state,
        foundStudents,
        selectedStudent: null,
      };
    case UPDATE_STUDENT:
      return {
        ...state,
        foundStudents,
        selectedStudent,
      };
    default:
      return state;
  }
};

export default studentReducer;

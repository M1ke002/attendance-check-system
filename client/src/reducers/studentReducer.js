import {
  STUDENTS_LOADED_SUCCESS,
  STUDENTS_LOADED_FAILED,
  SELECT_STUDENT,
  DESELECT_STUDENT,
  REMOVE_STUDENT_FROM_COURSE,
} from "./constants";

const studentReducer = (state, action) => {
  const { type, payload } = action;
  const { students, studentInfo } = payload;

  switch (type) {
    case STUDENTS_LOADED_SUCCESS: //optional
      return {
        ...state,
        students,
      };
    case STUDENTS_LOADED_FAILED: //optional
      return {
        ...state,
        students: [],
        selectedStudent: null,
      };
    case SELECT_STUDENT:
      return {
        ...state,
        selectedStudent: {
          student: studentInfo.student,
        },
      };
    case DESELECT_STUDENT:
      return {
        ...state,
        selectedStudent: null,
      };
    case REMOVE_STUDENT_FROM_COURSE:
      return {
        ...state,
        selectedStudent: null,
      };
    default:
      return state;
  }
};

export default studentReducer;

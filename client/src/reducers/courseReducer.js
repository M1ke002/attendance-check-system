import {
  COURSE_LOADED_SUCCESS,
  COURSE_LOADED_FAILED,
  SELECT_COURSE_INFO,
  ADD_COURSE,
  UPDATE_COURSE,
  DELETE_COURSE,
} from "./constants";

const courseReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case COURSE_LOADED_SUCCESS:
      return {
        ...state,
        isCourseLoading: false,
        courses: payload.courses,
        selectedCourseInfo: payload.selectedCourseInfo,
      };
    case COURSE_LOADED_FAILED:
      return {
        ...state,
        isCourseLoading: false,
        courses: [],
        selectedCourseInfo: {
          course: null,
          date: null,
        },
      };
    case ADD_COURSE:
      return {
        ...state,
        courses: [...state.courses, payload.newCourse],
      };
    case UPDATE_COURSE:
      const updatedCourses = state.courses.map((course) => {
        if (course._id !== payload.updatedCourse._id) return course;
        else return payload.updatedCourse;
      });
      return {
        ...state,
        courses: updatedCourses,
      };
    case DELETE_COURSE:
      const newCourses = state.courses.filter((course) => {
        return course._id !== payload.deletedCourseId;
      });
      return {
        ...state,
        courses: newCourses,
      };
    case SELECT_COURSE_INFO:
      return {
        ...state,
        selectedCourseInfo: payload.selectedCourseInfo,
      };
    default:
      return state;
  }
};

export default courseReducer;

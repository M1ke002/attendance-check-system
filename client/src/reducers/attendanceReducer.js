import {
  ATTENDANCE_LOADED_SUCCESS,
  ATTENDANCE_LOADED_FAILED,
  DELETE_ATTENDANCE,
  UPDATE_ATTENDANCE,
  CLEAR_ATTENDANCE,
  CREATE_ATTENDANCE,
} from "./constants";

const attendanceReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case ATTENDANCE_LOADED_SUCCESS:
      return {
        ...state,
        attendance: payload.attendance,
        isAttendanceLoading: false,
      };
    case ATTENDANCE_LOADED_FAILED:
      return {
        ...state,
        attendance: null,
        isAttendanceLoading: false,
      };
    case DELETE_ATTENDANCE: {
      return {
        ...state,
        attendance: null,
      };
    }
    case CREATE_ATTENDANCE: {
      return {
        ...state,
        attendance: payload.attendance,
      };
    }
    case UPDATE_ATTENDANCE: {
      return {
        ...state,
        attendance: payload.attendance,
      };
    }
    case CLEAR_ATTENDANCE:
      return {
        ...state,
        attendance: null,
      };
    default:
      return state;
  }
};

export default attendanceReducer;

import { createContext, useReducer, useEffect, useContext } from "react";
import { authContext } from "./AuthContext";
import attendanceReducer from "../reducers/attendanceReducer";
import { apiUrl, mobileApiUrl } from "./constants";
import axios from "axios";

import {
  ATTENDANCE_LOADED_SUCCESS,
  ATTENDANCE_LOADED_FAILED,
  DELETE_ATTENDANCE,
  UPDATE_ATTENDANCE,
  CLEAR_ATTENDANCE,
  CREATE_ATTENDANCE,
} from "../reducers/constants";

export const attendanceContext = createContext();

function AttendanceContext({ children }) {
  const [attendanceState, dispatch] = useReducer(attendanceReducer, {
    attendance: null,
    isAttendanceLoading: true,
  });

  const {
    authState: { isAuthenticated },
  } = useContext(authContext);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch({
        type: ATTENDANCE_LOADED_FAILED,
      });
    }
  }, [isAuthenticated]);

  const getAttendance = async (courseInfo) => {
    const { courseId, date } = courseInfo;
    try {
      const res = await axios.get(
        `${apiUrl}/attendance?courseId=${courseId}&date=${date}`
      );
      if (res.data.success) {
        dispatch({
          type: ATTENDANCE_LOADED_SUCCESS,
          payload: {
            attendance: res.data.attendance,
          },
        });
      }
      return res.data;
    } catch (error) {
      console.log("attendance not found");
      dispatch({
        type: ATTENDANCE_LOADED_FAILED,
      });
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const getAttendanceDetails = async (attendanceId) => {
    try {
      const res = await axios.get(
        `${mobileApiUrl}/attendance/details?attendanceId=${attendanceId}`
      );
      return res.data;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const deleteAttendance = async (attendanceId) => {
    try {
      const res = await axios.delete(`${apiUrl}/attendance/${attendanceId}`);
      if (res.data.success) {
        dispatch({
          type: DELETE_ATTENDANCE,
        });
      }
      return res.data;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const createAttendance = async (attendanceInfo) => {
    try {
      const res = await axios.post(`${apiUrl}/attendance`, attendanceInfo);
      if (res.data.success) {
        dispatch({
          type: CREATE_ATTENDANCE,
          payload: {
            attendance: res.data.attendance,
          },
        });
      }
      return res.data;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const updateAttendance = async (newAttendance) => {
    try {
      const res = await axios.put(
        `${apiUrl}/attendance/${newAttendance._id}`,
        newAttendance
      );
      if (res.data.success) {
        dispatch({
          type: UPDATE_ATTENDANCE,
          payload: {
            attendance: res.data.attendance,
          },
        });
      }
      return res.data;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const clearAttendance = () => {
    dispatch({
      type: CLEAR_ATTENDANCE,
    });
  };

  const checkAttendance = async (studentId, attendanceId) => {
    try {
      const res = await axios.post(`${mobileApiUrl}/attendance/check-student`, {
        studentId,
        attendanceId,
      });
      return res.data;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const setAttendanceValid = async (attendanceId, isValid) => {
    try {
      const res = await axios.post(`${apiUrl}/attendance/set-valid`, {
        attendanceId,
        isValid,
      });
      return res.data;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const attendanceData = {
    attendanceState,
    getAttendance,
    deleteAttendance,
    updateAttendance,
    clearAttendance,
    createAttendance,
    checkAttendance,
    getAttendanceDetails,
    setAttendanceValid,
  };
  return (
    <attendanceContext.Provider value={attendanceData}>
      {children}
    </attendanceContext.Provider>
  );
}

export default AttendanceContext;

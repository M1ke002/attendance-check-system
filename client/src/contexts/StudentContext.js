import { useEffect, createContext, useReducer } from "react";
import { apiUrl } from "./constants";
import studentReducer from "../reducers/studentReducer";
import axios from "axios";

import {
  STUDENTS_LOADED_SUCCESS,
  STUDENTS_LOADED_FAILED,
  SELECT_STUDENT,
  DESELECT_STUDENT,
  REMOVE_STUDENT_FROM_COURSE,
} from "../reducers/constants";

export const studentContext = createContext();

function StudentContext({ children }) {
  const [studentState, dispatch] = useReducer(studentReducer, {
    students: [], //TODO: search student directly from db
    selectedStudent: null,
  });

  // console.log(studentState.students);

  useEffect(() => {
    const getAllStudents = async () => {
      try {
        const res = await axios.get(`${apiUrl}/students`);
        if (res.data.success) {
          dispatch({
            type: STUDENTS_LOADED_SUCCESS,
            payload: {
              students: res.data.students,
            },
          });
        }
        return res.data;
      } catch (error) {
        dispatch({
          type: STUDENTS_LOADED_FAILED,
          payload: {},
        });
        if (error.response) return error.response.data;
        else return { success: false, message: error.message };
      }
    };
    getAllStudents();
  }, []);

  const enrollStudentForCourse = async (enrollInfo) => {
    try {
      const res = await axios.post(`${apiUrl}/students/enroll`, enrollInfo);
      return res.data;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const enrollMultipleStudentsForCourse = async (data, courseId) => {
    try {
      const res = await axios.post(`${apiUrl}/students/enroll-multiple`, {
        studentData: data,
        courseId,
      });
      return res.data;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const removeStudentFromCourse = async (studentInfo) => {
    try {
      const res = await axios.put(
        `${apiUrl}/students/unenroll/${studentInfo.studentId}`,
        studentInfo
      );
      if (res.data.success) {
        dispatch({
          type: REMOVE_STUDENT_FROM_COURSE,
          payload: {},
        });
      }
      return res.data;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const removeMultipleStudentsFromCourse = async (data) => {
    try {
      // const res = await axios.put(`${apiUrl}/students/unenroll-multiple`, data);
      console.log(data);
      const res = {
        data: { success: true, message: "removed multiple students" },
      };
      return res.data;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const getSelectedStudent = (studentInfo) => {
    dispatch({
      type: SELECT_STUDENT,
      payload: {
        studentInfo,
      },
    });
  };

  const deselectStudent = () => {
    dispatch({
      type: DESELECT_STUDENT,
      payload: {},
    });
  };

  const findStudents = async (query) => {
    try {
      const res = await axios.get(
        `${apiUrl}/students/search?searchQuery=${query}`
      );
      return res.data;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const studentData = {
    getSelectedStudent,
    deselectStudent,
    enrollStudentForCourse,
    enrollMultipleStudentsForCourse,
    removeStudentFromCourse,
    removeMultipleStudentsFromCourse,
    findStudents,
    studentState,
  };

  return (
    <studentContext.Provider value={studentData}>
      {children}
    </studentContext.Provider>
  );
}

export default StudentContext;

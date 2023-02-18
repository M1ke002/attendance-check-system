import { createContext, useReducer } from "react";
import { apiUrl } from "./constants";
import studentReducer from "../reducers/studentReducer";
import axios from "axios";

import {
  UPDATE_STUDENT,
  DELETE_STUDENT,
  SELECT_STUDENT,
  SET_FOUND_STUDENTS,
  REMOVE_STUDENT_FROM_COURSE,
} from "../reducers/constants";

export const studentContext = createContext();

function StudentContext({ children }) {
  const [studentState, dispatch] = useReducer(studentReducer, {
    foundStudents: [],
    selectedStudent: null,
  });

  // console.log(studentState.students);

  // useEffect(() => {
  //   const getAllStudents = async () => {
  //     try {
  //       const res = await axios.get(`${apiUrl}/students`);
  //       if (res.data.success) {
  //         dispatch({
  //           type: STUDENTS_LOADED_SUCCESS,
  //           payload: {
  //             students: res.data.students,
  //           },
  //         });
  //       }
  //       return res.data;
  //     } catch (error) {
  //       dispatch({
  //         type: STUDENTS_LOADED_FAILED,
  //         payload: {},
  //       });
  //       if (error.response) return error.response.data;
  //       else return { success: false, message: error.message };
  //     }
  //   };
  //   getAllStudents();
  // }, []);

  const addStudent = async (studentInfo) => {
    try {
      const res = await axios.post(`${apiUrl}/students`, studentInfo);
      return res.data;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const deleteStudent = async (studentId) => {
    try {
      const res = await axios.delete(`${apiUrl}/students/${studentId}`);
      if (res.data.success) {
        const updatedStudents = studentState.foundStudents.filter(
          (student) => student._id !== studentId
        );
        dispatch({
          type: DELETE_STUDENT,
          payload: {
            foundStudents: updatedStudents,
          },
        });
      }
      return res.data;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const deleteAllStudents = async () => {
    try {
      const res = await axios.delete(`${apiUrl}/students`);
      if (res.data.success) {
        dispatch({
          type: DELETE_STUDENT,
          payload: {
            foundStudents: [],
          },
        });
      }
      return res.data;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const updateStudent = async (studentInfo) => {
    try {
      const res = await axios.put(
        `${apiUrl}/students/${studentInfo._id}`,
        studentInfo
      );
      if (res.data.success) {
        const updatedStudents = studentState.foundStudents.map((student) => {
          if (student._id !== res.data.student._id) {
            return student;
          } else {
            return {
              ...student,
              name: res.data.student.name,
              studentId: res.data.student.studentId,
            };
          }
        });
        const updatedSelectedStudent = {
          ...studentState.selectedStudent,
          name: res.data.student.name,
          studentId: res.data.student.studentId,
        };
        dispatch({
          type: UPDATE_STUDENT,
          payload: {
            foundStudents: updatedStudents,
            selectedStudent: updatedSelectedStudent,
          },
        });
      }
      return res.data;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const enrollStudentForCourse = async (enrollInfo) => {
    //TODO: update found students?
    try {
      const res = await axios.post(`${apiUrl}/students/enroll`, enrollInfo);
      return res.data;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const enrollMultipleStudentsForCourse = async (data, courseId) => {
    //update found students?
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
    //update found students?
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
    //update found students?
    try {
      const res = await axios.put(`${apiUrl}/students/unenroll-multiple`, data);
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

  const setFoundStudents = (students) => {
    dispatch({
      type: SET_FOUND_STUDENTS,
      payload: {
        foundStudents: students,
      },
    });
  };

  const studentData = {
    getSelectedStudent,
    enrollStudentForCourse,
    enrollMultipleStudentsForCourse,
    removeStudentFromCourse,
    removeMultipleStudentsFromCourse,
    findStudents,
    addStudent,
    deleteStudent,
    deleteAllStudents,
    updateStudent,
    setFoundStudents,
    studentState,
  };

  return (
    <studentContext.Provider value={studentData}>
      {children}
    </studentContext.Provider>
  );
}

export default StudentContext;

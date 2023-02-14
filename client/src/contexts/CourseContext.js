import { createContext, useReducer, useEffect, useContext } from "react";
import axios from "axios";
import { apiUrl } from "./constants";
import {
  COURSE_LOADED_SUCCESS,
  COURSE_LOADED_FAILED,
  SELECT_COURSE_INFO,
  DELETE_COURSE,
  ADD_COURSE,
  UPDATE_COURSE,
} from "../reducers/constants";
import courseReducer from "../reducers/courseReducer";
import { authContext } from "./AuthContext";

export const courseContext = createContext();

function CourseContext({ children }) {
  const [courseState, dispatch] = useReducer(courseReducer, {
    courses: [],
    selectedCourseInfo: {
      course: null,
      session: null,
    },
    isCourseLoading: true,
  });

  const { course: selectedCourse } = courseState.selectedCourseInfo;

  const {
    authState: { isAuthenticated },
  } = useContext(authContext);

  useEffect(() => {
    if (!isAuthenticated) {
      if (courseState.courses.length > 0)
        dispatch({
          type: COURSE_LOADED_FAILED,
          payload: {},
        });
      return;
    }
    const getCourses = async () => {
      await getAllCourses();
    };
    getCourses();
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  const getAllCourses = async () => {
    try {
      const res = await axios.get(`${apiUrl}/courses`);
      if (res.data.success) {
        let updatedCourse = null;
        if (selectedCourse) {
          updatedCourse = res.data.courses.find(
            (course) => course._id === selectedCourse._id
          );
        }
        dispatch({
          type: COURSE_LOADED_SUCCESS,
          payload: {
            courses: res.data.courses,
            course: updatedCourse,
          },
        });
      }
      return res.data;
    } catch (error) {
      dispatch({
        type: COURSE_LOADED_FAILED,
        payload: {},
      });
      if (error.response)
        //the error message we sent (on purpose) from server (res.status(500).json ...)
        return error.response.data;
      // error that we didnt expect from server
      else return { success: false, message: error.message };
    }
  };

  const getSelectedCourseInfo = (courseInfo) => {
    const { courseId, session, newCourses } = courseInfo;
    console.log("info", courseId);
    let courses = newCourses ? newCourses : courseState.courses;
    // console.log("tt", courseState.courses);
    const selectedCourse = courses.find((course) => course._id === courseId);
    // console.log("yay", selectedCourse);
    dispatch({
      type: SELECT_COURSE_INFO,
      payload: {
        selectedCourseInfo: {
          course: selectedCourse ? selectedCourse : null,
          session,
        },
      },
    });
  };

  const clearSelectedCourseInfo = () => {
    dispatch({
      type: SELECT_COURSE_INFO,
      payload: {
        selectedCourseInfo: {
          course: null,
          session: null,
        },
      },
    });
  };

  const createCourse = async (courseForm) => {
    try {
      const res = await axios.post(`${apiUrl}/courses`, courseForm);
      if (res.data.success) {
        dispatch({
          type: ADD_COURSE,
          payload: {
            newCourse: res.data.course,
          },
        });
      }
      return res.data;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const updateCourse = async (courseForm) => {
    try {
      const res = await axios.put(
        `${apiUrl}/courses/${courseForm._id}`,
        courseForm
      );
      if (res.data.success) {
        dispatch({
          type: UPDATE_COURSE,
          payload: {
            updatedCourse: res.data.course,
          },
        });
      }
      return res.data;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const deleteCourse = async (courseId) => {
    try {
      const res = await axios.delete(`${apiUrl}/courses/${courseId}`);
      if (res.data.success) {
        dispatch({
          type: DELETE_COURSE,
          payload: {
            deletedCourseId: courseId,
          },
        });
      }
      return res.data;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const courseData = {
    courseState,
    getAllCourses,
    getSelectedCourseInfo,
    clearSelectedCourseInfo,
    createCourse,
    updateCourse,
    deleteCourse,
  };

  return (
    <courseContext.Provider value={courseData}>
      {children}
    </courseContext.Provider>
  );
}

export default CourseContext;

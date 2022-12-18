import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./components/layout/Landing";
import Auth from "./pages/Auth";
import Attendance from "./pages/Attendance";
import Courses from "./pages/Courses";
import CoursePage from "./pages/CoursePage";
import AuthContextProvider from "./contexts/AuthContext";
import AttendanceContextProvider from "./contexts/AttendanceContext";
import CourseContextProvider from "./contexts/CourseContext";
import StudentContextProvider from "./contexts/StudentContext";
import ProtectedRoutes from "./components/routes/ProtectedRoutes";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import Test from "./utils/test";

function App() {
  return (
    <>
      <CourseContextProvider>
        <AttendanceContextProvider>
          <StudentContextProvider>
            <AuthContextProvider>
              <Router>
                <Routes>
                  <Route exact path="/" element={<Landing />} />
                  <Route
                    exact
                    path="/login"
                    element={<Auth routeType="login" />}
                  />
                  <Route
                    exact
                    path="/register"
                    element={<Auth routeType="register" />}
                  />
                  <Route element={<ProtectedRoutes />}>
                    <Route exact path="/attendance" element={<Attendance />} />
                    <Route exact path="/courses" element={<Courses />} />
                    <Route
                      exact
                      path="/courses/:courseId"
                      element={<CoursePage />}
                    />
                    <Route exact path="/test" element={<Test />} />
                  </Route>
                </Routes>
              </Router>
            </AuthContextProvider>
          </StudentContextProvider>
        </AttendanceContextProvider>
      </CourseContextProvider>
      <ToastContainer />
    </>
  );
}

export default App;

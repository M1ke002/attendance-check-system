import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./components/layout/Landing";
import Auth from "./pages/Auth";
import Attendance from "./pages/Attendance";
import Courses from "./pages/Courses";
import CoursePage from "./pages/CoursePage";
import Profile from "./pages/Profile";
import Students from "./pages/Students";
import AttendanceCheck from "./pages/AttendanceCheck";
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
      <AuthContextProvider>
        <CourseContextProvider>
          <AttendanceContextProvider>
            <StudentContextProvider>
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
                  <Route
                    exact
                    path="/forgot-password"
                    element={<Auth routeType="forgotPassword" />}
                  />
                  <Route
                    exact
                    path="/reset-password/:resetToken"
                    element={<Auth routeType="resetPassword" />}
                  />
                  <Route
                    exact
                    path="/attendance/check/:attendanceId"
                    element={<AttendanceCheck />}
                  />
                  <Route element={<ProtectedRoutes />}>
                    <Route exact path="/attendance" element={<Attendance />} />
                    <Route exact path="/courses" element={<Courses />} />
                    <Route
                      exact
                      path="/courses/:courseId"
                      element={<CoursePage />}
                    />
                    <Route exact path="/profile" element={<Profile />} />
                    <Route exact path="/students" element={<Students />} />
                    <Route exact path="/test" element={<Test />} />
                  </Route>
                </Routes>
              </Router>
            </StudentContextProvider>
          </AttendanceContextProvider>
        </CourseContextProvider>
      </AuthContextProvider>
      <ToastContainer />
    </>
  );
}

export default App;

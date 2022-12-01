import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./components/layout/Landing";
import Auth from "./pages/Auth";
import Attendance from "./pages/Attendance";
import AuthContextProvider from "./contexts/AuthContext";
import AttendanceContextProvider from "./contexts/AttendanceContext";
import CourseContextProvider from "./contexts/CourseContext";
import StudentContextProvider from "./contexts/StudentContext";
import ProtectedRoutes from "./components/routes/ProtectedRoutes";

import Test from "./utils/test";

function App() {
  return (
    <CourseContextProvider>
      <AttendanceContextProvider>
        <StudentContextProvider>
          <AuthContextProvider>
            <Router>
              <Routes>
                <Route exact path="/test" element={<Test />} />
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
                </Route>
              </Routes>
            </Router>
          </AuthContextProvider>
        </StudentContextProvider>
      </AttendanceContextProvider>
    </CourseContextProvider>
  );
}

export default App;

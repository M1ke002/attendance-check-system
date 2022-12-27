export const apiUrl =
  process.env.NODE_ENV === "production"
    ? "deployed_api"
    : "http://localhost:5000/api";
export const mobileApiUrl =
  process.env.NODE_ENV === "production"
    ? "deployed_api"
    : "http://192.168.1.4:5000/api";
export const ACCESS_TOKEN_NAME = "attendanceSystem";
export const STUDENT_TOKEN_NAME = "student";

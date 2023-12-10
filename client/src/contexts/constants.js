export const apiUrl =
  process.env.NODE_ENV === "production"
    ? "https://attendance-check-system-server.vercel.app/api"
    : "http://localhost:5000/api";
const IP_NUMBER = "192.168.1.11"; //change this constant if IP changes
export const IP = IP_NUMBER + ":3000"; //mobileApiUrl and IP can change after some time?
export const mobileApiUrl =
  process.env.NODE_ENV === "production"
    ? apiUrl
    : "http://" + IP_NUMBER + ":5000/api";
export const ACCESS_TOKEN_NAME = "attendanceSystem";
export const STUDENT_TOKEN_NAME = "student";
export const DEPLOYED_URL = "https://attendance-check-system.vercel.app";

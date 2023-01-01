import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import { useEffect, useContext } from "react";
import { authContext } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

function Auth({ routeType }) {
  const { authState } = useContext(authContext);
  const { isAuthenticated, isAuthLoading } = authState;

  useEffect(() => {
    document.body.style.backgroundColor = "#f7f7f9";
    return () => {
      document.body.style.backgroundColor = "#fff";
    };
  }, []);

  if (isAuthLoading) {
    return (
      <Backdrop
        sx={{
          color: "#ccc",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgba(166, 174, 176, 0.1)",
        }}
        open={isAuthLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  } else if (isAuthenticated) {
    return <Navigate to="/attendance" />;
  } else {
    return (
      <>
        <div className="auth-body">
          {routeType === "login" ? <LoginForm /> : <RegisterForm />}
          <p className="text-center text-muted mt-2">
            Copyright &copy; 2022 by Mitty
          </p>
        </div>
      </>
    );
  }
}

export default Auth;

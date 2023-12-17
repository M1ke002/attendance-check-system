import React from "react";
import { useState, useContext } from "react";
import { authContext } from "../../contexts/AuthContext";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import AlertMessage from "../layout/AlertMessage";

import { Link } from "react-router-dom";

import { isValidEmail } from "../../utils/utilsFunction";

const ForgotPasswordForm = () => {
  const { forgotPassword } = useContext(authContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [userForm, setUserForm] = useState({
    email: "",
  });
  const [alert, setAlert] = useState({
    message: "",
    show: false,
    type: "",
  });

  const { email } = userForm;

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    //check if email is valid
    if (!isValidEmail(email)) {
      console.log("Invalid email");
      return;
    }
    setIsLoading(true);
    const res = await forgotPassword(userForm.email);
    setIsLoading(false);
    if (res.success) {
      setAlert({
        ...alert,
        message: res.message,
        show: true,
        type: "light-success",
      });
      setIsEmailSent(true);
    } else {
      setAlert({
        ...alert,
        message: res.message,
        show: true,
        type: "light-danger",
      });
    }
  };

  return (
    <Container>
      <Card className="shadow-sm overflow-hidden" border="light">
        <div className="p-4 text-center login-bg text-white">
          <h4>Forgot password</h4>
          <span className="text-muted">Attendance check system</span>
        </div>
        <div className="p-4">
          <Form onSubmit={handleForgotPassword}>
            {alert.show && <AlertMessage data={{ alert, setAlert }} />}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                name="email"
                required
                value={email}
                onChange={(e) => {
                  setUserForm({
                    ...userForm,
                    [e.target.name]: e.target.value,
                  });
                }}
              />
            </Form.Group>

            {isLoading ? (
              <div className="d-flex justify-content-center mt-3 mb-3">
                <Spinner animation="border" variant="info"></Spinner>
              </div>
            ) : (
              <Button
                variant="primary"
                className="mt-3 mb-3 w-100"
                type="submit"
                style={{ width: "70px" }}
                disabled={isEmailSent}
              >
                Send
              </Button>
            )}
          </Form>
          <p className="text-center mb-0">
            Or
            <Link to="/login">
              <Button variant="info" size="sm" className="ms-2 text-white">
                Sign in
              </Button>
            </Link>
          </p>
        </div>
      </Card>
    </Container>
  );
};

export default ForgotPasswordForm;

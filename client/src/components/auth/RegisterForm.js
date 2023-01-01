import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";

import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { authContext } from "../../contexts/AuthContext";
import AlertMessage from "../layout/AlertMessage";

function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [userForm, setUserForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const { registerUser } = useContext(authContext);
  const [alert, setAlert] = useState({
    message: "",
    show: false,
    type: "",
  });

  const { username, password, confirmPassword } = userForm;

  const changeFormValue = (e) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (password !== confirmPassword) {
      setAlert({
        ...alert,
        message: "Passwords do not match",
        show: true,
        type: "light-danger",
      });
      setIsLoading(false);
      return;
    }
    const res = await registerUser(userForm);
    setIsLoading(false);
    if (res.data) {
      if (!res.data.success) {
        //error sent by us
        setAlert({
          ...alert,
          message: res.data.message,
          show: true,
          type: "light-danger",
        });
      }
    } else {
      //uncaught error sent from server
      setAlert({
        ...alert,
        message: res,
        show: true,
        type: "light-danger",
      });
    }
  };

  return (
    <Container>
      <Card className="shadow-sm overflow-hidden" border="light">
        <div className="p-4 text-center login-bg text-white">
          <h4>Register</h4>
          <span className="text-muted">Attendance check system</span>
        </div>
        <div className="p-4">
          <Form onSubmit={handleRegister}>
            {alert.show && <AlertMessage data={{ alert, setAlert }} />}
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="username"
                name="username"
                required
                value={username}
                onChange={changeFormValue}
              />
            </Form.Group>
            <Form.Group className="mt-3 mb-1">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="password"
                name="password"
                required
                value={password}
                onChange={changeFormValue}
              />
            </Form.Group>
            <Form.Group className="mt-3 mb-1">
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                type="password"
                placeholder="confirm password"
                name="confirmPassword"
                required
                value={confirmPassword}
                onChange={changeFormValue}
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
              >
                Sign up
              </Button>
            )}
          </Form>
          <p className="text-center mb-0">
            Already have an account?
            <Link to="/login">
              <Button variant="info" size="sm" className="ms-2 text-white">
                Login
              </Button>
            </Link>
          </p>
        </div>
      </Card>
    </Container>
  );
}

export default RegisterForm;

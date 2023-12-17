import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";

import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { authContext } from "../../contexts/AuthContext";
import AlertMessage from "../layout/AlertMessage";

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [userForm, setUserForm] = useState({
    username: "mike",
    password: "1234",
  });
  const { loginUser } = useContext(authContext);
  const [alert, setAlert] = useState({
    message: "",
    show: false,
    type: "",
  });

  const { username, password } = userForm;

  const changeFormValue = (e) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await loginUser(userForm);
    setIsLoading(false);
    if (res.data) {
      //error sent by us
      if (!res.data.success) {
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
    <>
      <Container>
        <Card className="shadow-sm overflow-hidden" border="light">
          <div className="p-4 text-center login-bg text-white">
            <h4>Login</h4>
            <span className="text-muted">Attendance check system</span>
          </div>
          <div className="p-4">
            <Form onSubmit={handleLogin}>
              {alert.show && <AlertMessage data={{ alert, setAlert }} />}
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Username"
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
                  placeholder="Password"
                  name="password"
                  required
                  value={password}
                  onChange={changeFormValue}
                />
              </Form.Group>
              <Link
                to="/forgot-password"
                style={{ textDecoration: "none", color: "#3498db" }}
              >
                Forgot password?
              </Link>
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
                  Sign in
                </Button>
              )}
            </Form>
            <p className="text-center mb-0">
              Don't have an account?
              <Link to="/register">
                <Button variant="info" size="sm" className="ms-2 text-white">
                  Register
                </Button>
              </Link>
            </p>
          </div>
        </Card>
      </Container>
    </>
  );
}

export default LoginForm;

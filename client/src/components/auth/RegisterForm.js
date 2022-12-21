import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";

import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { authContext } from "../../contexts/AuthContext";
import AlertMessage from "../layout/AlertMessage";

function LoginForm() {
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
      <Row>
        <Col sm={3} md={2} lg={4}></Col>
        <Col xs={12} sm={6} md={8} lg={4}>
          <Card className="shadow-sm">
            <Card.Header as="h4" className="text-center">
              Register
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleRegister}>
                {alert.show && <AlertMessage data={{ alert, setAlert }} />}
                <Form.Group className="my-3">
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
            </Card.Body>
          </Card>
        </Col>
        <Col sm={3} md={2} lg={4}></Col>
      </Row>
    </Container>
  );
}

export default LoginForm;

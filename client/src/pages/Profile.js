import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { authContext } from "../contexts/AuthContext";
import PersonalInfo from "../components/Profile/PersonalInfo";

function Profile() {
  const {
    authState: { user },
  } = useContext(authContext);

  const [infoInputField, setInfoInputField] = useState({
    username: user.username,
    email: "",
  });

  const [passwordInputField, setPasswordInputField] = useState({
    currPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { currPassword, newPassword, confirmPassword } = passwordInputField;

  useEffect(() => {
    document.body.style.backgroundColor = "#f7f7f9";
    return () => {
      document.body.style.backgroundColor = "#fff";
    };
  }, []);

  const handleFormInput = (e, type) => {
    console.log(e?.target?.value, type);
    if (type === "password") {
      setPasswordInputField({
        ...passwordInputField,
        [e.target.name]: e.target.value,
      });
    } else {
      setInfoInputField({
        ...infoInputField,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    //validate
    if (currPassword === "" || newPassword === "" || confirmPassword === "") {
      console.log("can't leave empty fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      console.log("new password doesn't match");
      return;
    }
    //do stuffs here
    console.log("changed!");
  };

  return (
    <Container>
      <PersonalInfo />

      <Card
        border="0"
        className="d-flex justify-content-center shadow-sm px-4 pb-2"
        style={{ marginTop: "18px", marginBottom: "15px" }}
      >
        <Card.Body>
          <p
            style={{
              fontSize: "16px",
              margin: "10px 0 10px 0",
              fontWeight: "600",
              color: "rgb(62 67 73)",
            }}
          >
            Change password
          </p>

          <Form onSubmit={handleChangePassword}>
            <Form.Group>
              <Form.Label className="mt-2">Current password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your current password"
                name="currPassword"
                value={currPassword}
                onChange={(e) => handleFormInput(e, "password")}
              />
            </Form.Group>
            <Link
              to="#"
              className="link mt-2"
              style={{ display: "inline-block" }}
            >
              Forgot password?
            </Link>
            <Row className="mt-3">
              <Col>
                <Form.Group>
                  <Form.Label>New password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your new password"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => handleFormInput(e, "password")}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Confirm password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm your new password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => handleFormInput(e, "password")}
                  />
                </Form.Group>
              </Col>
            </Row>

            <hr
              style={{ opacity: 0.15, marginTop: "25px", marginBottom: "5px" }}
            />

            <div className="d-flex justify-content-end mt-3">
              <Button variant="info" type="submit">
                Update
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Card
        border="0"
        className="d-flex justify-content-center shadow-sm"
        style={{ marginTop: "18px", marginBottom: "15px" }}
      >
        <Card.Body>
          <Card>
            <Card.Body style={{ backgroundColor: "#f7f7f9" }}>
              <Button variant="danger">Delete my account</Button>
              <span className="my-2" style={{ display: "block" }}>
                You will receive an email to confirm your decision
              </span>
              <span className="mt-2" style={{ display: "block" }}>
                Please note that all your data wil be permanently deleted
              </span>
            </Card.Body>
          </Card>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Profile;

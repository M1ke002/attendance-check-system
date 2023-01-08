import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { toast } from "react-toastify";
import { authContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";

function ChangePassword() {
  const [validated, setValidated] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [passwordInputField, setPasswordInputField] = useState({
    currPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { currPassword, newPassword, confirmPassword } = passwordInputField;

  const { changePassword } = useContext(authContext);

  const handleFormInput = (e) => {
    setPasswordInputField({
      ...passwordInputField,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setValidated(true);
    //validate
    if (currPassword === "" || newPassword === "" || confirmPassword === "") {
      console.log("can't leave empty fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      console.log("New password doesn't match");
      toast.error("New password doesn't match", {
        theme: "colored",
        autoClose: 2000,
      });
      return;
    }
    //do stuffs here
    setIsChanging(true);
    const res = await changePassword(currPassword, newPassword);
    setIsChanging(false);
    if (res.success) {
      setPasswordInputField({
        currPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success(res.message, {
        theme: "colored",
        autoClose: 2000,
      });
    } else {
      toast.error(res.message, {
        theme: "colored",
        autoClose: 2000,
      });
    }
  };

  return (
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

        <Form onSubmit={handleChangePassword} noValidate validated={validated}>
          <Form.Group>
            <Form.Label className="mt-2">Current password</Form.Label>
            <Form.Control
              type="password"
              required
              placeholder="Enter your current password"
              name="currPassword"
              value={currPassword}
              onChange={handleFormInput}
            />
            <Form.Control.Feedback type="invalid">
              This field is required!
            </Form.Control.Feedback>
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
                  required
                  placeholder="Enter your new password"
                  name="newPassword"
                  value={newPassword}
                  onChange={handleFormInput}
                />
                <Form.Control.Feedback type="invalid">
                  This field is required!
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Confirm password</Form.Label>
                <Form.Control
                  type="password"
                  required
                  placeholder="Confirm your new password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleFormInput}
                />
                <Form.Control.Feedback type="invalid">
                  This field is required!
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <hr
            style={{ opacity: 0.15, marginTop: "25px", marginBottom: "5px" }}
          />

          <div className="d-flex justify-content-end mt-3">
            <Button variant="info" type="submit" disabled={isChanging}>
              Update
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default ChangePassword;

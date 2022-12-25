import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Avatar from "@mui/material/Avatar";
import avatarImg from "../../assets/avatar.jpg";

import { Link } from "react-router-dom";
import { useState, useContext, useRef } from "react";
import { authContext } from "../../contexts/AuthContext";

function PersonalInfo() {
  const {
    authState: { user },
  } = useContext(authContext);

  const fileInput = useRef(null);

  const [editBtnText, setEditBtnText] = useState("Edit");
  const [isEditable, setIsEditable] = useState(false);
  const [infoInputField, setInfoInputField] = useState({
    username: user.username,
    email: "",
  });
  const { username, email } = infoInputField;

  const handleAddFile = (event) => {
    const file = event.target.files[0];
    console.log(file);
    // preview or upload to server
  };

  const handleFormInput = (e) => {
    setInfoInputField({
      ...infoInputField,
      [e.target.name]: e.target.value,
    });
  };

  const onCancel = () => {
    setInfoInputField({
      ...infoInputField,
      username: user.username,
      email: "",
    });
    setIsEditable(false);
    setEditBtnText("Edit");
  };

  const handleEditInfo = (e) => {
    e.preventDefault();
    if (editBtnText === "Edit") {
      setIsEditable(true);
      setEditBtnText("Save");
      return;
    }
  };

  return (
    <Card
      border="0"
      className="d-flex justify-content-center shadow-sm px-4 pb-2"
      style={{ marginTop: "18px", marginBottom: "15px" }}
    >
      <Card.Body>
        <h4
          style={{
            fontSize: "21px",
            margin: "10px 0 10px 0",
            fontWeight: "600",
            color: "rgb(62 67 73)",
          }}
        >
          Edit profile
        </h4>

        <div className="d-flex justify-content-center mt-2">
          <Avatar
            sx={{ width: 75, height: 75 }}
            style={{ border: "1px solid grey" }}
            src={avatarImg}
            alt="Avatar"
          >
            <Avatar sx={{ width: 70, height: 70 }} alt="Avatar" />
          </Avatar>
        </div>
        <p className="text-center mt-2 mb-1">
          <strong>{user.username}</strong>
        </p>
        <div className="d-flex justify-content-center mt-2">
          <div>
            <Button
              className="btn-sm me-2"
              variant="outline-info"
              onClick={() => {
                fileInput.current.click();
              }}
            >
              Upload image
            </Button>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              onChange={handleAddFile}
              style={{ display: "none" }}
            />
          </div>
          <Button className="btn-sm" variant="outline-danger">
            Remove image
          </Button>
        </div>

        <hr
          style={{ opacity: 0.15, marginTop: "20px", marginBottom: "20px" }}
        />

        <p
          style={{
            fontSize: "16px",
            margin: "10px 0 10px 0",
            fontWeight: "600",
            color: "rgb(62 67 73)",
          }}
        >
          Personal information
        </p>

        <Form onSubmit={handleEditInfo}>
          <Form.Group>
            <Form.Label className="mt-2">Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Username"
              name="username"
              value={username}
              onChange={handleFormInput}
              disabled={!isEditable}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="mt-2">Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Email"
              name="email"
              value={email}
              onChange={handleFormInput}
              disabled={!isEditable}
            />
          </Form.Group>
          <Link
            to="#"
            className="link mt-2"
            style={{ display: "inline-block" }}
          >
            Change email
          </Link>

          <hr
            style={{ opacity: 0.15, marginTop: "20px", marginBottom: "15px" }}
          />

          <div className="d-flex justify-content-end">
            <Button variant="info" type="submit">
              {editBtnText}
            </Button>
            {isEditable && (
              <Button className="ms-2" variant="danger" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default PersonalInfo;

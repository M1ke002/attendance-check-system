import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Avatar from "@mui/material/Avatar";
import ConfirmDeleteModal from "../layout/Modal/ConfirmDeleteModal";

import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useState, useContext, useRef } from "react";
import { authContext } from "../../contexts/AuthContext";
import { isValidEmail } from "../../utils/utilsFunction";

function PersonalInfo() {
  const {
    authState: { user },
    updateUserInfo,
    uploadAvatar,
    deleteAvatar,
  } = useContext(authContext);

  const fileInput = useRef(null);

  const [validated, setValidated] = useState(false);
  const [editBtnText, setEditBtnText] = useState("Edit");
  const [isSaving, setIsSaving] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [infoInputField, setInfoInputField] = useState({
    username: user.username,
    name: user.name,
    email: user.email,
  });
  const { username, name, email } = infoInputField;

  const handleAddFile = async (event) => {
    const avatar = event.target.files[0];
    if (!avatar) return;
    // console.log(avatar);
    // preview or upload to server
    const formData = new FormData();
    formData.append("avatar", avatar);
    setIsSaving(true);
    const res = await uploadAvatar(formData);
    setIsSaving(false);
    if (res.success) {
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
    // console.log(res);
  };

  const handleRemoveAvatar = async () => {
    setIsSaving(true);
    setShowConfirmDeleteModal(false);
    const res = await deleteAvatar();
    setIsSaving(false);
    if (res.success) {
      toast.success(res.message, {
        theme: "colored",
        autoClose: 2000,
      });
      //clear file input
      fileInput.current.value = "";
    } else {
      toast.error(res.message, {
        theme: "colored",
        autoClose: 2000,
      });
    }
    // console.log(res);
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
      name: user.name,
      email: user.email,
    });
    setIsEditable(false);
    setEditBtnText("Edit");
  };

  const handleEditInfo = async (e) => {
    e.preventDefault();
    if (editBtnText === "Edit") {
      setValidated(false);
      setIsEditable(true);
      setEditBtnText("Save");
      return;
    }
    //validation
    setValidated(true);
    if (username.trim() === "" || name.trim() === "" || email.trim() === "") {
      console.log("Can't leave empty field!");
      return;
    }
    //check if email is valid
    if (!isValidEmail(email)) {
      console.log("Invalid email");
      toast.error("Invalid email", {
        theme: "colored",
        autoClose: 2000,
      });
      return;
    }
    setIsSaving(true);
    const res = await updateUserInfo({ username, name, email });
    setIsSaving(false);
    if (res.success) {
      console.log("updated user info");
      toast.success(res.message, {
        theme: "colored",
        autoClose: 2000,
      });
    } else {
      console.log("err update user info");
      toast.error(res.message, {
        theme: "colored",
        autoClose: 2000,
      });
      return;
    }
    setIsEditable(false);
    setEditBtnText("Edit");
  };

  return (
    <>
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
            {user.avatar === "" ? (
              <Avatar sx={{ width: 70, height: 70 }} alt="Avatar" />
            ) : (
              <Avatar
                sx={{ width: 80, height: 80 }}
                style={{ border: "1px solid grey" }}
                src={`${user.avatar}?cb=${Date.now()}`}
                alt="Avatar"
              />
            )}
          </div>
          <p className="text-center mt-2 mb-1">
            <strong>{user.name}</strong>
          </p>
          <div className="d-flex justify-content-center mt-2">
            <div>
              <Button
                className="btn-sm me-2"
                variant="outline-info"
                onClick={() => {
                  fileInput.current.click();
                }}
                disabled={isSaving}
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
            <Button
              className="btn-sm"
              variant="outline-danger"
              onClick={() => {
                if (user.avatar) setShowConfirmDeleteModal(true);
              }}
              disabled={isSaving || !user.avatar}
            >
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

          <Form onSubmit={handleEditInfo} noValidate validated={validated}>
            <Form.Group>
              <Form.Label className="mt-2">Username</Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Username"
                name="username"
                value={username}
                onChange={handleFormInput}
                disabled={!isEditable}
              />
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label className="mt-2">Name</Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Name"
                name="name"
                value={name}
                onChange={handleFormInput}
                disabled={!isEditable}
              />
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
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
              <Button variant="info" type="submit" disabled={isSaving}>
                {editBtnText}
              </Button>
              {isEditable && (
                <Button
                  className="ms-2"
                  variant="danger"
                  onClick={onCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>
      <ConfirmDeleteModal
        showConfirmDeleteModal={showConfirmDeleteModal}
        onHide={() => {
          setShowConfirmDeleteModal(false);
        }}
        onDelete={() => {
          handleRemoveAvatar();
        }}
        onCancel={() => {
          setShowConfirmDeleteModal(false);
        }}
        message={{
          body: "Remove this avatar image?",
          footer: "Remove",
        }}
      />
    </>
  );
}

export default PersonalInfo;

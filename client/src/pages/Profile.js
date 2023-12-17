import Container from "react-bootstrap/Container";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import { useEffect, useState, useContext } from "react";
import PersonalInfo from "../components/Profile/PersonalInfo";
import ChangePassword from "../components/Profile/ChangePassword";
import ConfirmDeleteModal from "../components/layout/Modal/ConfirmDeleteModal";
import { authContext } from "../contexts/AuthContext";
import { toast } from "react-toastify";

function Profile() {
  const { deleteAccount } = useContext(authContext);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = "#f7f7f9";
    return () => {
      document.body.style.backgroundColor = "#fff";
    };
  }, []);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const res = await deleteAccount();
    setIsDeleting(false);
    if (res && !res.success) {
      console.log(res.message);
      toast.error(res.message, {
        theme: "colored",
        autoClose: 2000,
      });
    }
  };

  return (
    <>
      <Container>
        <PersonalInfo />

        <ChangePassword />

        <Card
          border="0"
          className="d-flex justify-content-center shadow-sm"
          style={{ marginTop: "18px", marginBottom: "15px" }}
        >
          <Card.Body>
            <Card>
              <Card.Body style={{ backgroundColor: "#f7f7f9" }}>
                <Button
                  variant="danger"
                  onClick={() => setShowConfirmDeleteModal(true)}
                >
                  Delete my account
                </Button>
                {/* <span className="my-2" style={{ display: "block" }}>
                You will receive an email to confirm your decision
              </span> */}
                <span className="mt-2" style={{ display: "block" }}>
                  Please note that all your data wil be permanently deleted.
                </span>
              </Card.Body>
            </Card>
          </Card.Body>
        </Card>
      </Container>
      <ConfirmDeleteModal
        showConfirmDeleteModal={showConfirmDeleteModal}
        onHide={() => {
          setShowConfirmDeleteModal(false);
        }}
        onDelete={() => {
          handleDeleteAccount();
          setShowConfirmDeleteModal(false);
        }}
        onCancel={() => {
          setShowConfirmDeleteModal(false);
        }}
        message={{
          body: isDeleting
            ? "Deleting..."
            : "Are you sure you want to delete your account?",
        }}
      />
    </>
  );
}

export default Profile;

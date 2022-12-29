import Container from "react-bootstrap/Container";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import { useEffect } from "react";
import PersonalInfo from "../components/Profile/PersonalInfo";
import ChangePassword from "../components/Profile/ChangePassword";

function Profile() {
  useEffect(() => {
    document.body.style.backgroundColor = "#f7f7f9";
    return () => {
      document.body.style.backgroundColor = "#fff";
    };
  }, []);

  return (
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

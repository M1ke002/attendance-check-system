import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import GroupIcon from "@mui/icons-material/Group";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { deepPurple, red } from "@mui/material/colors";
import avatarImg from "../../assets/avatar.jpg";

import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { authContext } from "../../contexts/AuthContext";

function NavBar() {
  const {
    authState: { user },
    logoutUser,
  } = useContext(authContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  return (
    <Navbar expand="lg" bg="primary" variant="dark" className="shadow navbar">
      <Container>
        <Navbar.Brand style={{ fontSize: "1.4rem" }}>
          <Nav.Link to="/attendance" as={Link}>
            Attendance System
          </Nav.Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link to="/attendance" as={Link}>
              <div className="d-flex">
                <TaskAltIcon />
                <span className="mx-1">Attendance</span>
              </div>
            </Nav.Link>
            <Nav.Link to="/courses" as={Link}>
              <div className="d-flex">
                <LibraryBooksIcon />
                <span className="mx-1">Courses</span>
              </div>
            </Nav.Link>
            <Nav.Link to="/students" as={Link}>
              <div className="d-flex">
                <GroupIcon />
                <span className="mx-1">Students</span>
              </div>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Nav>
          <Nav.Link className="font-weight-bolder text-white me-1" disabled>
            Welcome, {user.username}
          </Nav.Link>
          <Tooltip title="Account settings">
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              size="small"
            >
              <Avatar
                src={avatarImg}
                sx={{ width: 35, height: 35 }}
                style={{ border: "1px solid black" }}
              >
                <Avatar
                  sx={{ width: 35, height: 35, bgcolor: deepPurple[500] }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            onClick={() => setAnchorEl(null)}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
                mt: 1.5,
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <Nav.Link to="/profile" as={Link}>
              <MenuItem style={{ paddingLeft: "25px", paddingRight: "60px" }}>
                <ListItemIcon>
                  <AccountCircleIcon fontSize="small" />
                </ListItemIcon>
                <span style={{ fontSize: "15px", marginLeft: "-5px" }}>
                  Profile
                </span>
              </MenuItem>
            </Nav.Link>
            <Divider sx={{ mt: 1, mb: 1 }} />
            <MenuItem
              style={{ paddingLeft: "25px", paddingRight: "60px" }}
              onClick={() => logoutUser()}
            >
              <ListItemIcon sx={{ minWidth: 1 }}>
                <LogoutIcon fontSize="small" sx={{ color: red[500] }} />
              </ListItemIcon>
              <span
                style={{
                  color: red[500],
                  fontSize: "15px",
                  marginLeft: "-5px",
                }}
              >
                Logout
              </span>
            </MenuItem>
          </Menu>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavBar;

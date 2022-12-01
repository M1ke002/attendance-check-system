import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

import {useContext} from 'react';
import {Link} from 'react-router-dom';
import {authContext} from '../../contexts/AuthContext';

function NavBar() {
    const {authState: {user}, logoutUser} = useContext(authContext);
    
    return ( 
        <Navbar expand='lg' bg='primary' variant='dark' className='shadow navbar'>
            <Container>
                <Navbar.Brand style={{fontSize: '1.4rem'}}>
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
                                <LibraryBooksIcon/>
                                <span className="mx-1">Courses</span>
                            </div>
                        </Nav.Link>
                        <Nav.Link to="/profile" as={Link}>
                            <div className="d-flex">
                                <AccountCircleIcon/>
                                <span className="mx-1">Profile</span>
                            </div>
                        </Nav.Link>
                    </Nav>

                    <Nav>
                        <Nav.Link className="font-weight-bolder text-white me-3" disabled>
                            Welcome, {user.username}
                        </Nav.Link>
                        <Button
                            variant="success"
                            className="font-weight-bolder text-white"
                            onClick={() => logoutUser()}
                        >
                            <LogoutIcon/>
                            <span className="ms-1">Logout</span>
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
     );
}

export default NavBar;
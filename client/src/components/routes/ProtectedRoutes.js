import {Outlet, Navigate} from 'react-router-dom';
import {useContext} from 'react';
import {authContext} from '../../contexts/AuthContext';
import NavBar from '../layout/NavBar';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function ProtectedRoutes() {
    const {authState} = useContext(authContext);
    const {isAuthenticated, isAuthLoading} = authState;
    if (isAuthLoading) {
        return (
            <Backdrop
                sx={{
                    color: '#ccc',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    backgroundColor: 'rgba(166, 174, 176, 0.1)'
                }}
                open={isAuthLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            );
    } else if (isAuthenticated) {
        return (
            <>
                <NavBar/>
                <Outlet/>
            </>
        );
    } else {
        return <Navigate to="/login"/>
    }
}

export default ProtectedRoutes;
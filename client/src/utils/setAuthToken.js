import axios from "axios";

const setTokenHeader = token => {
    if (!token) {
        delete axios.defaults.headers.common["Authorization"];
        return false;
    } else {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        return true;
    }
}

export default setTokenHeader;
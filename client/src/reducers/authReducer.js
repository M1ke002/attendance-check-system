import { SET_AUTH } from "./constants";

const authReducer = (state, action) => {
    const {type, payload} = action;
    const {isAuthenticated, user} = payload;
    switch(type) {
        case SET_AUTH:
            return { 
                ...state,
                isAuthLoading: false,
                isAuthenticated,
                user,
            }
        default:
            return state
    }
}

export default authReducer;
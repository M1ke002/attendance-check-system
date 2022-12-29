import { SET_AUTH, SET_USER_INFO } from "./constants";

const authReducer = (state, action) => {
  const { type, payload } = action;
  const { isAuthenticated, user } = payload;
  switch (type) {
    case SET_AUTH:
      return {
        ...state,
        isAuthLoading: false,
        isAuthenticated,
        user,
      };
    case SET_USER_INFO:
      return {
        ...state,
        user,
      };
    default:
      return state;
  }
};

export default authReducer;

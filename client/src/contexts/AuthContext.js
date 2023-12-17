import { createContext, useReducer, useEffect } from "react";
import axios from "axios";
import { apiUrl, ACCESS_TOKEN_NAME } from "./constants";
import setTokenHeader from "../utils/setAuthToken";
import authReducer from "../reducers/authReducer";
import { SET_AUTH, SET_USER_INFO } from "../reducers/constants";

export const authContext = createContext();

function AuthContext({ children }) {
  const [authState, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    isAuthLoading: true,
    user: null,
  });

  useEffect(() => {
    const authUser = async () => {
      const isTokenSet = setTokenHeader(
        localStorage.getItem(ACCESS_TOKEN_NAME)
      );

      if (!isTokenSet) {
        dispatch({
          type: SET_AUTH,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      } else {
        try {
          //check if token found is valid
          const res = await axios.get(`${apiUrl}/auth`);
          if (res.data.success) {
            dispatch({
              type: SET_AUTH,
              payload: {
                isAuthenticated: true,
                user: res.data.user,
              },
            });
          } else {
            console.log("sth wrong authUser()");
          }
        } catch (error) {
          if (error.response) console.log(error.response.data);
          else console.log(error.message);

          //invalid token here
          localStorage.removeItem(ACCESS_TOKEN_NAME);
          setTokenHeader(null);
          dispatch({
            type: SET_AUTH,
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      }
    };
    authUser();
  }, []);

  const loginUser = async (userForm) => {
    try {
      const res = await axios.post(`${apiUrl}/auth/login`, userForm);
      if (res.data.success) {
        localStorage.setItem(ACCESS_TOKEN_NAME, res.data.accessToken);
        setTokenHeader(res.data.accessToken);
        dispatch({
          type: "SET_AUTH",
          payload: {
            isAuthenticated: true,
            user: res.data.user,
          },
        });
      } else {
        console.log("sth wrong loginUser()");
      }
      return res;
    } catch (error) {
      if (error.response) return error.response; //error we sent on purpose
      else return error.message;
    }
  };

  const registerUser = async (userForm) => {
    try {
      const res = await axios.post(`${apiUrl}/auth/register`, userForm);
      if (res.data.success) {
        localStorage.setItem(ACCESS_TOKEN_NAME, res.data.accessToken);
        setTokenHeader(res.data.accessToken);
        dispatch({
          type: "SET_AUTH",
          payload: {
            isAuthenticated: true,
            user: res.data.user,
          },
        });
      } else {
        console.log("sth wrong registerUser()");
      }
      return res;
    } catch (error) {
      if (error.response) return error.response; //error we sent on purpose
      else return error.message;
    }
  };

  const logoutUser = () => {
    localStorage.removeItem(ACCESS_TOKEN_NAME);
    setTokenHeader(null);
    dispatch({
      type: SET_AUTH,
      payload: {
        isAuthenticated: false,
        user: null,
      },
    });
  };

  const changePassword = async (currPassword, newPassword) => {
    try {
      const res = await axios.put(`${apiUrl}/auth/change-password`, {
        currPassword,
        newPassword,
      });
      return res.data;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const res = await axios.post(`${apiUrl}/auth/forgot-password`, { email });
      return res.data;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const resetPassword = async (newPassword, token) => {
    try {
      const res = await axios.post(`${apiUrl}/auth/reset-password`, {
        newPassword,
        token,
      });
      return res.data;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const deleteAccount = async () => {
    try {
      const res = await axios.delete(`${apiUrl}/profile`);
      if (res.data.success) {
        logoutUser();
      } else {
        return res.data;
      }
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const updateUserInfo = async (userInfo) => {
    try {
      const res = await axios.put(`${apiUrl}/profile`, userInfo);
      if (res.data.success) {
        dispatch({
          type: SET_USER_INFO,
          payload: {
            user: res.data.user,
          },
        });
      }
      return res.data;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const uploadAvatar = async (formData) => {
    try {
      const res = await axios.post(
        `${apiUrl}/profile/upload-avatar`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (res.data.success) {
        dispatch({
          type: SET_USER_INFO,
          payload: {
            user: {
              ...authState.user,
              avatar: res.data.avatar,
            },
          },
        });
      }
      return res.data;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const deleteAvatar = async () => {
    try {
      const res = await axios.delete(`${apiUrl}/profile/delete-avatar`);
      if (res.data.success) {
        dispatch({
          type: SET_USER_INFO,
          payload: {
            user: {
              ...authState.user,
              avatar: res.data.avatar,
            },
          },
        });
      }
      return res.data;
    } catch (error) {
      if (error.response) return error.response.data;
      else return { success: false, message: error.message };
    }
  };

  const authData = {
    authState,
    loginUser,
    registerUser,
    logoutUser,
    deleteAccount,
    updateUserInfo,
    changePassword,
    forgotPassword,
    resetPassword,
    uploadAvatar,
    deleteAvatar,
  };

  return (
    <authContext.Provider value={authData}>{children}</authContext.Provider>
  );
}

export default AuthContext;

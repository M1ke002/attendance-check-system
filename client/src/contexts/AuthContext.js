import { createContext, useReducer, useEffect } from "react";
import axios from "axios";
import { apiUrl, ACCESS_TOKEN_NAME } from "./constants";
import setTokenHeader from "../utils/setAuthToken";
import authReducer from "../reducers/authReducer";
import { SET_AUTH } from "../reducers/constants";

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

  const authData = {
    authState,
    loginUser,
    registerUser,
    logoutUser,
  };

  return (
    <authContext.Provider value={authData}>{children}</authContext.Provider>
  );
}

export default AuthContext;

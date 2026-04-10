import { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  AUTH_ERROR: 'AUTH_ERROR',
};

// Initial state
const initialState = {
  user: JSON.parse(localStorage.getItem('user')),
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

// Reducer
function authReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: true, error: null };
    case ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case ACTIONS.AUTH_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (state.token) {
        try {
          const { data } = await api.get('/auth/me');
          dispatch({
            type: ACTIONS.LOGIN_SUCCESS,
            payload: { user: data.user, token: state.token },
          });
        } catch {
          logout();
        }
      }
    };
    verifyToken();
  }, []);

  const login = async (email, password) => {
    dispatch({ type: ACTIONS.SET_LOADING });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      dispatch({
        type: ACTIONS.LOGIN_SUCCESS,
        payload: { user: data.user, token: data.token },
      });
      return { success: true, message: data.message };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Login failed. Please try again.';
      dispatch({ type: ACTIONS.AUTH_ERROR, payload: message });
      return { success: false, message };
    }
  };

  const register = async (name, email, password, role) => {
    dispatch({ type: ACTIONS.SET_LOADING });
    try {
      const { data } = await api.post('/auth/register', {
        name,
        email,
        password,
        role,
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      dispatch({
        type: ACTIONS.LOGIN_SUCCESS,
        payload: { user: data.user, token: data.token },
      });
      return { success: true, message: data.message };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Registration failed. Please try again.';
      dispatch({ type: ACTIONS.AUTH_ERROR, payload: message });
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: ACTIONS.LOGOUT });
  };

  const clearError = () => {
    dispatch({ type: ACTIONS.AUTH_ERROR, payload: null });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

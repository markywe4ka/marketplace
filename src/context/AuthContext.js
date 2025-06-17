import React, { createContext, useReducer, useContext } from 'react';

// Начальное состояние авторизации
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

// Reducer для обработки действий с авторизацией
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    
    case 'LOGOUT':
      return initialState;
    
    default:
      return state;
  }
};

// Создание контекста
const AuthContext = createContext();

// Провайдер контекста
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  // Действия с авторизацией
  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // В будущем здесь будет API запрос
      // Имитация запроса к серверу
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Тестовые данные пользователя
      const userData = {
        id: '1',
        name: 'Тестовый Пользователь',
        email: email
      };
      
      // Сохраняем токен в localStorage
      localStorage.setItem('token', 'test-jwt-token');
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: userData
      });
      
      return true;
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: 'Неверный логин или пароль'
      });
      
      return false;
    }
  };
  
  const register = async (name, email, password) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // В будущем здесь будет API запрос
      // Имитация запроса к серверу
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Регистрация обычно не авторизует пользователя автоматически
      dispatch({ type: 'LOGIN_SUCCESS', payload: null });
      return true;
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: 'Ошибка при регистрации'
      });
      return false;
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };
  
  return (
    <AuthContext.Provider value={{
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      loading: state.loading,
      error: state.error,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Хук для использования контекста авторизации
export const useAuth = () => {
  return useContext(AuthContext);
};
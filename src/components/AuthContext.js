import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

// Создаем контекст авторизации
export const AuthContext = createContext();

// Кастомный хук для использования контекста авторизации
export const useAuth = () => useContext(AuthContext);

// Провайдер контекста авторизации
export const AuthProvider = ({ children }) => {
  // Состояние пользователя и токена
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Функция входа
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };
  
  // Функция выхода
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Опционально: отправка запроса на выход
    try {
      api.auth.logout();
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
    }
  };
  
  // Проверка авторизации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        
        // Получаем токен из localStorage
        const savedToken = localStorage.getItem('token');
        
        if (savedToken) {
          try {
            // Проверяем валидность токена
            const userData = await api.auth.getCurrentUser();
            
            // Обновляем состояние
            setUser(userData);
            setToken(savedToken);
          } catch (apiError) {
            // В случае ошибки (недействительный токен) очищаем данные
            console.error('Ошибка при проверке токена:', apiError);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } else {
          // Если токена нет, пытаемся получить данные пользователя из localStorage
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Ошибка при проверке авторизации:', err);
        setError('Не удалось проверить авторизацию');
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Обновление пользовательских данных
  const updateUser = async (userData) => {
    try {
      // Отправляем запрос на обновление данных
      const updatedUser = await api.auth.updateProfile(userData);
      
      // Обновляем локальное состояние
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      throw error;
    }
  };
  
  // Проверка, авторизован ли пользователь
  const isAuthenticated = () => !!user;
  
  // Значение контекста
  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    updateUser,
    isAuthenticated
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const { login, register, error: authError, loading: authLoading, isAuthenticated } = useAuth();
  
  const [activeTab, setActiveTab] = useState('login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Если пользователь уже авторизован, перенаправляем на главную страницу
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
    setError('');
  };

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Проверка полей
    if (!loginForm.email) {
      setError('Пожалуйста, введите email');
      return;
    }
    
    if (!validateEmail(loginForm.email)) {
      setError('Пожалуйста, введите корректный email');
      return;
    }
    
    if (!loginForm.password) {
      setError('Пожалуйста, введите пароль');
      return;
    }

    setLoading(true);
    
    try {
      // Используем функцию login из контекста авторизации
      const success = await login(loginForm.email, loginForm.password);
      
      if (success) {
        setSuccess('Вход выполнен успешно!');
        // Перенаправление происходит в useEffect, когда isAuthenticated становится true
      }
    } catch (error) {
      setError('Ошибка при входе. Пожалуйста, проверьте ваши данные.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Проверка полей (ваш код без изменений)
    if (!registerForm.name) {
      setError('Пожалуйста, введите имя');
      return;
    }
    
    if (!registerForm.email) {
      setError('Пожалуйста, введите email');
      return;
    }
    
    if (!validateEmail(registerForm.email)) {
      setError('Пожалуйста, введите корректный email');
      return;
    }
    
    if (!registerForm.password) {
      setError('Пожалуйста, введите пароль');
      return;
    }
    
    if (registerForm.password.length < 6) {
      setError('Пароль должен содержать не менее 6 символов');
      return;
    }
    
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    
    if (!agreeTerms) {
      setError('Необходимо согласиться с условиями использования');
      return;
    }

    setLoading(true);
    
    try {
      // Используем функцию register из контекста авторизации
      const success = await register(
        registerForm.name,
        registerForm.email,
        registerForm.password
      );
      
      if (success) {
        setSuccess('Регистрация выполнена успешно! Теперь вы можете войти в систему.');
        
        // Очищаем форму регистрации
        setRegisterForm({ 
          name: '', 
          email: '', 
          password: '', 
          confirmPassword: '' 
        });
        
        // Переключаемся на вкладку входа
        setActiveTab('login');
      }
    } catch (error) {
      setError('Ошибка при регистрации. Пожалуйста, попробуйте позже.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Определяем, используем ли мы состояние загрузки из компонента или из контекста
  const isLoading = loading || authLoading;
  // Комбинируем ошибки из компонента и контекста
  const displayError = error || authError;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-white p-0">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item w-50">
                  <button 
                    className={`nav-link w-100 ${activeTab === 'login' ? 'active' : ''}`}
                    onClick={() => setActiveTab('login')}
                    disabled={isLoading}
                  >
                    Вход
                  </button>
                </li>
                <li className="nav-item w-50">
                  <button 
                    className={`nav-link w-100 ${activeTab === 'register' ? 'active' : ''}`}
                    onClick={() => setActiveTab('register')}
                    disabled={isLoading}
                  >
                    Регистрация
                  </button>
                </li>
              </ul>
            </div>
            
            <div className="card-body p-4">
              {displayError && <div className="alert alert-danger">{displayError}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              {activeTab === 'login' ? (
                <form onSubmit={handleLoginSubmit}>
                  <h3 className="text-center mb-4">Вход в аккаунт</h3>
                  
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={loginForm.email}
                      onChange={handleLoginChange}
                      placeholder="Введите ваш email"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Пароль</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      placeholder="Введите ваш пароль"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="mb-3 form-check">
                    <input 
                      type="checkbox" 
                      className="form-check-input" 
                      id="rememberMe" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={isLoading}
                    />
                    <label className="form-check-label" htmlFor="rememberMe">Запомнить меня</label>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Вход...
                      </>
                    ) : 'Войти'}
                  </button>
                  
                  <div className="text-center mt-3">
                    <a 
                      href="#forgot" 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        if (!isLoading) alert('Функция восстановления пароля будет доступна позже'); 
                      }}
                      className={isLoading ? 'text-muted' : ''}
                    >
                      Забыли пароль?
                    </a>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit}>
                  <h3 className="text-center mb-4">Создание аккаунта</h3>
                  
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Имя</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={registerForm.name}
                      onChange={handleRegisterChange}
                      placeholder="Введите ваше имя"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="registerEmail" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="registerEmail"
                      name="email"
                      value={registerForm.email}
                      onChange={handleRegisterChange}
                      placeholder="Введите ваш email"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="registerPassword" className="form-label">Пароль</label>
                    <input
                      type="password"
                      className="form-control"
                      id="registerPassword"
                      name="password"
                      value={registerForm.password}
                      onChange={handleRegisterChange}
                      placeholder="Введите пароль"
                      disabled={isLoading}
                    />
                    <small className="form-text text-muted">Пароль должен содержать не менее 6 символов</small>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Подтверждение пароля</label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={registerForm.confirmPassword}
                      onChange={handleRegisterChange}
                      placeholder="Подтвердите пароль"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="mb-3 form-check">
                    <input 
                      type="checkbox" 
                      className="form-check-input" 
                      id="agreeTerms" 
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      disabled={isLoading}
                    />
                    <label className="form-check-label" htmlFor="agreeTerms">
                      Я согласен с <a href="#terms" onClick={(e) => e.preventDefault()}>условиями использования</a>
                    </label>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Регистрация...
                      </>
                    ) : 'Зарегистрироваться'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
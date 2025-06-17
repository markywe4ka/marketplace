import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import '../styles/AuthPages.css';

const RegisterPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Состояние формы
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  
  // Состояние ошибок валидации
  const [errors, setErrors] = useState({});
  
  // Состояние загрузки
  const [isLoading, setIsLoading] = useState(false);
  
  // Состояние отображения пароля
  const [showPassword, setShowPassword] = useState(false);
  
  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Сбрасываем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Проверяем соответствие паролей при изменении
    if (name === 'password' || name === 'confirmPassword') {
      if (name === 'password' && formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Пароли не совпадают' }));
      } else if (name === 'confirmPassword' && value !== formData.password) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Пароли не совпадают' }));
      } else if (name === 'confirmPassword' && value === formData.password) {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }
  };
  
  // Валидация формы
  const validateForm = () => {
    const newErrors = {};
    
    // Проверка имени
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Имя обязательно';
    }
    
    // Проверка фамилии
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Фамилия обязательна';
    }
    
    // Проверка email
    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный формат email';
    }
    
    // Проверка пароля
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }
    
    // Проверка подтверждения пароля
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Подтвердите пароль';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    
    // Проверка согласия с условиями
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Необходимо согласиться с условиями';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Проверяем валидность формы
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Подготовка данных для API
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      };
      
      // Попытка регистрации через API
      try {
        const response = await api.auth.register(userData);
        
        // Сохраняем пользователя в контексте авторизации
        login(response.user, response.token);
        
        // Перенаправляем пользователя на главную
        navigate('/');
      } catch (apiError) {
        console.error('Ошибка API при регистрации:', apiError);
        
        // Обрабатываем разные ошибки
        if (apiError.response) {
          const { status, data } = apiError.response;
          
          if (status === 409) {
            setErrors({ email: 'Пользователь с таким email уже существует' });
          } else if (data && data.message) {
            setErrors({ general: data.message });
          } else {
            setErrors({ general: 'Произошла ошибка при регистрации' });
          }
        } else {
          setErrors({ general: 'Сервер недоступен. Пожалуйста, попробуйте позже' });
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      setErrors({ general: 'Произошла непредвиденная ошибка' });
      setIsLoading(false);
    }
  };
  
  return (
    <div className="auth-page register-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-header">
            <h1>Регистрация</h1>
            <p>Создайте аккаунт, чтобы совершать покупки и отслеживать заказы.</p>
          </div>
          
          {errors.general && (
            <div className="auth-error general">
              {errors.general}
            </div>
          )}
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Имя</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Введите ваше имя"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? 'error' : ''}
                  autoComplete="given-name"
                />
                {errors.firstName && <div className="error-message">{errors.firstName}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Фамилия</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Введите вашу фамилию"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? 'error' : ''}
                  autoComplete="family-name"
                />
                {errors.lastName && <div className="error-message">{errors.lastName}</div>}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Введите ваш email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                autoComplete="email"
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Минимум 6 символов"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Подтверждение пароля</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Повторите пароль"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
                autoComplete="new-password"
              />
              {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
            </div>
            
            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className={errors.agreeTerms ? 'error' : ''}
              />
              <label htmlFor="agreeTerms">
                Я согласен с <Link to="/terms">Условиями использования</Link> и <Link to="/privacy">Политикой конфиденциальности</Link>
              </label>
              {errors.agreeTerms && <div className="error-message">{errors.agreeTerms}</div>}
            </div>
            
            <button
              type="submit"
              className="auth-button"
              disabled={isLoading}
            >
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>
          
          <div className="auth-separator">
            <span>или</span>
          </div>
          
          <div className="social-auth">
            <button className="social-button google">
              <img src="/icons/google.svg" alt="Google" />
              Регистрация через Google
            </button>
            <button className="social-button facebook">
              <img src="/icons/facebook.svg" alt="Facebook" />
              Регистрация через Facebook
            </button>
          </div>
          
          <div className="auth-footer">
            <p>
              Уже есть аккаунт? <Link to="/login">Войти</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
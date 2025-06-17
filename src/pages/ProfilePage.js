import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  
  // Состояние для отображения разных вкладок в профиле
  const [activeTab, setActiveTab] = useState('profile');
  
  // Состояние для редактирования профиля
  const [editMode, setEditMode] = useState(false);
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthday: ''
  });
  const [errors, setErrors] = useState({});
  
  // Состояние для истории заказов
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  
  // Состояние для избранных товаров
  const [wishlist, setWishlist] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [wishlistError, setWishlistError] = useState(null);
  
  // Состояние для адресов доставки
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [addressesError, setAddressesError] = useState(null);
  
  // Инициализация формы данными пользователя
  useEffect(() => {
    if (user) {
      setUserForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        birthday: user.birthday || ''
      });
    }
  }, [user]);
  
  // Загрузка истории заказов
  useEffect(() => {
    if (activeTab === 'orders') {
      const fetchOrders = async () => {
        try {
          setLoadingOrders(true);
          
          // Получаем заказы из API
          try {
            const ordersData = await api.orders.getUserOrders();
            setOrders(ordersData);
          } catch (apiError) {
            console.error('Ошибка API при получении заказов:', apiError);
            setOrdersError('Не удалось загрузить историю заказов');
          }
          
          setLoadingOrders(false);
        } catch (error) {
          console.error('Ошибка при загрузке заказов:', error);
          setOrdersError('Произошла ошибка при загрузке истории заказов');
          setLoadingOrders(false);
        }
      };
      
      fetchOrders();
    }
  }, [activeTab]);
  
  // Загрузка избранных товаров
  useEffect(() => {
    if (activeTab === 'wishlist') {
      const fetchWishlist = async () => {
        try {
          setLoadingWishlist(true);
          
          // Получаем избранные товары из API
          try {
            const wishlistData = await api.wishlist.getWishlist();
            setWishlist(wishlistData);
          } catch (apiError) {
            console.error('Ошибка API при получении избранного:', apiError);
            setWishlistError('Не удалось загрузить избранные товары');
          }
          
          setLoadingWishlist(false);
        } catch (error) {
          console.error('Ошибка при загрузке избранного:', error);
          setWishlistError('Произошла ошибка при загрузке избранных товаров');
          setLoadingWishlist(false);
        }
      };
      
      fetchWishlist();
    }
  }, [activeTab]);
  
  // Загрузка адресов доставки
  useEffect(() => {
    if (activeTab === 'addresses') {
      const fetchAddresses = async () => {
        try {
          setLoadingAddresses(true);
          
          // Получаем адреса доставки из API
          try {
            const addressesData = await api.user.getAddresses();
            setAddresses(addressesData);
          } catch (apiError) {
            console.error('Ошибка API при получении адресов:', apiError);
            setAddressesError('Не удалось загрузить адреса доставки');
          }
          
          setLoadingAddresses(false);
        } catch (error) {
          console.error('Ошибка при загрузке адресов:', error);
          setAddressesError('Произошла ошибка при загрузке адресов доставки');
          setLoadingAddresses(false);
        }
      };
      
      fetchAddresses();
    }
  }, [activeTab]);
  
  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserForm(prev => ({ ...prev, [name]: value }));
    
    // Сбрасываем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Валидация формы
  const validateForm = () => {
    const newErrors = {};
    
    // Проверка имени
    if (!userForm.firstName.trim()) {
      newErrors.firstName = 'Имя обязательно';
    }
    
    // Проверка фамилии
    if (!userForm.lastName.trim()) {
      newErrors.lastName = 'Фамилия обязательна';
    }
    
    // Проверка email
    if (!userForm.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(userForm.email)) {
      newErrors.email = 'Некорректный формат email';
    }
    
    // Проверка телефона (если заполнен)
    if (userForm.phone && !/^[+]?[0-9]{10,15}$/.test(userForm.phone)) {
      newErrors.phone = 'Некорректный формат телефона';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Обработчик сохранения изменений
  const handleSaveProfile = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      // Отправляем обновленные данные
      await updateUser(userForm);
      
      // Выходим из режима редактирования
      setEditMode(false);
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      setErrors({ general: 'Произошла ошибка при обновлении профиля' });
    }
  };
  
  // Обработчик удаления товара из избранного
  const handleRemoveFromWishlist = async (productId) => {
    try {
      // Удаляем товар из избранного через API
      await api.wishlist.removeFromWishlist(productId);
      
      // Обновляем локальный список избранного
      setWishlist(prev => prev.filter(item => item._id !== productId));
    } catch (error) {
      console.error('Ошибка при удалении из избранного:', error);
      alert('Произошла ошибка при удалении товара из избранного');
    }
  };
  
  // Отображение истории заказов
  const renderOrdersTab = () => {
    if (loadingOrders) {
      return (
        <div className="tab-loading">
          <div className="loading-spinner"></div>
          <p>Загрузка заказов...</p>
        </div>
      );
    }
    
    if (ordersError) {
      return (
        <div className="tab-error">
          <p>{ordersError}</p>
          <button onClick={() => setActiveTab('orders')}>Попробовать снова</button>
        </div>
      );
    }
    
    if (orders.length === 0) {
      return (
        <div className="empty-tab">
          <div className="empty-icon">📦</div>
          <h3>У вас еще нет заказов</h3>
          <p>После оформления заказов вы сможете отслеживать их статус здесь</p>
          <Link to="/" className="action-btn">Перейти к покупкам</Link>
        </div>
      );
    }
    
    return (
      <div className="orders-list">
        {orders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div className="order-number">Заказ №{order.orderNumber}</div>
              <div className="order-date">{new Date(order.createdAt).toLocaleDateString('ru-RU')}</div>
              <div className={`order-status ${order.status}`}>{getOrderStatusText(order.status)}</div>
            </div>
            
            <div className="order-items">
              {order.items.slice(0, 3).map(item => (
                <div key={item.productId} className="order-item">
                  <div className="item-image">
                    <img src={item.image || '/placeholder.jpg'} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <div className="item-name">{item.name}</div>
                    <div className="item-meta">
                      {item.color && <span className="item-color">Цвет: {item.color}</span>}
                      {item.size && <span className="item-size">Размер: {item.size}</span>}
                      <span className="item-quantity">Кол-во: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="item-price">{formatPrice(item.price * item.quantity)}</div>
                </div>
              ))}
              
              {order.items.length > 3 && (
                <div className="more-items">
                  + еще {order.items.length - 3} товара
                </div>
              )}
            </div>
            
            <div className="order-footer">
              <div className="order-total">
                <span>Итого:</span>
                <span className="total-price">{formatPrice(order.totalAmount)}</span>
              </div>
              
              <Link to={`/order/${order._id}`} className="view-order-btn">
                Подробнее
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Отображение избранных товаров
  const renderWishlistTab = () => {
    if (loadingWishlist) {
      return (
        <div className="tab-loading">
          <div className="loading-spinner"></div>
          <p>Загрузка избранного...</p>
        </div>
      );
    }
    
    if (wishlistError) {
      return (
        <div className="tab-error">
          <p>{wishlistError}</p>
          <button onClick={() => setActiveTab('wishlist')}>Попробовать снова</button>
        </div>
      );
    }
    
    if (wishlist.length === 0) {
      return (
        <div className="empty-tab">
          <div className="empty-icon">♡</div>
          <h3>Ваш список избранного пуст</h3>
          <p>Добавляйте понравившиеся товары в избранное, чтобы быстро находить их позже</p>
          <Link to="/" className="action-btn">Перейти к покупкам</Link>
        </div>
      );
    }
    
    return (
      <div className="wishlist-grid">
        {wishlist.map(product => (
          <div key={product._id} className="wishlist-item">
            <button 
              className="remove-wishlist" 
              onClick={() => handleRemoveFromWishlist(product._id)}
            >
              ✖
            </button>
            
            <Link to={`/product/${product._id}`} className="wishlist-link">
              <div className="wishlist-image">
                <img src={product.images[0] || '/placeholder.jpg'} alt={product.name} />
              </div>
              
              <div className="wishlist-info">
                <h3 className="wishlist-name">{product.name}</h3>
                <div className="wishlist-price">
                  {product.originalPrice && (
                    <span className="original-price">{formatPrice(product.originalPrice)}</span>
                  )}
                  <span className="current-price">{formatPrice(product.price)}</span>
                </div>
              </div>
            </Link>
            
            <button 
              className="add-to-cart-btn"
              onClick={() => handleAddToCart(product._id)}
            >
              В корзину
            </button>
          </div>
        ))}
      </div>
    );
  };
  
  // Отображение адресов доставки
  const renderAddressesTab = () => {
    if (loadingAddresses) {
      return (
        <div className="tab-loading">
          <div className="loading-spinner"></div>
          <p>Загрузка адресов...</p>
        </div>
      );
    }
    
    if (addressesError) {
      return (
        <div className="tab-error">
          <p>{addressesError}</p>
          <button onClick={() => setActiveTab('addresses')}>Попробовать снова</button>
        </div>
      );
    }
    
    if (addresses.length === 0) {
      return (
        <div className="empty-tab">
          <div className="empty-icon">📍</div>
          <h3>У вас еще нет сохраненных адресов</h3>
          <p>Добавьте адрес доставки для быстрого оформления заказов</p>
          <button className="action-btn" onClick={() => navigate('/profile/add-address')}>
            Добавить адрес
          </button>
        </div>
      );
    }
    
    return (
      <div className="addresses-list">
        {addresses.map(address => (
          <div key={address._id} className="address-card">
            {address.isDefault && <div className="default-badge">По умолчанию</div>}
            
            <div className="address-name">{address.name}</div>
            
            <div className="address-details">
              <div className="address-line">{address.street}</div>
              <div className="address-line">
                {address.city}, {address.region}, {address.postalCode}
              </div>
              <div className="address-line">{address.country}</div>
              {address.phone && <div className="address-phone">{address.phone}</div>}
            </div>
            
            <div className="address-actions">
              <button 
                className="edit-address-btn"
                onClick={() => navigate(`/profile/edit-address/${address._id}`)}
              >
                Редактировать
              </button>
              
              {!address.isDefault && (
                <button 
                  className="set-default-btn"
                  onClick={() => handleSetDefaultAddress(address._id)}
                >
                  Сделать основным
                </button>
              )}
              
              <button 
                className="delete-address-btn"
                onClick={() => handleDeleteAddress(address._id)}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
        
        <button 
          className="add-address-btn"
          onClick={() => navigate('/profile/add-address')}
        >
          + Добавить новый адрес
        </button>
      </div>
    );
  };
  
  // Вспомогательные функции
  
  // Форматирование цены
  const formatPrice = (price) => {
    return `${price.toLocaleString('ru-RU')} ₽`;
  };
  
  // Получение текстового статуса заказа
  const getOrderStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Ожидает обработки';
      case 'processing':
        return 'Обрабатывается';
      case 'shipped':
        return 'Отправлен';
      case 'delivered':
        return 'Доставлен';
      case 'cancelled':
        return 'Отменен';
      default:
        return 'Неизвестный статус';
    }
  };
  
  // Обработчик установки адреса по умолчанию
  const handleSetDefaultAddress = async (addressId) => {
    try {
      await api.user.setDefaultAddress(addressId);
      
      // Обновляем локальный список адресов
      setAddresses(prev => 
        prev.map(address => ({
          ...address,
          isDefault: address._id === addressId
        }))
      );
    } catch (error) {
      console.error('Ошибка при установке адреса по умолчанию:', error);
      alert('Произошла ошибка при установке адреса по умолчанию');
    }
  };
  
  // Обработчик удаления адреса
  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот адрес?')) {
      try {
        await api.user.deleteAddress(addressId);
        
        // Обновляем локальный список адресов
        setAddresses(prev => prev.filter(address => address._id !== addressId));
      } catch (error) {
        console.error('Ошибка при удалении адреса:', error);
        alert('Произошла ошибка при удалении адреса');
      }
    }
  };
  
  // Обработчик добавления товара в корзину
  const handleAddToCart = async (productId) => {
    try {
      await api.cart.addToCart(productId, 1);
      alert('Товар добавлен в корзину');
    } catch (error) {
      console.error('Ошибка при добавлении товара в корзину:', error);
      alert('Произошла ошибка при добавлении товара в корзину');
    }
  };
  
  // Выход из учетной записи
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  // Если пользователь не найден (это не должно произойти из-за ProtectedRoute)
  if (!user) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="error-message">
            <p>Пользователь не найден. Пожалуйста, войдите в систему.</p>
            <Link to="/login" className="action-btn">Войти</Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>Личный кабинет</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Выйти
          </button>
        </div>
        
        <div className="profile-container">
          {/* Боковое меню */}
          <div className="profile-sidebar">
            <div className="user-info">
              <div className="user-avatar">
                {user.firstName && user.lastName 
                  ? `${user.firstName[0]}${user.lastName[0]}`
                  : user.email[0].toUpperCase()}
              </div>
              <div className="user-name">
                {user.firstName && user.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user.email}
              </div>
            </div>
            
            <div className="profile-menu">
              <button 
                className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <span className="menu-icon">👤</span>
                <span className="menu-text">Профиль</span>
              </button>
              
              <button 
                className={`menu-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <span className="menu-icon">📦</span>
                <span className="menu-text">Заказы</span>
              </button>
              
              <button 
                className={`menu-item ${activeTab === 'wishlist' ? 'active' : ''}`}
                onClick={() => setActiveTab('wishlist')}
              >
                <span className="menu-icon">♡</span>
                <span className="menu-text">Избранное</span>
              </button>
              
              <button 
                className={`menu-item ${activeTab === 'addresses' ? 'active' : ''}`}
                onClick={() => setActiveTab('addresses')}
              >
                <span className="menu-icon">📍</span>
                <span className="menu-text">Адреса доставки</span>
              </button>
              
              <button 
                className={`menu-item ${activeTab === 'password' ? 'active' : ''}`}
                onClick={() => setActiveTab('password')}
              >
                <span className="menu-icon">🔒</span>
                <span className="menu-text">Сменить пароль</span>
              </button>
            </div>
          </div>
          
          {/* Содержимое вкладок */}
          <div className="profile-content">
            {/* Профиль */}
            {activeTab === 'profile' && (
              <div className="tab-content profile-tab">
                <div className="tab-header">
                  <h2>Мои данные</h2>
                  {!editMode && (
                    <button 
                      className="edit-profile-btn"
                      onClick={() => setEditMode(true)}
                    >
                      Редактировать
                    </button>
                  )}
                </div>
                
                {errors.general && (
                  <div className="profile-error">
                    {errors.general}
                  </div>
                )}
                
                {editMode ? (
                  // Форма редактирования
                  <form className="profile-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="firstName">Имя</label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={userForm.firstName}
                          onChange={handleChange}
                          className={errors.firstName ? 'error' : ''}
                        />
                        {errors.firstName && <div className="error-message">{errors.firstName}</div>}
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="lastName">Фамилия</label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={userForm.lastName}
                          onChange={handleChange}
                          className={errors.lastName ? 'error' : ''}
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
                        value={userForm.email}
                        onChange={handleChange}
                        className={errors.email ? 'error' : ''}
                        disabled // Email обычно не меняется
                      />
                      {errors.email && <div className="error-message">{errors.email}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="phone">Телефон</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={userForm.phone}
                        onChange={handleChange}
                        className={errors.phone ? 'error' : ''}
                        placeholder="+7XXXXXXXXXX"
                      />
                      {errors.phone && <div className="error-message">{errors.phone}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="birthday">Дата рождения</label>
                      <input
                        type="date"
                        id="birthday"
                        name="birthday"
                        value={userForm.birthday}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="form-actions">
                      <button 
                        type="button"
                        className="cancel-btn"
                        onClick={() => {
                          setEditMode(false);
                          // Восстанавливаем исходные данные
                          setUserForm({
                            firstName: user.firstName || '',
                            lastName: user.lastName || '',
                            email: user.email || '',
                            phone: user.phone || '',
                            birthday: user.birthday || ''
                          });
                        }}
                      >
                        Отмена
                      </button>
                      
                      <button 
                        type="button"
                        className="save-btn"
                        onClick={handleSaveProfile}
                      >
                        Сохранить
                      </button>
                    </div>
                  </form>
                ) : (
                  // Просмотр данных
                  <div className="profile-data">
                    <div className="data-row">
                      <div className="data-label">Имя:</div>
                      <div className="data-value">{user.firstName || '—'}</div>
                    </div>
                    
                    <div className="data-row">
                      <div className="data-label">Фамилия:</div>
                      <div className="data-value">{user.lastName || '—'}</div>
                    </div>
                    
                    <div className="data-row">
                      <div className="data-label">Email:</div>
                      <div className="data-value">{user.email}</div>
                    </div>
                    
                    <div className="data-row">
                      <div className="data-label">Телефон:</div>
                      <div className="data-value">{user.phone || '—'}</div>
                    </div>
                    
                    <div className="data-row">
                      <div className="data-label">Дата рождения:</div>
                      <div className="data-value">
                        {user.birthday 
                          ? new Date(user.birthday).toLocaleDateString('ru-RU')
                          : '—'
                        }
                      </div>
                    </div>
                    
                    <div className="data-row">
                      <div className="data-label">Дата регистрации:</div>
                      <div className="data-value">
                        {user.createdAt 
                          ? new Date(user.createdAt).toLocaleDateString('ru-RU')
                          : '—'
                        }
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Заказы */}
            {activeTab === 'orders' && (
              <div className="tab-content orders-tab">
                <div className="tab-header">
                  <h2>Мои заказы</h2>
                </div>
                
                {renderOrdersTab()}
              </div>
            )}
            
            {/* Избранное */}
            {activeTab === 'wishlist' && (
              <div className="tab-content wishlist-tab">
                <div className="tab-header">
                  <h2>Избранное</h2>
                </div>
                
                {renderWishlistTab()}
              </div>
            )}
            
            {/* Адреса */}
            {activeTab === 'addresses' && (
              <div className="tab-content addresses-tab">
                <div className="tab-header">
                  <h2>Адреса доставки</h2>
                </div>
                
                {renderAddressesTab()}
              </div>
            )}
            
            {/* Смена пароля */}
            {activeTab === 'password' && (
              <div className="tab-content password-tab">
                <div className="tab-header">
                  <h2>Смена пароля</h2>
                </div>
                
                {/* Здесь будет форма смены пароля */}
                <div className="coming-soon">
                  <p>Функция смены пароля будет доступна в ближайшее время</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
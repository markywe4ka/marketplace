import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import '../styles/CartPage.css';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  
  // State для купонов и доставки
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [shippingMethod, setShippingMethod] = useState('standard');
  
  // State для данных с API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // Стоимость доставки в зависимости от метода
  const shippingCosts = {
    standard: 300,
    express: 600,
    pickup: 0
  };

  // Загрузка корзины из API
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        
        // Попытка получить корзину из API
        try {
          const response = await api.cart.getCart();
          setCartItems(response.items || []);
        } catch (apiError) {
          console.error('Ошибка при получении корзины из API:', apiError);
          // Если API недоступно, используем локальную корзину из контекста
          setCartItems(cart);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Ошибка при загрузке корзины:', err);
        setError('Не удалось загрузить корзину. Пожалуйста, попробуйте позже.');
        setLoading(false);
      }
    };
    
    fetchCart();
  }, [cart]);
  
  // Подсчет общей стоимости товаров в корзине
  const calculateSubtotal = () => {
    // Используем данные из API или из локальной корзины
    const itemsToCalculate = cartItems.length > 0 ? cartItems : cart;
    return itemsToCalculate.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  };
  
  // Подсчет общей стоимости заказа
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = shippingCosts[shippingMethod];
    const discount = couponApplied ? couponDiscount : 0;
    
    return subtotal + shipping - discount;
  };
  
  // Применение купона
  const applyCoupon = async () => {
    // Попытка применить купон через API
    try {
      const response = await api.cart.applyCoupon(couponCode);
      setCouponDiscount(response.discount);
      setCouponApplied(true);
      alert(`Купон применен! Скидка ${response.discount} ₽`);
    } catch (apiError) {
      console.error('Ошибка API при применении купона:', apiError);
      
      // Если API недоступно, используем локальную логику
      if (couponCode.toUpperCase() === 'DISCOUNT10') {
        const discount = Math.round(calculateSubtotal() * 0.1); // 10% скидка
        setCouponDiscount(discount);
        setCouponApplied(true);
        alert('Купон применен! Скидка 10%');
      } else if (couponCode.toUpperCase() === 'FREESHIP') {
        setCouponDiscount(shippingCosts[shippingMethod]);
        setCouponApplied(true);
        alert('Купон применен! Бесплатная доставка');
      } else {
        alert('Недействительный купон');
      }
    }
  };
  
  // Очистка купона
  const clearCoupon = async () => {
    try {
      // Попытка удалить купон через API
      await api.cart.removeCoupon();
    } catch (apiError) {
      console.error('Ошибка API при удалении купона:', apiError);
      // Если API недоступно, ничего не делаем
    }
    
    // В любом случае обновляем локальное состояние
    setCouponCode('');
    setCouponApplied(false);
    setCouponDiscount(0);
  };
  
  // Обработчик изменения количества товара
  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity > 0 && newQuantity <= 10) {
      try {
        // Обновляем количество в API
        try {
          await api.cart.updateCartItem(itemId, newQuantity);
        } catch (apiError) {
          console.error('Ошибка API при обновлении количества:', apiError);
          // Если API недоступно, обновляем только локально
        }
        
        // Обновляем локальное состояние
        updateQuantity(itemId, newQuantity);
      } catch (error) {
        console.error('Ошибка при обновлении количества:', error);
        alert('Ошибка при обновлении количества товара');
      }
    }
  };
  
  // Обработчик удаления товара из корзины
  const handleRemoveItem = async (itemId) => {
    try {
      // Удаляем товар через API
      try {
        await api.cart.removeFromCart(itemId);
      } catch (apiError) {
        console.error('Ошибка API при удалении товара:', apiError);
        // Если API недоступно, удаляем только локально
      }
      
      // Удаляем товар из локальной корзины
      removeFromCart(itemId);
    } catch (error) {
      console.error('Ошибка при удалении товара:', error);
      alert('Ошибка при удалении товара из корзины');
    }
  };
  
  // Обработчик очистки корзины
  const handleClearCart = async () => {
    if (window.confirm('Вы уверены, что хотите очистить корзину?')) {
      try {
        // Очищаем корзину через API
        try {
          await api.cart.clearCart();
        } catch (apiError) {
          console.error('Ошибка API при очистке корзины:', apiError);
          // Если API недоступно, очищаем только локально
        }
        
        // Очищаем локальную корзину
        clearCart();
      } catch (error) {
        console.error('Ошибка при очистке корзины:', error);
        alert('Ошибка при очистке корзины');
      }
    }
  };
  
  // Переход к оформлению заказа
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  // Загрузка страницы
  if (loading) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1 className="page-title">Корзина</h1>
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Загрузка корзины...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Обработка ошибок
  if (error) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1 className="page-title">Корзина</h1>
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Попробовать снова</button>
          </div>
        </div>
      </div>
    );
  }
  
  // Получаем список товаров (из API или локальной корзины)
  const cartData = cartItems.length > 0 ? cartItems : cart;
  
  // Если корзина пуста
  if (cartData.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1 className="page-title">Корзина</h1>
          
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Ваша корзина пуста</h2>
            <p>Похоже, вы еще не добавили товары в корзину</p>
            <Link to="/" className="btn">
              Продолжить покупки
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Корзина</h1>
        
        <div className="cart-container">
          <div className="cart-items">
            {/* Шапка таблицы */}
            <div className="cart-header">
              <div className="header-product">Товар</div>
              <div className="header-price">Цена</div>
              <div className="header-quantity">Количество</div>
              <div className="header-total">Всего</div>
              <div className="header-remove"></div>
            </div>
            
            {/* Товары в корзине */}
            {cartData.map(item => (
              <div className="cart-item" key={`${item.id || item._id}-${item.color}-${item.size}`}>
                <div className="item-product">
                  <div className="item-image">
                    <img 
                      src={item.image || (item.images && item.images.length > 0 ? item.images[0] : '/placeholder.jpg')} 
                      alt={item.name} 
                    />
                  </div>
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <div className="item-meta">
                      {item.color && (
                        <div className="item-color">
                          <span className="meta-label">Цвет:</span> 
                          <span 
                            className="color-dot" 
                            style={{ backgroundColor: item.color }}
                          ></span>
                        </div>
                      )}
                      {item.size && (
                        <div className="item-size">
                          <span className="meta-label">Размер:</span> {item.size}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="item-price">
                  {item.price.toLocaleString('ru-RU')} ₽
                </div>
                
                <div className="item-quantity">
                  <div className="quantity-control">
                    <button 
                      className="quantity-btn minus"
                      onClick={() => handleQuantityChange(item.id || item._id, (item.quantity || 1) - 1)}
                      disabled={(item.quantity || 1) <= 1}
                    >
                      −
                    </button>
                    <input 
                      type="number" 
                      min="1" 
                      max="10"
                      value={item.quantity || 1}
                      onChange={(e) => handleQuantityChange(item.id || item._id, parseInt(e.target.value))}
                      className="quantity-input"
                    />
                    <button 
                      className="quantity-btn plus"
                      onClick={() => handleQuantityChange(item.id || item._id, (item.quantity || 1) + 1)}
                      disabled={(item.quantity || 1) >= 10}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="item-total">
                  {((item.price * (item.quantity || 1))).toLocaleString('ru-RU')} ₽
                </div>
                
                <div className="item-remove">
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item.id || item._id)}
                  >
                    ✖
                  </button>
                </div>
              </div>
            ))}
            
            {/* Кнопки действий с корзиной */}
            <div className="cart-actions">
              <button 
                className="clear-cart-btn"
                onClick={handleClearCart}
              >
                Очистить корзину
              </button>
              <Link to="/" className="continue-shopping-btn">
                Продолжить покупки
              </Link>
            </div>
          </div>
          
          {/* Итоги корзины */}
          <div className="cart-summary">
            <h2 className="summary-title">Итого</h2>
            
            <div className="summary-row">
              <div className="summary-label">Товары:</div>
              <div className="summary-value">{calculateSubtotal().toLocaleString('ru-RU')} ₽</div>
            </div>
            
            {/* Выбор способа доставки */}
            <div className="shipping-methods">
              <h3 className="methods-title">Доставка</h3>
              
              <div className="method-option">
                <input 
                  type="radio" 
                  id="standard-shipping" 
                  name="shipping" 
                  value="standard"
                  checked={shippingMethod === 'standard'}
                  onChange={() => setShippingMethod('standard')}
                />
                <label htmlFor="standard-shipping">
                  <span className="method-name">Стандартная доставка</span>
                  <span className="method-cost">{shippingCosts.standard} ₽</span>
                </label>
                <div className="method-description">2-4 рабочих дня</div>
              </div>
              
              <div className="method-option">
                <input 
                  type="radio" 
                  id="express-shipping" 
                  name="shipping" 
                  value="express"
                  checked={shippingMethod === 'express'}
                  onChange={() => setShippingMethod('express')}
                />
                <label htmlFor="express-shipping">
                  <span className="method-name">Экспресс-доставка</span>
                  <span className="method-cost">{shippingCosts.express} ₽</span>
                </label>
                <div className="method-description">1-2 рабочих дня</div>
              </div>
              
              <div className="method-option">
                <input 
                  type="radio" 
                  id="pickup" 
                  name="shipping" 
                  value="pickup"
                  checked={shippingMethod === 'pickup'}
                  onChange={() => setShippingMethod('pickup')}
                />
                <label htmlFor="pickup">
                  <span className="method-name">Самовывоз</span>
                  <span className="method-cost">{shippingCosts.pickup} ₽</span>
                </label>
                <div className="method-description">Из магазина</div>
              </div>
            </div>
            
            {/* Купон */}
            <div className="coupon-section">
              <h3 className="methods-title">Купон</h3>
              
              {couponApplied ? (
                <div className="applied-coupon">
                  <div className="coupon-info">
                    <div className="coupon-code">{couponCode.toUpperCase()}</div>
                    <div className="coupon-discount">-{couponDiscount.toLocaleString('ru-RU')} ₽</div>
                  </div>
                  <button 
                    className="remove-coupon-btn"
                    onClick={clearCoupon}
                  >
                    Удалить
                  </button>
                </div>
              ) : (
                <div className="coupon-form">
                  <input 
                    type="text" 
                    className="coupon-input"
                    placeholder="Введите код купона"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button 
                    className="coupon-btn"
                    onClick={applyCoupon}
                    disabled={couponCode.trim() === ''}
                  >
                    Применить
                  </button>
                </div>
              )}
              
              <p className="coupon-tip">
                Попробуйте купоны: DISCOUNT10, FREESHIP
              </p>
            </div>
            
            {/* Итоговая сумма */}
            <div className="total-section">
              <div className="summary-row subtotal">
                <div className="summary-label">Подытог:</div>
                <div className="summary-value">{calculateSubtotal().toLocaleString('ru-RU')} ₽</div>
              </div>
              
              <div className="summary-row shipping">
                <div className="summary-label">Доставка:</div>
                <div className="summary-value">{shippingCosts[shippingMethod].toLocaleString('ru-RU')} ₽</div>
              </div>
              
              {couponApplied && (
                <div className="summary-row discount">
                  <div className="summary-label">Скидка:</div>
                  <div className="summary-value discount-value">-{couponDiscount.toLocaleString('ru-RU')} ₽</div>
                </div>
              )}
              
              <div className="summary-row total">
                <div className="summary-label">Итого:</div>
                <div className="summary-value">{calculateTotal().toLocaleString('ru-RU')} ₽</div>
              </div>
              
              <button 
                className="checkout-btn"
                onClick={handleCheckout}
              >
                Перейти к оформлению
              </button>
              
              <div className="secure-checkout">
                <div className="secure-icon">🔒</div>
                <div className="secure-text">Безопасное оформление заказа</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
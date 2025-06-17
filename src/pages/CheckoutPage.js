import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  
  // Состояние формы
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Россия',
    paymentMethod: 'card'
  });
  
  // Состояние ошибок
  const [errors, setErrors] = useState({});
  
  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Очистка ошибки при изменении поля
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  // Валидация формы
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'Введите имя';
    if (!formData.lastName.trim()) newErrors.lastName = 'Введите фамилию';
    if (!formData.email.trim()) newErrors.email = 'Введите email';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Введите корректный email';
    if (!formData.phone.trim()) newErrors.phone = 'Введите телефон';
    if (!formData.address.trim()) newErrors.address = 'Введите адрес';
    if (!formData.city.trim()) newErrors.city = 'Введите город';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Введите почтовый индекс';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Имитация отправки заказа на сервер
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Здесь будет API-запрос для создания заказа
      
      // Очистка корзины
      clearCart();
      
      // Перенаправление на страницу успешного заказа
      navigate('/order-success', { 
        state: { 
          orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000) 
        } 
      });
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
      setErrors({ submit: 'Произошла ошибка при оформлении заказа. Попробуйте позже.' });
    } finally {
      setLoading(false);
    }
  };
  
  // Если корзина пуста, перенаправляем на страницу корзины
  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-info">
          <h4>Ваша корзина пуста</h4>
          <p>Добавьте товары в корзину, чтобы оформить заказ.</p>
          <Link to="/" className="btn btn-primary mt-3">Перейти к покупкам</Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-5">
      <h1 className="mb-4">Оформление заказа</h1>
      
      {errors.submit && (
        <div className="alert alert-danger">{errors.submit}</div>
      )}
      
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header bg-white">
              <h4 className="mb-0">Данные для доставки</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="firstName" className="form-label">Имя</label>
                    <input
                      type="text"
                      className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                  </div>
                  
                  <div className="col-md-6">
                    <label htmlFor="lastName" className="form-label">Фамилия</label>
                    <input
                      type="text"
                      className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                  </div>
                  
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                  
                  <div className="col-md-6">
                    <label htmlFor="phone" className="form-label">Телефон</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                  </div>
                  
                  <div className="col-12">
                    <label htmlFor="address" className="form-label">Адрес</label>
                    <input
                      type="text"
                      className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                  </div>
                  
                  <div className="col-md-5">
                    <label htmlFor="city" className="form-label">Город</label>
                    <input
                      type="text"
                      className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                  </div>
                  
                  <div className="col-md-4">
                    <label htmlFor="country" className="form-label">Страна</label>
                    <select
                      className="form-select"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="Россия">Россия</option>
                      <option value="Беларусь">Беларусь</option>
                      <option value="Казахстан">Казахстан</option>
                    </select>
                  </div>
                  
                  <div className="col-md-3">
                    <label htmlFor="postalCode" className="form-label">Индекс</label>
                    <input
                      type="text"
                      className={`form-control ${errors.postalCode ? 'is-invalid' : ''}`}
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    {errors.postalCode && <div className="invalid-feedback">{errors.postalCode}</div>}
                  </div>
                </div>
                
                <hr className="my-4" />
                
                <h4 className="mb-3">Способ оплаты</h4>
                
                <div className="my-3">
                  <div className="form-check">
                    <input
                      id="credit"
                      name="paymentMethod"
                      type="radio"
                      className="form-check-input"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <label className="form-check-label" htmlFor="credit">Банковская карта</label>
                  </div>
                  
                  <div className="form-check">
                    <input
                      id="paypal"
                      name="paymentMethod"
                      type="radio"
                      className="form-check-input"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <label className="form-check-label" htmlFor="paypal">PayPal</label>
                  </div>
                  
                  <div className="form-check">
                    <input
                      id="cod"
                      name="paymentMethod"
                      type="radio"
                      className="form-check-input"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <label className="form-check-label" htmlFor="cod">Наложенный платеж</label>
                  </div>
                </div>
                
                {formData.paymentMethod === 'card' && (
                  <div className="row mt-3 gy-3">
                    <div className="col-md-6">
                      <label htmlFor="cc-name" className="form-label">Имя на карте</label>
                      <input
                        type="text"
                        className="form-control"
                        id="cc-name"
                        placeholder=""
                        disabled={loading}
                      />
                      <small className="text-muted">Полное имя, как указано на карте</small>
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="cc-number" className="form-label">Номер карты</label>
                      <input
                        type="text"
                        className="form-control"
                        id="cc-number"
                        placeholder=""
                        disabled={loading}
                      />
                    </div>
                    
                    <div className="col-md-3">
                      <label htmlFor="cc-expiration" className="form-label">Срок действия</label>
                      <input
                        type="text"
                        className="form-control"
                        id="cc-expiration"
                        placeholder=""
                        disabled={loading}
                      />
                    </div>
                    
                    <div className="col-md-3">
                      <label htmlFor="cc-cvv" className="form-label">CVV</label>
                      <input
                        type="text"
                        className="form-control"
                        id="cc-cvv"
                        placeholder=""
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}
                
                <hr className="my-4" />
                
                <div className="form-check mb-4">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="save-info"
                    disabled={loading}
                  />
                  <label className="form-check-label" htmlFor="save-info">
                    Сохранить эту информацию для следующего раза
                  </label>
                </div>
                
                <div className="d-flex">
                  <Link to="/cart" className="btn btn-outline-secondary me-2">
                    <i className="bi bi-arrow-left me-1"></i> Вернуться в корзину
                  </Link>
                  <button 
                    className="btn btn-success flex-grow-1" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Оформление заказа...
                      </>
                    ) : 'Оформить заказ'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-white">
              <h4 className="mb-0">Ваш заказ</h4>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush mb-3">
                {cartItems.map(item => (
                  <li key={item._id} className="list-group-item d-flex justify-content-between lh-sm">
                    <div>
                      <h6 className="my-0">{item.name}</h6>
                      <small className="text-muted">Количество: {item.quantity}</small>
                    </div>
                    <span className="text-muted">{(item.price * item.quantity).toLocaleString()} ₽</span>
                  </li>
                ))}
                
                <li className="list-group-item d-flex justify-content-between">
                  <span>Стоимость товаров</span>
                  <strong>{total.toLocaleString()} ₽</strong>
                </li>
                
                <li className="list-group-item d-flex justify-content-between">
                  <span>Доставка</span>
                  <strong>Бесплатно</strong>
                </li>
                
                <li className="list-group-item d-flex justify-content-between">
                  <span>Итого</span>
                  <strong>{total.toLocaleString()} ₽</strong>
                </li>
              </ul>
              
              <div className="card mb-3 bg-light">
                <div className="card-body">
                  <p className="mb-1">
                    <i className="bi bi-truck me-2"></i>
                    <strong>Стандартная доставка</strong>
                  </p>
                  <p className="text-muted small mb-0">3-5 рабочих дней</p>
                </div>
              </div>
              
              <div className="card bg-light">
                <div className="card-body">
                  <h6 className="mb-3">Есть промокод?</h6>
                  <div className="input-group">
                    <input type="text" className="form-control" placeholder="Введите код" disabled={loading} />
                    <button className="btn btn-secondary" type="button" disabled={loading}>Применить</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
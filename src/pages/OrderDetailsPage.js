import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function OrderDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Имитация загрузки данных заказа с сервера
    const fetchOrder = async () => {
      try {
        setLoading(true);
        // Имитация запроса к API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Тестовые данные заказа
        const dummyOrder = {
          _id: id,
          createdAt: '2023-06-15T10:30:00',
          user: {
            _id: '101',
            name: 'Иванов Иван',
            email: 'ivanov@example.com'
          },
          orderItems: [
            { 
              _id: '1', 
              name: 'Смартфон XYZ', 
              image: 'https://via.placeholder.com/100x100?text=Phone',
              price: 29999, 
              quantity: 1 
            },
            { 
              _id: '3', 
              name: 'Наушники QWE',
              image: 'https://via.placeholder.com/100x100?text=Headphones',
              price: 8999, 
              quantity: 2 
            }
          ],
          shippingAddress: {
            address: 'ул. Ленина, д. 123, кв. 45',
            city: 'Москва',
            postalCode: '123456',
            country: 'Россия'
          },
          paymentMethod: 'card',
          paymentResult: {
            id: 'PAY123456789',
            status: 'completed',
            update_time: '2023-06-15T11:30:00',
            email_address: 'ivanov@example.com'
          },
          totalPrice: 47997,
          isPaid: true,
          paidAt: '2023-06-15T11:30:00',
          isDelivered: false,
          deliveredAt: null,
          status: 'processing' // processing, shipped, delivered, cancelled
        };
        
        setOrder(dummyOrder);
        setError(null);
      } catch (err) {
        setError('Не удалось загрузить информацию о заказе');
        console.error('Ошибка загрузки заказа:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [id]);

  const getStatusBadge = (status) => {
    const statusMap = {
      processing: <span className="badge bg-warning text-dark">В обработке</span>,
      shipped: <span className="badge bg-info">Отправлен</span>,
      delivered: <span className="badge bg-success">Доставлен</span>,
      cancelled: <span className="badge bg-danger">Отменен</span>
    };
    
    return statusMap[status] || <span className="badge bg-secondary">Неизвестно</span>;
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      // Имитация запроса к API для обновления статуса
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Обновляем локальное состояние заказа
      setOrder(prev => ({
        ...prev,
        status: newStatus,
        ...(newStatus === 'delivered' ? { isDelivered: true, deliveredAt: new Date().toISOString() } : {})
      }));
      
      alert('Статус заказа успешно обновлен');
    } catch (error) {
      alert('Ошибка при обновлении статуса заказа');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
        <p className="mt-3">Загрузка информации о заказе...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          <h4>Ошибка</h4>
          <p>{error}</p>
          <Link to="/orders" className="btn btn-primary mt-3">Вернуться к заказам</Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning text-center">
          <h4>Заказ не найден</h4>
          <p>Запрашиваемый заказ не существует или был удален.</p>
          <Link to="/orders" className="btn btn-primary mt-3">Вернуться к заказам</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Заказ #{order._id}</h1>
        <div>
          {getStatusBadge(order.status)}
        </div>
      </div>
      
      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">Информация о заказе</h5>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <p className="mb-1"><strong>Дата заказа:</strong></p>
                  <p>{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1"><strong>Заказчик:</strong></p>
                  <p>{order.user.name} ({order.user.email})</p>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <p className="mb-1"><strong>Способ оплаты:</strong></p>
                  <p>
                    {order.paymentMethod === 'card' ? 'Банковская карта' : 
                     order.paymentMethod === 'paypal' ? 'PayPal' : 
                     order.paymentMethod === 'cod' ? 'Наложенный платеж' : 
                     order.paymentMethod}
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1"><strong>Статус оплаты:</strong></p>
                  <p>
                    {order.isPaid ? (
                      <span className="text-success">
                        Оплачен {new Date(order.paidAt).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-danger">Не оплачен</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <p className="mb-1"><strong>Адрес доставки:</strong></p>
                  <p>
                    {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1"><strong>Статус доставки:</strong></p>
                  <p>
                    {order.isDelivered ? (
                      <span className="text-success">
                        Доставлен {new Date(order.deliveredAt).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-warning">Ожидает доставки</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">Товары в заказе</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Товар</th>
                      <th>Цена</th>
                      <th>Количество</th>
                      <th>Сумма</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems.map(item => (
                      <tr key={item._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="img-thumbnail me-3" 
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                            />
                            <div>
                              <Link to={`/product/${item._id}`}>{item.name}</Link>
                            </div>
                          </div>
                        </td>
                        <td>{item.price.toLocaleString()} ₽</td>
                        <td>{item.quantity}</td>
                        <td>{(item.price * item.quantity).toLocaleString()} ₽</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Панель администратора для управления заказом */}
          {user?.role === 'admin' && (
            <div className="card">
              <div className="card-header bg-light">
                <h5 className="mb-0">Управление заказом</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Изменить статус заказа</label>
                    <select 
                      className="form-select"
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(e.target.value)}
                    >
                      <option value="processing">В обработке</option>
                      <option value="shipped">Отправлен</option>
                      <option value="delivered">Доставлен</option>
                      <option value="cancelled">Отменен</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Действия</label>
                    <div className="d-grid gap-2">
                      <button className="btn btn-outline-primary">
                        Отправить уведомление клиенту
                      </button>
                    </div>
                  </div>
                </div>
                <div className="d-grid">
                  <Link to="/admin/orders" className="btn btn-secondary">
                    Вернуться к списку заказов
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0">Сводка заказа</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-3">
                <span>Товары:</span>
                <span>{order.totalPrice.toLocaleString()} ₽</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Доставка:</span>
                <span>Бесплатно</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3 fw-bold">
                <span>Итого:</span>
                <span>{order.totalPrice.toLocaleString()} ₽</span>
              </div>

              {!order.isPaid && (
                <div className="mt-3">
                  <button className="btn btn-success w-100 mb-2">
                    <i className="bi bi-credit-card me-2"></i>
                    Оплатить заказ
                  </button>
                </div>
              )}

              <div className="mt-3">
                <Link to="/orders" className="btn btn-outline-primary w-100">
                  <i className="bi bi-arrow-left me-2"></i>
                  Назад к моим заказам
                </Link>
              </div>
            </div>
          </div>

          <div className="card mt-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">История заказа</h5>
            </div>
            <div className="card-body p-0">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted">{new Date(order.createdAt).toLocaleString()}</small>
                    <p className="mb-0">Заказ создан</p>
                  </div>
                  <span className="badge rounded-pill bg-primary">
                    <i className="bi bi-cart"></i>
                  </span>
                </li>
                {order.isPaid && (
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted">{new Date(order.paidAt).toLocaleString()}</small>
                      <p className="mb-0">Заказ оплачен</p>
                    </div>
                    <span className="badge rounded-pill bg-success">
                      <i className="bi bi-credit-card"></i>
                    </span>
                  </li>
                )}
                {order.status === 'shipped' && (
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted">15.06.2023, 09:45</small>
                      <p className="mb-0">Заказ отправлен</p>
                    </div>
                    <span className="badge rounded-pill bg-info">
                      <i className="bi bi-truck"></i>
                    </span>
                  </li>
                )}
                {order.isDelivered && (
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted">{new Date(order.deliveredAt).toLocaleString()}</small>
                      <p className="mb-0">Заказ доставлен</p>
                    </div>
                    <span className="badge rounded-pill bg-success">
                      <i className="bi bi-check-circle"></i>
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;
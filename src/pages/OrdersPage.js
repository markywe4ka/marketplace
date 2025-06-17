import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Имитация загрузки заказов
    setTimeout(() => {
      const dummyOrders = [
        {
          _id: '101',
          createdAt: '2023-05-15T10:30:00',
          totalPrice: 38998,
          isPaid: true,
          isDelivered: false,
          items: [
            { _id: '1', name: 'Смартфон XYZ', quantity: 1, price: 29999 },
            { _id: '3', name: 'Наушники QWE', quantity: 1, price: 8999 }
          ]
        },
        {
          _id: '102',
          createdAt: '2023-04-20T14:15:00',
          totalPrice: 59999,
          isPaid: true,
          isDelivered: true,
          items: [
            { _id: '2', name: 'Ноутбук ABC', quantity: 1, price: 59999 }
          ]
        }
      ];
      setOrders(dummyOrders);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
        <p className="mt-3">Загрузка заказов...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container py-5">
        <div className="card shadow text-center p-5">
          <h1>Мои заказы</h1>
          <div className="py-5">
            <i className="bi bi-box" style={{ fontSize: '5rem', color: '#ccc' }}></i>
            <p className="lead my-3">У вас пока нет заказов</p>
            <Link to="/" className="btn btn-primary">Перейти к покупкам</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Мои заказы</h1>
      
      <div className="card shadow mb-4">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Дата</th>
                  <th>Сумма</th>
                  <th>Оплачен</th>
                  <th>Доставлен</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                    <td>{order.totalPrice.toLocaleString()} ₽</td>
                    <td>
                      {order.isPaid ? (
                        <span className="badge bg-success">Да</span>
                      ) : (
                        <span className="badge bg-danger">Нет</span>
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        <span className="badge bg-success">Да</span>
                      ) : (
                        <span className="badge bg-warning text-dark">В пути</span>
                      )}
                    </td>
                    <td>
                      <Link to={`/order/${order._id}`} className="btn btn-sm btn-outline-primary">
                        Детали
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="accordion" id="orderAccordion">
        {orders.map((order, index) => (
          <div className="accordion-item" key={order._id}>
            <h2 className="accordion-header">
              <button 
                className="accordion-button collapsed" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target={`#collapse${index}`}
              >
                Заказ #{order._id} от {new Date(order.createdAt).toLocaleDateString()} - {order.totalPrice.toLocaleString()} ₽
              </button>
            </h2>
            <div id={`collapse${index}`} className="accordion-collapse collapse" data-bs-parent="#orderAccordion">
              <div className="accordion-body">
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="mb-3">Информация о заказе</h5>
                    <p><strong>Дата заказа:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                    <p><strong>ID заказа:</strong> {order._id}</p>
                    <p>
                      <strong>Статус оплаты:</strong>{' '}
                      {order.isPaid ? (
                        <span className="badge bg-success">Оплачен</span>
                      ) : (
                        <span className="badge bg-danger">Не оплачен</span>
                      )}
                    </p>
                    <p>
                      <strong>Статус доставки:</strong>{' '}
                      {order.isDelivered ? (
                        <span className="badge bg-success">Доставлен</span>
                      ) : (
                        <span className="badge bg-warning text-dark">В пути</span>
                      )}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h5 className="mb-3">Детали доставки</h5>
                    <p><strong>Адрес:</strong> ул. Примерная, д. 123</p>
                    <p><strong>Город:</strong> Москва</p>
                    <p><strong>Индекс:</strong> 123456</p>
                    <p><strong>Способ доставки:</strong> Курьер</p>
                  </div>
                </div>
                
                <hr className="my-3" />
                
                <h5 className="mb-3">Товары в заказе</h5>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Товар</th>
                        <th>Цена</th>
                        <th>Количество</th>
                        <th>Сумма</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map(item => (
                        <tr key={item._id}>
                          <td>
                            <Link to={`/product/${item._id}`} className="text-decoration-none">
                              {item.name}
                            </Link>
                          </td>
                          <td>{item.price.toLocaleString()} ₽</td>
                          <td>{item.quantity}</td>
                          <td>{(item.price * item.quantity).toLocaleString()} ₽</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="text-end"><strong>Итого:</strong></td>
                        <td><strong>{order.totalPrice.toLocaleString()} ₽</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                
                <div className="mt-3">
                  {!order.isPaid && (
                    <button className="btn btn-success me-2">
                      <i className="bi bi-credit-card me-2"></i>
                      Оплатить заказ
                    </button>
                  )}
                  <Link to={`/order/${order._id}`} className="btn btn-primary">
                    <i className="bi bi-info-circle me-2"></i>
                    Подробнее о заказе
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Добавление пагинации, если будет много заказов */}
      {orders.length > 10 && (
  <nav aria-label="Page navigation example" className="mt-4">
    <ul className="pagination justify-content-center">
      <li className="page-item disabled">
        <button className="page-link" disabled>Предыдущая</button>
      </li>
      <li className="page-item active">
        <span className="page-link">1</span>
      </li>
      <li className="page-item">
        <Link className="page-link" to="/orders?page=2">2</Link>
      </li>
      <li className="page-item">
        <Link className="page-link" to="/orders?page=3">3</Link>
      </li>
      <li className="page-item">
        <Link className="page-link" to="/orders?page=2">Следующая</Link>
      </li>
    </ul>
  </nav>
)}
    </div>
  );
}

export default OrdersPage;
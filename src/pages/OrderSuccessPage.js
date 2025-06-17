import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function OrderSuccessPage() {
  const location = useLocation();
  const orderId = location.state?.orderId || 'Unknown';
  
  return (
    <div className="container py-5 text-center">
      <div className="py-5">
        <div className="mb-4">
          <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '5rem' }}></i>
        </div>
        <h1 className="display-4 mb-4">Спасибо за ваш заказ!</h1>
        <p className="lead mb-1">Ваш заказ успешно оформлен.</p>
        <p className="mb-4">Номер заказа: <strong>{orderId}</strong></p>
        <p className="mb-4">
          Мы отправили подтверждение заказа на вашу электронную почту. 
          Вы также можете отслеживать статус заказа в разделе "Мои заказы".
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/orders" className="btn btn-outline-primary">
            Мои заказы
          </Link>
          <Link to="/" className="btn btn-primary">
            Продолжить покупки
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessPage;
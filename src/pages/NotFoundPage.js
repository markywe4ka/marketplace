// src/pages/NotFoundPage.js
import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="container py-5 text-center">
      <div className="py-5">
        <h1 className="display-1">404</h1>
        <h2 className="mb-4">Страница не найдена</h2>
        <p className="lead mb-4">Запрашиваемая страница не существует или была перемещена.</p>
        <Link to="/" className="btn btn-primary">Вернуться на главную</Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
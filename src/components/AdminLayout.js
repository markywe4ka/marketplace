import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminLayout() {
  const { user } = useAuth();
  const location = useLocation();
  
  // Проверка, активна ли ссылка
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };
  
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Боковая панель */}
        <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
          <div className="position-sticky pt-3">
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/admin')}`} to="/admin">
                  <i className="bi bi-speedometer2 me-2"></i>
                  Обзор
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/admin/products')}`} to="/admin/products">
                  <i className="bi bi-box-seam me-2"></i>
                  Товары
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/admin/orders')}`} to="/admin/orders">
                  <i className="bi bi-cart4 me-2"></i>
                  Заказы
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/admin/users')}`} to="/admin/users">
                  <i className="bi bi-people me-2"></i>
                  Пользователи
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/admin/settings')}`} to="/admin/settings">
                  <i className="bi bi-gear me-2"></i>
                  Настройки
                </Link>
              </li>
            </ul>

            <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
              <span>Отчеты</span>
            </h6>
            <ul className="nav flex-column mb-2">
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/admin/reports/sales')}`} to="/admin/reports/sales">
                  <i className="bi bi-file-earmark-text me-2"></i>
                  Продажи
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/admin/reports/inventory')}`} to="/admin/reports/inventory">
                  <i className="bi bi-file-earmark-text me-2"></i>
                  Инвентарь
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Основной контент */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Панель администратора</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <div className="dropdown">
                <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" id="userProfileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="bi bi-person-circle me-1"></i>
                  {user?.name || 'Администратор'}
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userProfileDropdown">
                  <li><Link className="dropdown-item" to="/profile">Профиль</Link></li>
                  <li><Link className="dropdown-item" to="/">На сайт</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item" to="/logout">Выйти</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Здесь будет рендериться содержимое дочерних маршрутов */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
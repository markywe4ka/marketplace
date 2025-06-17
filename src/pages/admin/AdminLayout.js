// Обновите файл AdminLayout.js (src/pages/admin/index.js)
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const location = useLocation();
  const [sidebarToggled, setSidebarToggled] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarToggled(!sidebarToggled);
  };
  
  // Проверка активного маршрута
  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className={`sb-nav-fixed ${sidebarToggled ? 'sb-sidenav-toggled' : ''}`}>
      <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
        <Link className="navbar-brand ps-3" to="/admin">Админ-панель</Link>
        <button 
          className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" 
          onClick={toggleSidebar}
        >
          <i className="fas fa-bars"></i>
        </button>
        
        {/* Поиск */}
        <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
          <div className="input-group">
            <input 
              className="form-control" 
              type="text" 
              placeholder="Поиск..." 
              aria-label="Search" 
            />
            <button className="btn btn-primary" type="button">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </form>
        
        {/* Профиль */}
        <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
          <li className="nav-item dropdown">
            <a 
              className="nav-link dropdown-toggle" 
              id="navbarDropdown" 
              href="#" 
              role="button" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
            >
              <i className="fas fa-user fa-fw"></i>
            </a>
            <ul 
              className="dropdown-menu dropdown-menu-end" 
              aria-labelledby="navbarDropdown"
            >
              <li><Link className="dropdown-item" to="/profile">Настройки</Link></li>
              <li><hr className="dropdown-divider" /></li>
              <li><a className="dropdown-item" href="#!">Выйти</a></li>
            </ul>
          </li>
        </ul>
      </nav>
      
      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
              <div className="nav">
                <div className="sb-sidenav-menu-heading">Основное</div>
                <Link 
                  className={`nav-link ${isActiveRoute('/admin') && !isActiveRoute('/admin/analytics') ? 'active' : ''}`} 
                  to="/admin"
                >
                  <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                  Дашборд
                </Link>
                <Link 
                  className={`nav-link ${isActiveRoute('/admin/analytics') ? 'active' : ''}`} 
                  to="/admin/analytics"
                >
                  <div className="sb-nav-link-icon"><i className="fas fa-chart-bar"></i></div>
                  Аналитика
                </Link>
                
                <div className="sb-sidenav-menu-heading">Контент</div>
                <Link 
                  className={`nav-link ${isActiveRoute('/admin/products') ? 'active' : ''}`} 
                  to="/admin/products"
                >
                  <div className="sb-nav-link-icon"><i className="fas fa-box"></i></div>
                  Товары
                </Link>
                <Link 
                  className={`nav-link ${isActiveRoute('/admin/categories') ? 'active' : ''}`} 
                  to="/admin/categories"
                >
                  <div className="sb-nav-link-icon"><i className="fas fa-list"></i></div>
                  Категории
                </Link>
                <Link 
                  className={`nav-link ${isActiveRoute('/admin/inventory') ? 'active' : ''}`} 
                  to="/admin/inventory"
                >
                  <div className="sb-nav-link-icon"><i className="fas fa-warehouse"></i></div>
                  Остатки
                </Link>
                
                <div className="sb-sidenav-menu-heading">Заказы</div>
                <Link 
                  className={`nav-link ${isActiveRoute('/admin/orders') ? 'active' : ''}`} 
                  to="/admin/orders"
                >
                  <div className="sb-nav-link-icon"><i className="fas fa-shopping-cart"></i></div>
                  Заказы
                </Link>
                
                <div className="sb-sidenav-menu-heading">Пользователи</div>
                <Link 
                  className={`nav-link ${isActiveRoute('/admin/users') ? 'active' : ''}`} 
                  to="/admin/users"
                >
                  <div className="sb-nav-link-icon"><i className="fas fa-users"></i></div>
                  Пользователи
                </Link>
                
                <div className="sb-sidenav-menu-heading">Настройки</div>
                <Link 
                  className={`nav-link ${isActiveRoute('/admin/settings') ? 'active' : ''}`} 
                  to="/admin/settings"
                >
                  <div className="sb-nav-link-icon"><i className="fas fa-cog"></i></div>
                  Настройки сайта
                </Link>
              </div>
            </div>
            <div className="sb-sidenav-footer">
              <div className="small">Вы вошли как:</div>
              Администратор
            </div>
          </nav>
        </div>
        
        <div id="layoutSidenav_content">
          <main>
            <Outlet />
          </main>
          
          <footer className="py-4 bg-light mt-auto">
            <div className="container-fluid px-4">
              <div className="d-flex align-items-center justify-content-between small">
                <div className="text-muted">Copyright &copy; Ваш магазин 2025</div>
                <div>
                  <a href="#!">Политика конфиденциальности</a>
                  &middot;
                  <a href="#!">Условия использования</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
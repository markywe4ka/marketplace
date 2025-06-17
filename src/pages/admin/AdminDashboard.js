// src/pages/admin/AdminDashboard.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statsAPI, orderAPI, productAPI, userAPI } from '../../api';
import { toast } from 'react-toastify';

// Константы для статусов заказов
const ORDER_STATUSES = {
  Pending: { label: 'В ожидании', className: 'bg-warning text-dark' },
  Processing: { label: 'В обработке', className: 'bg-info text-white' },
  Shipped: { label: 'Отправлен', className: 'bg-primary' },
  Delivered: { label: 'Доставлен', className: 'bg-success' },
  Cancelled: { label: 'Отменен', className: 'bg-danger' },
};

function AdminDashboard() {
  const [statistics, setStatistics] = useState({
    productsCount: 0,
    productsIncrease: 0,
    ordersCount: 0,
    ordersIncrease: 0,
    usersCount: 0,
    usersIncrease: 0,
    totalRevenue: 0,
    revenueIncrease: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Попытка загрузить данные из API статистики
        try {
          // Получаем общую статистику
          const dashboardStats = await statsAPI.getDashboardStats();
          setStatistics({
            productsCount: dashboardStats.totalProducts || 0,
            productsIncrease: dashboardStats.productsIncrease || 0,
            ordersCount: dashboardStats.totalOrders || 0,
            ordersIncrease: dashboardStats.ordersIncrease || 0,
            usersCount: dashboardStats.totalUsers || 0,
            usersIncrease: dashboardStats.usersIncrease || 0,
            totalRevenue: dashboardStats.totalRevenue || 0,
            revenueIncrease: dashboardStats.revenueIncrease || 0,
          });
        } catch (statsError) {
          console.error('Ошибка при загрузке статистики:', statsError);
          
          // Если API статистики недоступен, пробуем собрать данные вручную
          try {
            const [productsRes, ordersRes, usersRes] = await Promise.all([
              productAPI.getProducts(1, 1), // Только для получения общего количества
              orderAPI.getOrders(1, 1),     // Только для получения общего количества
              userAPI.getUsers(1, 1)        // Только для получения общего количества
            ]);
            
            setStatistics({
              productsCount: productsRes.totalProducts || 0,
              productsIncrease: 0,
              ordersCount: ordersRes.totalOrders || 0,
              ordersIncrease: 0,
              usersCount: usersRes.totalUsers || 0,
              usersIncrease: 0,
              totalRevenue: ordersRes.totalRevenue || 0,
              revenueIncrease: 0,
            });
          } catch (fallbackError) {
            console.error('Ошибка при загрузке fallback данных:', fallbackError);
            setError('Не удалось загрузить статистику. Пожалуйста, проверьте подключение к серверу.');
          }
        }
        
        // Загрузка последних заказов
        try {
          const recentOrdersData = await statsAPI.getRecentOrders(5);
          setRecentOrders(recentOrdersData);
        } catch (ordersError) {
          console.error('Ошибка при загрузке последних заказов через statsAPI:', ordersError);
          try {
            const ordersRes = await orderAPI.getOrders(1, 5, { sort: '-createdAt' });
            setRecentOrders(ordersRes.orders || []);
          } catch (fallbackOrdersError) {
            console.error('Ошибка при загрузке последних заказов через orderAPI:', fallbackOrdersError);
            setRecentOrders([]);
          }
        }
        
        // Загрузка популярных товаров
        try {
          const popularProductsData = await statsAPI.getPopularProducts(5);
          setTopProducts(popularProductsData);
        } catch (productsError) {
          console.error('Ошибка при загрузке популярных товаров через statsAPI:', productsError);
          try {
            const productsRes = await productAPI.getProducts(1, 5, { sort: '-purchaseCount' });
            setTopProducts(productsRes.products || []);
          } catch (fallbackProductsError) {
            console.error('Ошибка при загрузке популярных товаров через productAPI:', fallbackProductsError);
            setTopProducts([]);
          }
        }
        
      } catch (error) {
        console.error('Ошибка при загрузке данных для дашборда:', error);
        toast.error('Не удалось загрузить данные дашборда');
        setError('Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const getStatusBadge = (status) => {
    const statusInfo = ORDER_STATUSES[status] || { label: 'Неизвестно', className: 'bg-secondary' };
    return <span className={`badge ${statusInfo.className}`}>{statusInfo.label}</span>;
  };
  
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
        <p className="mt-3">Загрузка данных дашборда...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }
  
  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Панель управления</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item active">Дашборд</li>
      </ol>
      
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6">
          <div className="card bg-primary text-white mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small">Товары</div>
                  <div className="fs-3 fw-bold">{statistics.productsCount}</div>
                </div>
                <div>
                  <i className="fas fa-box fa-2x"></i>
                </div>
              </div>
            </div>
            <div className="card-footer d-flex align-items-center justify-content-between">
              <Link to="/admin/products" className="small text-white stretched-link">
                Подробнее
              </Link>
              <div className="small text-white">
                <i className="fas fa-angle-right"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-md-6">
          <div className="card bg-success text-white mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small">Заказы</div>
                  <div className="fs-3 fw-bold">{statistics.ordersCount}</div>
                </div>
                <div>
                  <i className="fas fa-shopping-cart fa-2x"></i>
                </div>
              </div>
            </div>
            <div className="card-footer d-flex align-items-center justify-content-between">
              <Link to="/admin/orders" className="small text-white stretched-link">
                Подробнее
              </Link>
              <div className="small text-white">
                <i className="fas fa-angle-right"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-md-6">
          <div className="card bg-warning text-white mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small">Пользователи</div>
                  <div className="fs-3 fw-bold">{statistics.usersCount}</div>
                </div>
                <div>
                  <i className="fas fa-users fa-2x"></i>
                </div>
              </div>
            </div>
            <div className="card-footer d-flex align-items-center justify-content-between">
              <Link to="/admin/users" className="small text-white stretched-link">
                Подробнее
              </Link>
              <div className="small text-white">
                <i className="fas fa-angle-right"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-md-6">
          <div className="card bg-info text-white mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small">Доход</div>
                  <div className="fs-3 fw-bold">
                    {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(statistics.totalRevenue)}
                  </div>
                </div>
                <div>
                  <i className="fas fa-ruble-sign fa-2x"></i>
                </div>
              </div>
            </div>
            <div className="card-footer d-flex align-items-center justify-content-between">
              <Link to="/admin/orders" className="small text-white stretched-link">
                Подробнее
              </Link>
              <div className="small text-white">
                <i className="fas fa-angle-right"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-lg-6">
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div>
                <i className="fas fa-shopping-cart me-1"></i>
                Последние заказы
              </div>
              <Link to="/admin/orders" className="btn btn-sm btn-primary">
                Все заказы
              </Link>
            </div>
            <div className="card-body">
              {recentOrders.length === 0 ? (
                <p className="text-center text-muted my-3">Нет данных о заказах</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Покупатель</th>
                        <th>Дата</th>
                        <th>Сумма</th>
                        <th>Статус</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(order => (
                        <tr key={order._id}>
                          <td>
                            <Link to={`/admin/orders/${order._id}`}>
                              #{order._id.slice(-5)}
                            </Link>
                          </td>
                          <td>{order.shippingAddress?.fullName || order.user?.name || 'Н/Д'}</td>
                          <td>
                            {new Date(order.createdAt).toLocaleDateString('ru-RU', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td>
                            {new Intl.NumberFormat('ru-RU', { 
                              style: 'currency', 
                              currency: 'RUB',
                              minimumFractionDigits: 0
                            }).format(order.totalPrice)}
                          </td>
                          <td>
                            {getStatusBadge(order.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-lg-6">
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div>
                <i className="fas fa-star me-1"></i>
                Популярные товары
              </div>
              <Link to="/admin/products" className="btn btn-sm btn-primary">
                Все товары
              </Link>
            </div>
            <div className="card-body">
              {topProducts.length === 0 ? (
                <p className="text-center text-muted my-3">Нет данных о популярных товарах</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th style={{ width: '60px' }}>Фото</th>
                        <th>Название</th>
                        <th>Цена</th>
                        <th>Просмотры</th>
                        <th>Продажи</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProducts.map(product => (
                        <tr key={product._id}>
                          <td>
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="img-thumbnail"
                              style={{ maxWidth: '40px', maxHeight: '40px' }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/40?text=Нет+фото';
                              }}
                            />
                          </td>
                          <td>
                            <Link to={`/admin/products/edit/${product._id}`}>
                              {product.name}
                            </Link>
                          </td>
                          <td>
                            {new Intl.NumberFormat('ru-RU', { 
                              style: 'currency', 
                              currency: 'RUB',
                              minimumFractionDigits: 0
                            }).format(product.price)}
                          </td>
                          <td>{product.views || 0}</td>
                          <td>{product.purchaseCount || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Информационные карты */}
      <div className="row">
        <div className="col-lg-6">
          <div className="card mb-4">
            <div className="card-header">
              <i className="fas fa-info-circle me-1"></i>
              Быстрые действия
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <Link to="/admin/products/new" className="btn btn-primary w-100">
                    <i className="fas fa-plus me-2"></i> Добавить товар
                  </Link>
                </div>
                <div className="col-md-6">
                  <Link to="/admin/orders" className="btn btn-success w-100">
                    <i className="fas fa-clipboard-list me-2"></i> Проверить заказы
                  </Link>
                </div>
                <div className="col-md-6">
                  <Link to="/admin/users" className="btn btn-info text-white w-100">
                    <i className="fas fa-user-plus me-2"></i> Управление пользователями
                  </Link>
                </div>
                <div className="col-md-6">
                  <Link to="/admin/categories" className="btn btn-secondary w-100">
                    <i className="fas fa-list me-2"></i> Управление категориями
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-6">
          <div className="card mb-4">
            <div className="card-header">
              <i className="fas fa-bullhorn me-1"></i>
              Информация
            </div>
            <div className="card-body">
              <div className="alert alert-info mb-0">
                <h5 className="alert-heading">Добро пожаловать в панель администратора!</h5>
                <p>Здесь вы можете управлять товарами, заказами и пользователями вашего интернет-магазина.</p>
                <hr />
                <p className="mb-0">Для получения подробной информации и инструкций по использованию админ-панели обратитесь к документации.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
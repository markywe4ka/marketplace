// Создайте новый файл AdminAnalytics.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statsAPI } from '../../api';
import { toast } from 'react-toastify';

const AdminAnalytics = () => {
  const [period, setPeriod] = useState('month');
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await statsAPI.getSalesData(period);
        setStatsData(data);
        setLoading(false);
      } catch (err) {
        console.error('Ошибка при загрузке статистики:', err);
        setError('Не удалось загрузить данные статистики');
        setLoading(false);
        toast.error('Ошибка при загрузке данных статистики');
      }
    };

    fetchStats();
  }, [period]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
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
      <h1 className="mt-4">Аналитика продаж</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link to="/admin">Панель администратора</Link>
        </li>
        <li className="breadcrumb-item active">Аналитика</li>
      </ol>
      
      <div className="card mb-4">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <i className="fas fa-chart-line me-1"></i>
              Статистика продаж
            </div>
            <div>
              <select 
                className="form-select form-select-sm" 
                value={period} 
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="week">За неделю</option>
                <option value="month">За месяц</option>
                <option value="quarter">За квартал</option>
                <option value="year">За год</option>
              </select>
            </div>
          </div>
        </div>
        <div className="card-body">
          {statsData && (
            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="card bg-primary text-white h-100">
                  <div className="card-body">
                    <h5 className="card-title">Общий доход</h5>
                    <h2 className="display-4">{statsData.totalRevenue.toLocaleString()} ₽</h2>
                  </div>
                  <div className="card-footer d-flex align-items-center justify-content-between">
                    <div className="small text-white">
                      {statsData.revenueChange > 0 ? (
                        <span className="text-success">
                          <i className="fas fa-arrow-up me-1"></i>
                          {statsData.revenueChange}% по сравнению с предыдущим периодом
                        </span>
                      ) : (
                        <span className="text-danger">
                          <i className="fas fa-arrow-down me-1"></i>
                          {Math.abs(statsData.revenueChange)}% по сравнению с предыдущим периодом
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 mb-4">
                <div className="card bg-success text-white h-100">
                  <div className="card-body">
                    <h5 className="card-title">Количество заказов</h5>
                    <h2 className="display-4">{statsData.orderCount}</h2>
                  </div>
                  <div className="card-footer d-flex align-items-center justify-content-between">
                    <div className="small text-white">
                      {statsData.orderChange > 0 ? (
                        <span>
                          <i className="fas fa-arrow-up me-1"></i>
                          {statsData.orderChange}% по сравнению с предыдущим периодом
                        </span>
                      ) : (
                        <span>
                          <i className="fas fa-arrow-down me-1"></i>
                          {Math.abs(statsData.orderChange)}% по сравнению с предыдущим периодом
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 mb-4">
                <div className="card bg-info text-white h-100">
                  <div className="card-body">
                    <h5 className="card-title">Средний чек</h5>
                    <h2 className="display-4">{statsData.averageOrderValue.toLocaleString()} ₽</h2>
                  </div>
                  <div className="card-footer d-flex align-items-center justify-content-between">
                    <div className="small text-white">
                      {statsData.aovChange > 0 ? (
                        <span>
                          <i className="fas fa-arrow-up me-1"></i>
                          {statsData.aovChange}% по сравнению с предыдущим периодом
                        </span>
                      ) : (
                        <span>
                          <i className="fas fa-arrow-down me-1"></i>
                          {Math.abs(statsData.aovChange)}% по сравнению с предыдущим периодом
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 mb-4">
                <div className="card bg-warning text-white h-100">
                  <div className="card-body">
                    <h5 className="card-title">Новые пользователи</h5>
                    <h2 className="display-4">{statsData.newUsers}</h2>
                  </div>
                  <div className="card-footer d-flex align-items-center justify-content-between">
                    <div className="small text-white">
                      {statsData.userChange > 0 ? (
                        <span>
                          <i className="fas fa-arrow-up me-1"></i>
                          {statsData.userChange}% по сравнению с предыдущим периодом
                        </span>
                      ) : (
                        <span>
                          <i className="fas fa-arrow-down me-1"></i>
                          {Math.abs(statsData.userChange)}% по сравнению с предыдущим периодом
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="row">
            <div className="col-md-6">
              <div className="card mb-4">
                <div className="card-header">
                  <i className="fas fa-chart-pie me-1"></i>
                  Продажи по категориям
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Категория</th>
                          <th>Продажи</th>
                          <th>Доля</th>
                        </tr>
                      </thead>
                      <tbody>
                        {statsData && statsData.categoryStats.map((category, index) => (
                          <tr key={index}>
                            <td>{category.name}</td>
                            <td>{category.sales.toLocaleString()} ₽</td>
                            <td>{category.percentage}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="card mb-4">
                <div className="card-header">
                  <i className="fas fa-chart-line me-1"></i>
                  Тренды продаж
                </div>
                <div className="card-body">
                  <div className="alert alert-info">
                    Здесь будет график продаж по дням. 
                    Для полноценной визуализации можно использовать Chart.js или Recharts.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
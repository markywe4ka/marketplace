// src/pages/admin/AdminUsers.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Имитация загрузки пользователей
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Имитация запроса к API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Тестовые данные пользователей
        const dummyUsers = [
          {
            _id: '1',
            name: 'Администратор',
            email: 'admin@example.com',
            role: 'admin',
            createdAt: '2023-05-01T10:00:00',
            lastLogin: '2023-06-15T09:30:00',
            ordersCount: 0
          },
          {
            _id: '2',
            name: 'Иванов Иван',
            email: 'ivanov@example.com',
            role: 'user',
            createdAt: '2023-05-10T15:20:00',
            lastLogin: '2023-06-15T11:45:00',
            ordersCount: 3
          },
          {
            _id: '3',
            name: 'Петров Петр',
            email: 'petrov@example.com',
            role: 'user',
            createdAt: '2023-05-15T09:10:00',
            lastLogin: '2023-06-14T16:20:00',
            ordersCount: 1
          },
          {
            _id: '4',
            name: 'Сидоров Алексей',
            email: 'sidorov@example.com',
            role: 'user',
            createdAt: '2023-05-20T14:30:00',
            lastLogin: '2023-06-13T18:15:00',
            ordersCount: 2
          },
          {
            _id: '5',
            name: 'Смирнова Анна',
            email: 'smirnova@example.com',
            role: 'user',
            createdAt: '2023-05-25T11:45:00',
            lastLogin: '2023-06-12T12:30:00',
            ordersCount: 5
          }
        ];
        
        setUsers(dummyUsers);
      } catch (err) {
        console.error('Ошибка загрузки пользователей:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  const handleDeleteUser = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      // В реальном приложении здесь будет запрос к API
      setUsers(users.filter(user => user._id !== id));
    }
  };
  
  const handleToggleAdmin = (id) => {
    // В реальном приложении здесь будет запрос к API
    setUsers(users.map(user => {
      if (user._id === id) {
        return {
          ...user,
          role: user.role === 'admin' ? 'user' : 'admin'
        };
      }
      return user;
    }));
  };
  
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
        <p className="mt-3">Загрузка пользователей...</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Управление пользователями</h2>
        <button className="btn btn-primary">
          <i className="bi bi-person-plus me-1"></i> Добавить пользователя
        </button>
      </div>
      
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Имя</th>
                  <th>Email</th>
                  <th>Роль</th>
                  <th>Дата регистрации</th>
                  <th>Заказы</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.role === 'admin' ? (
                        <span className="badge bg-danger">Администратор</span>
                      ) : (
                        <span className="badge bg-secondary">Пользователь</span>
                      )}
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      {user.ordersCount > 0 ? (
                        <Link to={`/admin/orders?user=${user._id}`}>
                          {user.ordersCount} {user.ordersCount === 1 ? 'заказ' : 
                           user.ordersCount < 5 ? 'заказа' : 'заказов'}
                        </Link>
                      ) : (
                        <span className="text-muted">Нет заказов</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button 
                          className="btn btn-outline-primary"
                          onClick={() => handleToggleAdmin(user._id)}
                          title={user.role === 'admin' ? "Снять права администратора" : "Сделать администратором"}
                        >
                          <i className={`bi ${user.role === 'admin' ? 'bi-person' : 'bi-person-fill-gear'}`}></i>
                        </button>
                        <button 
                          className="btn btn-outline-danger"
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={user._id === '1'} // Запрещаем удаление главного админа
                          title="Удалить пользователя"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminUsers;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    // Имитация загрузки заказов
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Имитация запроса к API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Тестовые данные заказов
        const dummyOrders = [
          {
            _id: '101',
            user: { name: 'Иванов Иван', email: 'ivanov@example.com' },
            createdAt: '2023-06-15T10:30:00',
            totalPrice: 38998,
            isPaid: true,
            paidAt: '2023-06-15T11:30:00',
            isDelivered: false,
            status: 'processing'
          },
          {
            _id: '102',
            user: { name: 'Петров Петр', email: 'petrov@example.com' },
            createdAt: '2023-06-14T14:15:00',
            totalPrice: 59999,
            isPaid: true,
            paidAt: '2023-06-14T14:30:00',
            isDelivered: true,
            deliveredAt: '2023-06-16T12:00:00',
            status: 'delivered'
          },
          {
            _id: '103',
            user: { name: 'Сидоров Алексей', email: 'sidorov@example.com' },
            createdAt: '2023-06-13T09:45:00',
            totalPrice: 12999,
            isPaid: false,
            isDelivered: false,
            status: 'processing'
          },
          {
            _id: '104',
            user: { name: 'Смирнова Анна', email: 'smirnova@example.com' },
            createdAt: '2023-06-12T16:20:00',
            totalPrice: 24999,
           isPaid: true,
           paidAt: '2023-06-12T16:35:00',
           isDelivered: true,
           deliveredAt: '2023-06-15T14:30:00',
           status: 'delivered'
         },
         {
           _id: '105',
           user: { name: 'Козлов Кирилл', email: 'kozlov@example.com' },
           createdAt: '2023-06-11T11:10:00',
           totalPrice: 8999,
           isPaid: true,
           paidAt: '2023-06-11T11:25:00',
           isDelivered: false,
           status: 'shipped'
         }
       ];
       
       setOrders(dummyOrders);
     } catch (err) {
       console.error('Ошибка загрузки заказов:', err);
     } finally {
       setLoading(false);
     }
   };
   
   fetchOrders();
 }, []);
 
 // Фильтрация заказов
 const filteredOrders = () => {
   switch(filter) {
     case 'processing':
       return orders.filter(order => order.status === 'processing');
     case 'shipped':
       return orders.filter(order => order.status === 'shipped');
     case 'delivered':
       return orders.filter(order => order.status === 'delivered');
     case 'unpaid':
       return orders.filter(order => !order.isPaid);
     default:
       return orders;
   }
 };
 
 const getStatusBadge = (status) => {
   const statusMap = {
     processing: <span className="badge bg-warning text-dark">В обработке</span>,
     shipped: <span className="badge bg-info">Отправлен</span>,
     delivered: <span className="badge bg-success">Доставлен</span>,
     cancelled: <span className="badge bg-danger">Отменен</span>
   };
   
   return statusMap[status] || <span className="badge bg-secondary">Неизвестно</span>;
 };
 
 if (loading) {
   return (
     <div className="text-center py-5">
       <div className="spinner-border text-primary" role="status">
         <span className="visually-hidden">Загрузка...</span>
       </div>
       <p className="mt-3">Загрузка заказов...</p>
     </div>
   );
 }
 
 return (
   <>
     <div className="d-flex justify-content-between align-items-center mb-4">
       <h2>Управление заказами</h2>
       <div className="btn-group">
         <button
           type="button"
           className={`btn btn-outline-primary ${filter === 'all' ? 'active' : ''}`}
           onClick={() => setFilter('all')}
         >
           Все
         </button>
         <button
           type="button"
           className={`btn btn-outline-primary ${filter === 'processing' ? 'active' : ''}`}
           onClick={() => setFilter('processing')}
         >
           В обработке
         </button>
         <button
           type="button"
           className={`btn btn-outline-primary ${filter === 'shipped' ? 'active' : ''}`}
           onClick={() => setFilter('shipped')}
         >
           Отправленные
         </button>
         <button
           type="button"
           className={`btn btn-outline-primary ${filter === 'delivered' ? 'active' : ''}`}
           onClick={() => setFilter('delivered')}
         >
           Доставленные
         </button>
         <button
           type="button"
           className={`btn btn-outline-primary ${filter === 'unpaid' ? 'active' : ''}`}
           onClick={() => setFilter('unpaid')}
         >
           Неоплаченные
         </button>
       </div>
     </div>
     
     <div className="card">
       <div className="card-body">
         {filteredOrders().length === 0 ? (
           <div className="text-center py-4">
             <p>Нет заказов, соответствующих выбранному фильтру.</p>
           </div>
         ) : (
           <div className="table-responsive">
             <table className="table table-hover">
               <thead>
                 <tr>
                   <th>ID</th>
                   <th>Клиент</th>
                   <th>Дата</th>
                   <th>Сумма</th>
                   <th>Оплачен</th>
                   <th>Статус</th>
                   <th>Действия</th>
                 </tr>
               </thead>
               <tbody>
                 {filteredOrders().map(order => (
                   <tr key={order._id}>
                     <td>{order._id}</td>
                     <td>
                       <div>{order.user.name}</div>
                       <small className="text-muted">{order.user.email}</small>
                     </td>
                     <td>{new Date(order.createdAt).toLocaleString()}</td>
                     <td>{order.totalPrice.toLocaleString()} ₽</td>
                     <td>
                       {order.isPaid ? (
                         <span className="badge bg-success">Да</span>
                       ) : (
                         <span className="badge bg-danger">Нет</span>
                       )}
                     </td>
                     <td>{getStatusBadge(order.status)}</td>
                     <td>
                       <div className="btn-group btn-group-sm">
                         <Link to={`/order/${order._id}`} className="btn btn-outline-primary">
                           <i className="bi bi-eye"></i>
                         </Link>
                         <button className="btn btn-outline-success">
                           <i className="bi bi-truck"></i>
                         </button>
                         <button className="btn btn-outline-danger">
                           <i className="bi bi-x-circle"></i>
                         </button>
                       </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         )}
       </div>
     </div>
     
     <div className="d-flex justify-content-center mt-4">
       <nav aria-label="Page navigation example">
         <ul className="pagination">
           <li className="page-item disabled">
             <button className="page-link" type="button" tabIndex="-1" disabled>Предыдущая</button>
           </li>
           <li className="page-item active"><button className="page-link" type="button">1</button></li>
           <li className="page-item"><button className="page-link" type="button">2</button></li>
           <li className="page-item"><button className="page-link" type="button">3</button></li>
           <li className="page-item">
             <button className="page-link" type="button">Следующая</button>
           </li>
         </ul>
       </nav>
     </div>
   </>
 );
}

export default AdminOrders;
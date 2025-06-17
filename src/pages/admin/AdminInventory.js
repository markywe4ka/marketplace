// Создайте новый файл AdminInventory.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../../api';
import { toast } from 'react-toastify';

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStock, setEditingStock] = useState({});
  const [updateLoading, setUpdateLoading] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProducts(1, 100); // Увеличиваем лимит для инвентаризации
      setProducts(response.products);
      
      // Инициализируем состояние редактирования для каждого товара
      const initialEditingStock = {};
      response.products.forEach(product => {
        initialEditingStock[product._id] = product.stock || 0;
      });
      setEditingStock(initialEditingStock);
      
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при загрузке товаров:', error);
      toast.error('Не удалось загрузить товары');
      setLoading(false);
    }
  };

  const handleUpdateStock = async (productId) => {
    try {
      setUpdateLoading(prev => ({ ...prev, [productId]: true }));
      
      // Отправка только обновленного значения остатка
      await productAPI.updateProduct(productId, { 
        stock: editingStock[productId],
        inStock: editingStock[productId] > 0
      });
      
      toast.success('Остаток успешно обновлен');
      
      // Обновляем локальные данные
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product._id === productId 
            ? { 
                ...product, 
                stock: editingStock[productId],
                inStock: editingStock[productId] > 0 
              } 
            : product
        )
      );
      
      setUpdateLoading(prev => ({ ...prev, [productId]: false }));
    } catch (error) {
      console.error('Ошибка при обновлении остатка:', error);
      toast.error('Не удалось обновить остаток');
      setUpdateLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Управление остатками</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link to="/admin">Панель администратора</Link>
        </li>
        <li className="breadcrumb-item active">Остатки товаров</li>
      </ol>
      
      <div className="card mb-4">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <i className="fas fa-cubes me-1"></i>
              Инвентаризация
            </div>
            <div className="d-flex align-items-center">
              <input
                type="text"
                className="form-control form-control-sm me-2"
                placeholder="Поиск товаров..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button 
                className="btn btn-sm btn-outline-primary"
                onClick={fetchProducts}
              >
                <i className="fas fa-sync-alt"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Загрузка...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Фото</th>
                    <th>Название</th>
                    <th>Артикул</th>
                    <th>Категория</th>
                    <th>Цена</th>
                    <th>В наличии</th>
                    <th>Остаток</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center">
                        Товары не найдены
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map(product => (
                      <tr key={product._id}>
                        <td>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="img-thumbnail"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
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
                          {product.sku || '-'}
                        </td>
                        <td>{product.category}</td>
                        <td>{product.price.toLocaleString()} ₽</td>
                        <td>
                          <span className={`badge ${product.inStock ? 'bg-success' : 'bg-danger'}`}>
                            {product.inStock ? 'Да' : 'Нет'}
                          </span>
                        </td>
                        <td>
                          <div className="input-group input-group-sm">
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              value={editingStock[product._id]}
                              onChange={(e) => setEditingStock({
                                ...editingStock,
                                [product._id]: parseInt(e.target.value) || 0
                              })}
                              min="0"
                            />
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => handleUpdateStock(product._id)}
                              disabled={updateLoading[product._id]}
                            >
                              {updateLoading[product._id] ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                              ) : (
                                <i className="fas fa-save"></i>
                              )}
                            </button>
                          </div>
                        </td>
                        <td>
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="btn btn-sm btn-outline-secondary"
                          >
                            <i className="fas fa-edit"></i>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      <div className="row">
        <div className="col-lg-6">
          <div className="card mb-4">
            <div className="card-header">
              <i className="fas fa-exclamation-triangle me-1"></i>
              Товары с низким остатком
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Товар</th>
                      <th>Остаток</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .filter(product => product.stock !== undefined && product.stock <= 5 && product.stock > 0)
                      .slice(0, 5)
                      .map(product => (
                        <tr key={`low-${product._id}`}>
                          <td>{product.name}</td>
                          <td>
                            <span className="badge bg-warning text-dark">
                              {product.stock}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <Link
                                to={`/admin/products/edit/${product._id}`}
                                className="btn btn-sm btn-outline-primary"
                              >
                                <i className="fas fa-edit"></i>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {products.filter(product => product.stock !== undefined && product.stock <= 5 && product.stock > 0).length === 0 && (
                      <tr>
                        <td colSpan="3" className="text-center text-muted">
                          Все товары имеют достаточное количество на складе
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-6">
          <div className="card mb-4">
            <div className="card-header">
              <i className="fas fa-box-open me-1"></i>
              Отсутствующие товары
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Товар</th>
                      <th>Цена</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .filter(product => !product.inStock || product.stock === 0)
                      .slice(0, 5)
                      .map(product => (
                        <tr key={`out-${product._id}`}>
                          <td>{product.name}</td>
                          <td>{product.price.toLocaleString()} ₽</td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-sm btn-outline-success"
                                onClick={() => {
                                  setEditingStock({
                                    ...editingStock,
                                    [product._id]: 10
                                  });
                                  handleUpdateStock(product._id);
                                }}
                              >
                                <i className="fas fa-plus me-1"></i> Пополнить (10)
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    {products.filter(product => !product.inStock || product.stock === 0).length === 0 && (
                      <tr>
                        <td colSpan="3" className="text-center text-muted">
                          Все товары есть в наличии
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInventory;
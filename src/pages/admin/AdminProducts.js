import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { productAPI } from '../../api';

const AdminProducts = () => {
  // Состояния для данных
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  
  // Состояния для UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Состояния для фильтрации
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [stockFilter, setStockFilter] = useState('');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [brandFilter, setBrandFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  
  const navigate = useNavigate();

  // Один общий useEffect для загрузки данных
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage, searchTerm, categoryFilter, brandFilter, tagFilter, stockFilter, sortBy, priceRange]);

  // Функция для загрузки товаров с учетом всех фильтров
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Подготавливаем фильтры для запроса
      const filters = {
        search: searchTerm,
        category: categoryFilter,
        brand: brandFilter,
        tag: tagFilter,
        inStock: stockFilter,
        sort: sortBy
      };
      
      // Добавляем диапазон цен, если указан
      if (priceRange.min) filters.minPrice = priceRange.min;
      if (priceRange.max) filters.maxPrice = priceRange.max;
      
      // Делаем запрос к API
      const response = await productAPI.getProducts(currentPage, 10, filters);
      
      // Обновляем состояние
      setProducts(response.products);
      setTotalPages(response.pages);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Ошибка при загрузке товаров. Пожалуйста, попробуйте позже.');
      setLoading(false);
      toast.error('Ошибка при загрузке товаров');
    }
  };

  // Функция для загрузки категорий
  const fetchCategories = async () => {
    try {
      const categoriesData = await productAPI.getCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Функция для удаления товара
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      try {
        await productAPI.deleteProduct(id);
        // Обновляем список после удаления
        fetchProducts();
        toast.success('Товар успешно удален');
      } catch (err) {
        console.error('Error deleting product:', err);
        toast.error('Ошибка при удалении товара');
      }
    }
  };

  // Функция для изменения страницы
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Функция для обработки поиска
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Сбрасываем на первую страницу при новом поиске
  };

  // Функция для сброса фильтров
  const handleResetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setBrandFilter('');
    setTagFilter('');
    setStockFilter('');
    setSortBy('-createdAt');
    setPriceRange({ min: '', max: '' });
    setCurrentPage(1);
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Управление товарами</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item">
          <Link to="/admin">Панель администратора</Link>
        </li>
        <li className="breadcrumb-item active">Товары</li>
      </ol>
      
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <i className="fas fa-table me-1"></i>
            Список товаров
          </div>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/admin/products/new')}
          >
            <i className="fas fa-plus me-1"></i> Добавить товар
          </button>
        </div>
        <div className="card-body">
          {/* Фильтры и поиск */}
          <div className="row mb-3">
            <div className="col-md-6">
              <form onSubmit={handleSearch}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Поиск товаров..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="btn btn-outline-secondary" type="submit">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </form>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Все категории</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={handleResetFilters}
              >
                Сбросить
              </button>
            </div>
          </div>
          
          {/* Расширенные фильтры - можно добавить UI для них */}
          {/* <div className="row mb-4">
            <div className="col-md-3 mb-2">
              <label className="form-label">Сортировать по</label>
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="-createdAt">Новые сначала</option>
                <option value="createdAt">Старые сначала</option>
                <option value="-price">Цена (высокая-низкая)</option>
                <option value="price">Цена (низкая-высокая)</option>
                <option value="-purchaseCount">Популярные сначала</option>
                <option value="-rating">Рейтинг (высокий-низкий)</option>
              </select>
            </div>
            
            <div className="col-md-3 mb-2">
              <label className="form-label">Наличие</label>
              <select
                className="form-select"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
              >
                <option value="">Все товары</option>
                <option value="true">В наличии</option>
                <option value="false">Отсутствуют</option>
              </select>
            </div>
            
            <div className="col-md-6 mb-2">
              <label className="form-label">Цена</label>
              <div className="d-flex">
                <input
                  type="number"
                  className="form-control me-2"
                  placeholder="От"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                />
                <input
                  type="number"
                  className="form-control"
                  placeholder="До"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                />
              </div>
            </div>
          </div> */}

          {/* Таблица с товарами */}
          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Загрузка...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th style={{ width: '70px' }}>ID</th>
                      <th style={{ width: '80px' }}>Фото</th>
                      <th>Название</th>
                      <th>Категория</th>
                      <th>Цена</th>
                      <th>Статус</th>
                      <th style={{ width: '150px' }}>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center">
                          Товары не найдены
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product._id}>
                          <td>{product._id.slice(-5)}</td>
                          <td>
                            <img
                              src={product.image}
                              alt={product.name}
                              className="img-thumbnail"
                              style={{ maxWidth: '50px' }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/50?text=No+Image';
                              }}
                            />
                          </td>
                          <td>{product.name}</td>
                          <td>{product.category}</td>
                          <td>{product.price.toLocaleString()} ₽</td>
                          <td>
                            {product.inStock ? (
                              <span className="badge bg-success">В наличии</span>
                            ) : (
                              <span className="badge bg-danger">Нет в наличии</span>
                            )}
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <Link
                                to={`/admin/products/edit/${product._id}`}
                                className="btn btn-sm btn-outline-primary"
                                title="Редактировать"
                              >
                                <i className="fas fa-edit"></i>
                              </Link>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteProduct(product._id)}
                                title="Удалить"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                              <Link
                                to={`/product/${product._id}`}
                                target="_blank"
                                className="btn btn-sm btn-outline-info"
                                title="Просмотр"
                              >
                                <i className="fas fa-eye"></i>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Пагинация */}
              {totalPages > 1 && (
                <nav aria-label="Page navigation">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Предыдущая
                      </button>
                    </li>
                    
                    {[...Array(totalPages).keys()].map((page) => (
                      <li
                        key={page + 1}
                        className={`page-item ${currentPage === page + 1 ? 'active' : ''}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(page + 1)}
                        >
                          {page + 1}
                        </button>
                      </li>
                    ))}
                    
                    <li
                      className={`page-item ${
                        currentPage === totalPages ? 'disabled' : ''
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Следующая
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
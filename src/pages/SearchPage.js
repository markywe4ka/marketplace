import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import '../styles/SearchPage.css';

const SearchPage = () => {
  // Получаем параметры из URL
  const [searchParams] = useSearchParams();
  const { slug } = useParams();
  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  
  // Состояние поиска
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  
  // Состояние фильтрации
  const [filters, setFilters] = useState({
    category: categoryParam || 'all',
    priceRange: [0, 20000],
    colors: [],
    sizes: [],
    sortBy: 'newest'
  });
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Доступ к контексту корзины 
  const cartContext = useContext(useCart);
  const { addToCart } = cartContext || {};
  
  // Список цветов для фильтрации
  const colorOptions = [
    { name: 'Черный', code: '#000000' },
    { name: 'Белый', code: '#FFFFFF' },
    { name: 'Серый', code: '#808080' },
    { name: 'Бежевый', code: '#F5F5DC' },
    { name: 'Синий', code: '#0000FF' },
    { name: 'Красный', code: '#FF0000' },
    { name: 'Зеленый', code: '#008000' },
    { name: 'Коричневый', code: '#964B00' }
  ];
  
  // Список размеров для фильтрации
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
  
  // Варианты сортировки
  const sortOptions = [
    { value: 'newest', label: 'Сначала новые' },
    { value: 'price-asc', label: 'Цена: от низкой к высокой' },
    { value: 'price-desc', label: 'Цена: от высокой к низкой' },
    { value: 'name-asc', label: 'Название: А-Я' },
    { value: 'name-desc', label: 'Название: Я-А' }
  ];
  
  // Загрузка категорий
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await api.categories.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
        setCategories([]);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Определение заголовка страницы
  useEffect(() => {
    if (slug) {
      // Если это страница категории по slug
      const fetchCategoryName = async () => {
        try {
          const categoryData = await api.categories.getCategoryBySlug(slug);
          setCategoryName(categoryData.name);
        } catch (error) {
          console.error('Ошибка при загрузке категории:', error);
          setCategoryName(slug.charAt(0).toUpperCase() + slug.slice(1));
        }
      };
      
      fetchCategoryName();
    } else if (query) {
      // Если это поиск по запросу
      setCategoryName(`Результаты поиска: "${query}"`);
    } else if (categoryParam) {
      // Если это поиск по категории из параметров
      const category = categories.find(cat => cat.id === categoryParam || cat.slug === categoryParam);
      setCategoryName(category ? category.name : 'Результаты поиска');
    } else {
      // По умолчанию
      setCategoryName('Все товары');
    }
  }, [slug, query, categoryParam, categories]);
  
  // Загрузка товаров
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Формируем параметры запроса
        const params = {
          page: currentPage,
          limit: 12, // Товаров на странице
          sort: filters.sortBy,
          ...(filters.category !== 'all' && { category: filters.category }),
          ...(filters.sizes.length > 0 && { sizes: filters.sizes.join(',') }),
          ...(filters.colors.length > 0 && { colors: filters.colors.join(',') }),
          ...(filters.priceRange[0] > 0 && { minPrice: filters.priceRange[0] }),
          ...(filters.priceRange[1] < 20000 && { maxPrice: filters.priceRange[1] })
        };
        
        let response;
        
        try {
          if (query) {
            // Поиск по запросу
            response = await api.products.searchProducts(query, params);
          } else if (slug) {
            // Поиск по категории из URL
            response = await api.categories.getProductsByCategory(slug, params);
          } else {
            // Общий поиск с фильтрами
            response = await api.products.getProducts(params);
          }
          
          setProducts(response.products || []);
          setTotalResults(response.total || 0);
          setTotalPages(response.pages || 1);
        } catch (apiError) {
          console.error('Ошибка API при поиске товаров:', apiError);
          
          // Если API недоступно, используем локальные данные
          console.log('Используем локальные данные для поиска');
          
          // Загружаем товары из localStorage
          const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
          const storedMensProducts = JSON.parse(localStorage.getItem('mens_products') || '[]');
          const allProducts = [...storedProducts, ...storedMensProducts];
          
          // Применяем фильтры
          let filteredProducts = allProducts;
          
          // По запросу
          if (query) {
            const searchLower = query.toLowerCase();
            filteredProducts = filteredProducts.filter(product => 
              product.name.toLowerCase().includes(searchLower) || 
              product.description.toLowerCase().includes(searchLower) ||
              product.category.toLowerCase().includes(searchLower)
            );
          }
          
          // По категории
          if (slug) {
            filteredProducts = filteredProducts.filter(product => 
              product.category.toLowerCase() === slug.toLowerCase()
            );
          }
          
          if (filters.category !== 'all') {
            filteredProducts = filteredProducts.filter(product => 
              product.category === filters.category
            );
          }
          
          // По цене
          if (filters.priceRange[0] > 0 || filters.priceRange[1] < 20000) {
            filteredProducts = filteredProducts.filter(product => 
              product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
            );
          }
          
          // По цвету
          if (filters.colors.length > 0) {
            filteredProducts = filteredProducts.filter(product => {
              const productColorCodes = product.colors.map(color => color.code);
              return filters.colors.some(color => productColorCodes.includes(color));
            });
          }
          
          // По размеру
          if (filters.sizes.length > 0) {
            filteredProducts = filteredProducts.filter(product => 
              filters.sizes.some(size => product.sizes.includes(size))
            );
          }
          
          // Сортировка
          switch(filters.sortBy) {
            case 'price-asc':
              filteredProducts.sort((a, b) => a.price - b.price);
              break;
            case 'price-desc':
              filteredProducts.sort((a, b) => b.price - a.price);
              break;
            case 'name-asc':
              filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
              break;
            case 'name-desc':
              filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
              break;
            case 'newest':
            default:
              filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
              break;
          }
          
          // Пагинация
          const startIndex = (currentPage - 1) * 12;
          const paginatedProducts = filteredProducts.slice(startIndex, startIndex + 12);
          
          setProducts(paginatedProducts);
          setTotalResults(filteredProducts.length);
          setTotalPages(Math.ceil(filteredProducts.length / 12));
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Ошибка при поиске товаров:', err);
        setError('Не удалось загрузить результаты поиска. Пожалуйста, попробуйте позже.');
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [query, slug, filters, currentPage]);
  
  // Обработчик изменения страницы пагинации
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Обработчик переключения фильтра
  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };
  
  // Обработчик изменения фильтров
  const updateFilter = (type, value) => {
    if (type === 'category') {
      setFilters(prev => ({ ...prev, category: value }));
      setCurrentPage(1);
    } 
    else if (type === 'color') {
      setFilters(prev => {
        const updatedColors = prev.colors.includes(value)
          ? prev.colors.filter(color => color !== value)
          : [...prev.colors, value];
        return { ...prev, colors: updatedColors };
      });
      setCurrentPage(1);
    } 
    else if (type === 'size') {
      setFilters(prev => {
        const updatedSizes = prev.sizes.includes(value)
          ? prev.sizes.filter(size => size !== value)
          : [...prev.sizes, value];
        return { ...prev, sizes: updatedSizes };
      });
      setCurrentPage(1);
    }
    else if (type === 'priceMin') {
      setFilters(prev => ({ 
        ...prev, 
        priceRange: [parseInt(value) || 0, prev.priceRange[1]] 
      }));
      setCurrentPage(1);
    }
    else if (type === 'priceMax') {
      setFilters(prev => ({ 
        ...prev, 
        priceRange: [prev.priceRange[0], parseInt(value) || 20000] 
      }));
      setCurrentPage(1);
    }
    else if (type === 'sortBy') {
      setFilters(prev => ({ ...prev, sortBy: value }));
      setCurrentPage(1);
    }
  };
  
  // Сброс фильтров
  const resetFilters = () => {
    setFilters({
      category: 'all',
      priceRange: [0, 20000],
      colors: [],
      sizes: [],
      sortBy: 'newest'
    });
    setCurrentPage(1);
  };
  
  // Обработчик добавления в корзину
  const handleAddToCart = async (product) => {
    try {
      if (!addToCart) {
        console.error('Ошибка: функция addToCart не доступна');
        alert('Ошибка при добавлении товара в корзину: корзина не инициализирована');
        return;
      }
      
      try {
        await api.cart.addToCart(product._id || product.id, 1);
      } catch (apiError) {
        console.error('Ошибка API при добавлении в корзину:', apiError);
      }
      
      addToCart(product, 1);
      
      // Визуальное подтверждение с исчезающим уведомлением
      const notification = document.createElement('div');
      notification.className = 'add-to-cart-notification';
      notification.innerHTML = `
        <div class="notification-icon">&#128722;</div>
        <div class="notification-text">Товар добавлен в корзину</div>
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 2000);
      
    } catch (error) {
      console.error('Ошибка при добавлении товара в корзину:', error);
      alert('Ошибка при добавлении товара в корзину');
    }
  };
  
  // Обработчик добавления в избранное
  const handleAddToWishlist = async (product) => {
    try {
      try {
        await api.wishlist.addToWishlist(product._id || product.id);
        
        // Визуальное подтверждение
        const notification = document.createElement('div');
        notification.className = 'add-to-wishlist-notification';
        notification.innerHTML = `
          <div class="notification-icon">&#10084;</div>
          <div class="notification-text">Товар добавлен в избранное</div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.classList.add('fade-out');
          setTimeout(() => {
            document.body.removeChild(notification);
          }, 300);
        }, 2000);
        
      } catch (apiError) {
        console.error('Ошибка API при добавлении в избранное:', apiError);
        alert('Ошибка при добавлении в избранное');
      }
    } catch (error) {
      console.error('Ошибка при добавлении товара в избранное:', error);
      alert('Ошибка при добавлении в избранное');
    }
  };
  
  // Рендеринг пагинации
  const renderPagination = () => {
    const pages = [];
    
    // Добавляем первую страницу
    pages.push(
      <button
        key="first"
        className={`page-btn ${currentPage === 1 ? 'active' : ''}`}
        onClick={() => handlePageChange(1)}
      >
        1
      </button>
    );
    
    // Добавляем многоточие перед текущим диапазоном страниц (если нужно)
    if (currentPage > 4) {
      pages.push(
        <span key="ellipsis1" className="page-ellipsis">...</span>
      );
    }
    
    // Добавляем страницы вокруг текущей (по 2 с каждой стороны)
    for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
      pages.push(
        <button
          key={i}
          className={`page-btn ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    
    // Добавляем многоточие после текущего диапазона страниц (если нужно)
    if (currentPage < totalPages - 3) {
      pages.push(
        <span key="ellipsis2" className="page-ellipsis">...</span>
      );
    }
    
    // Добавляем последнюю страницу (если больше 1 страницы)
    if (totalPages > 1) {
      pages.push(
        <button
          key="last"
          className={`page-btn ${currentPage === totalPages ? 'active' : ''}`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }
    
    return (
      <div className="pagination">
        <button
          className="page-btn prev"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <span className="arrow">←</span>
        </button>
        
        {pages}
        
        <button
          className="page-btn next"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <span className="arrow">→</span>
        </button>
      </div>
    );
  };
  
  // Отображение состояния загрузки
  if (loading) {
    return (
      <div className="search-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Поиск товаров...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Отображение ошибки
  if (error) {
    return (
      <div className="search-page">
        <div className="container">
          <div className="error-container">
            <div className="error-icon">!</div>
            <h3 className="error-title">Произошла ошибка</h3>
            <p className="error-message">{error}</p>
            <button className="error-retry-btn" onClick={() => window.location.reload()}>
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Количество активных фильтров
  const activeFiltersCount = 
    (filters.colors.length > 0 ? 1 : 0) + 
    (filters.sizes.length > 0 ? 1 : 0) + 
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 20000 ? 1 : 0);
  
  // Склонение слова "товар"
  const getProductsCountText = (count) => {
    if (count === 1) return 'товар';
    if (count >= 2 && count <= 4) return 'товара';
    return 'товаров';
  };
  
  return (
    <div className="search-page">
      <div className="container">
        {/* Хлебные крошки */}
        <div className="breadcrumbs">
          <Link to="/" className="breadcrumb-link">Главная</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{categoryName}</span>
        </div>
        
        <div className="search-header">
          <h1 className="search-title">{categoryName}</h1>
          <div className="search-info">
            {totalResults > 0 && (
              <span className="results-count">
                {totalResults} {getProductsCountText(totalResults)}
              </span>
            )}
          </div>
          
          <div className="search-controls">
            <div className="sort-control">
              <span className="sort-icon">&#8657;&#8659;</span>
              <select 
                id="sort" 
                className="sort-select"
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <button className="filter-button" onClick={toggleFilter}>
              <span className="filter-icon">&#9776;</span>
              <span>Фильтры</span>
              {activeFiltersCount > 0 && (
                <span className="filter-badge">{activeFiltersCount}</span>
              )}
            </button>
          </div>
        </div>
        
        <div className="search-content">
          {/* Панель фильтров */}
          <div className={`filters-panel ${filterOpen ? 'open' : ''}`}>
            <div className="filters-header">
              <h2 className="filters-title">Фильтры</h2>
              <button className="close-filters-btn" onClick={toggleFilter}>
                &#10005;
              </button>
            </div>
            
            <div className="filter-group">
              <h3 className="filter-group-title">Цена</h3>
              <div className="price-range-control">
                <div className="price-inputs">
                  <input
                    type="number"
                    className="price-input"
                    placeholder="От"
                    value={filters.priceRange[0] || ''}
                    onChange={(e) => updateFilter('priceMin', e.target.value)}
                  />
                  <span className="price-separator">—</span>
                  <input
                    type="number"
                    className="price-input"
                    placeholder="До"
                    value={filters.priceRange[1] || ''}
                    onChange={(e) => updateFilter('priceMax', e.target.value)}
                  />
                </div>
                <div className="price-slider-container">
                  <input
                    type="range"
                    min="0"
                    max="20000"
                    step="100"
                    value={filters.priceRange[0]}
                    onChange={(e) => updateFilter('priceMin', e.target.value)}
                    className="price-slider"
                  />
                  <input
                    type="range"
                    min="0"
                    max="20000"
                    step="100"
                    value={filters.priceRange[1]}
                    onChange={(e) => updateFilter('priceMax', e.target.value)}
                    className="price-slider"
                  />
                </div>
              </div>
            </div>
            
            <div className="filter-group">
              <h3 className="filter-group-title">Цвет</h3>
              <div className="color-filters">
                {colorOptions.map(color => (
                  <div 
                    key={color.code}
                    className={`color-option ${filters.colors.includes(color.code) ? 'selected' : ''}`}
                    style={{ 
                      backgroundColor: color.code, 
                      border: color.code === '#FFFFFF' ? '1px solid #ddd' : 'none' 
                    }}
                    onClick={() => updateFilter('color', color.code)}
                    title={color.name}
                  >
                    {filters.colors.includes(color.code) && (
                      <span className="color-checkmark">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="filter-group">
              <h3 className="filter-group-title">Размер</h3>
              <div className="size-filters">
                {sizeOptions.map(size => (
                  <div 
                    key={size}
                    className={`size-option ${filters.sizes.includes(size) ? 'selected' : ''}`}
                    onClick={() => updateFilter('size', size)}
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="filter-actions">
              <button className="apply-filters-btn" onClick={toggleFilter}>
                Показать результаты
              </button>
              <button className="reset-filters-btn" onClick={resetFilters}>
                Сбросить все
              </button>
            </div>
          </div>
          
          {/* Сетка товаров */}
          <div className="search-results">
            {products.length > 0 ? (
              <>
                <div className="active-filters">
                  {filters.colors.length > 0 && (
                    <div className="active-filter">
                      <span>Цвет: {filters.colors.length}</span>
                      <button 
                        className="clear-filter-btn"
                        onClick={() => setFilters(prev => ({ ...prev, colors: [] }))}
                      >
                        &#10005;
                      </button>
                    </div>
                  )}
                  
                  {filters.sizes.length > 0 && (
                    <div className="active-filter">
                      <span>Размер: {filters.sizes.length}</span>
                      <button 
                        className="clear-filter-btn"
                        onClick={() => setFilters(prev => ({ ...prev, sizes: [] }))}
                      >
                        &#10005;
                      </button>
                    </div>
                  )}
                  
                  {(filters.priceRange[0] > 0 || filters.priceRange[1] < 20000) && (
                    <div className="active-filter">
                      <span>Цена: {filters.priceRange[0]} — {filters.priceRange[1]} ₽</span>
                      <button 
                        className="clear-filter-btn"
                        onClick={() => setFilters(prev => ({ ...prev, priceRange: [0, 20000] }))}
                      >
                        &#10005;
                      </button>
                    </div>
                  )}
                  
                  {activeFiltersCount > 0 && (
                    <button className="clear-all-filters-btn" onClick={resetFilters}>
                      Сбросить все
                    </button>
                  )}
                </div>
                
                <div className="products-grid">
                  {products.map(product => (
                    <ProductCard 
                      key={product._id || product.id}
                      product={{
                        ...product,
                        _id: product._id || product.id,
                        availableColors: product.colors || product.availableColors
                      }}
                      showActions={true}
                      showCategory={true}
                      onAddToCart={() => handleAddToCart(product)}
                      onAddToWishlist={() => handleAddToWishlist(product)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3 className="no-results-title">Товары не найдены</h3>
                <p className="no-results-text">
                  {query 
                    ? `По запросу "${query}" ничего не найдено.` 
                    : 'По данным параметрам фильтрации ничего не найдено.'
                  }
                </p>
                <button className="reset-search-btn" onClick={resetFilters}>
                  Сбросить фильтры
                </button>
              </div>
            )}
            
            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="pagination-container">
                {renderPagination()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
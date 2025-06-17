import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import '../styles/CollectionPage.css';

const TruckPartsCollection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  // Фильтры
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 30000],
    brands: [],
    forTrucks: []
  });

  // Параметры из URL
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');

  // Опции для фильтрации
  const brandOptions = ['Scania', 'Volvo', 'MAN', 'DAF', 'Mercedes', 'Renault'];
  const forTruckOptions = ['Грузовик', 'Прицеп', 'Рефрижератор', 'Тягач'];

  // Категории
  useEffect(() => {
    setCategories([
      { id: 'all', name: 'Все' },
      { id: 'engine', name: 'Двигатель' },
      { id: 'brakes', name: 'Тормоза' },
      { id: 'lights', name: 'Освещение' },
      { id: 'filters', name: 'Фильтры' },
      { id: 'accessories', name: 'Аксессуары' }
    ]);
  }, []);

  // Фильтр из URL
  useEffect(() => {
    if (categoryParam) {
      setFilters(prev => ({ ...prev, category: categoryParam }));
    }
  }, [categoryParam]);

  // Загрузка продуктов (можно заменить на свой API)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Демо-товары
        const data = [
          {
            id: '1',
            name: 'Турбокомпрессор Scania R420',
            price: 18500,
            originalPrice: 21000,
            category: 'engine',
            brand: 'Scania',
            forTruck: 'Грузовик',
            isNew: true,
            description: 'Оригинальный турбокомпрессор для Scania серии R.',
            images: [
              'https://images.pexels.com/photos/14277598/pexels-photo-14277598.jpeg?auto=compress&cs=tinysrgb&w=600'
            ],
            stock: 'in-stock'
          },
          {
            id: '2',
            name: 'Тормозной диск DAF XF',
            price: 4500,
            originalPrice: null,
            category: 'brakes',
            brand: 'DAF',
            forTruck: 'Тягач',
            isNew: false,
            description: 'Высокопрочный тормозной диск для DAF XF 105.',
            images: [
              'https://images.pexels.com/photos/195635/pexels-photo-195635.jpeg?auto=compress&cs=tinysrgb&w=600'
            ],
            stock: 'in-stock'
          },
          {
            id: '3',
            name: 'Фара MAN TGX',
            price: 5600,
            originalPrice: 6700,
            category: 'lights',
            brand: 'MAN',
            forTruck: 'Грузовик',
            isNew: true,
            description: 'Светодиодная фара для MAN TGX.',
            images: [
              'https://images.pexels.com/photos/32523527/pexels-photo-32523527.jpeg?auto=compress&cs=tinysrgb&w=600'
            ],
            stock: 'in-stock'
          },
          {
            id: '4',
            name: 'Фильтр масляный Mercedes Actros',
            price: 950,
            originalPrice: null,
            category: 'filters',
            brand: 'Mercedes',
            forTruck: 'Грузовик',
            isNew: false,
            description: 'Оригинальный масляный фильтр для Actros.',
            images: [
              'https://images.pexels.com/photos/4517069/pexels-photo-4517069.jpeg?auto=compress&cs=tinysrgb&w=600'
            ],
            stock: 'in-stock'
          },
          {
            id: '5',
            name: 'Щётки стеклоочистителя Volvo FH',
            price: 750,
            originalPrice: null,
            category: 'accessories',
            brand: 'Volvo',
            forTruck: 'Грузовик',
            isNew: true,
            description: 'Универсальные щетки для Volvo FH.',
            images: [
              'https://images.pexels.com/photos/3796234/pexels-photo-3796234.jpeg?auto=compress&cs=tinysrgb&w=600'
            ],
            stock: 'in-stock'
          }
        ];

        // Фильтрация
        const filtered = data.filter(product => {
          // Категория
          if (filters.category !== 'all' && product.category !== filters.category) return false;
          // Цена
          if (filters.priceRange[0] > 0 && product.price < filters.priceRange[0]) return false;
          if (filters.priceRange[1] < 30000 && product.price > filters.priceRange[1]) return false;
          // Бренд
          if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) return false;
          // Тип ТС
          if (filters.forTrucks.length > 0 && !filters.forTrucks.includes(product.forTruck)) return false;
          return true;
        });

        setProducts(filtered);
        setLoading(false);
      } catch (err) {
        setError('Ошибка загрузки товаров. Попробуйте позже.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  // Добавление в корзину
  const handleAddToCart = (product) => {
    addToCart(product, 1);
    alert('Товар добавлен в корзину!');
  };

  // Избранное (заглушка)
  const handleAddToWishlist = (product) => {
    alert('Товар добавлен в избранное!');
  };

  // Фильтры
  const toggleFilter = () => setFilterOpen(!filterOpen);
  const updateFilter = (type, value) => {
    if (type === 'category') {
      setFilters(prev => ({ ...prev, category: value }));
      const params = new URLSearchParams(location.search);
      if (value === 'all') params.delete('category');
      else params.set('category', value);
      navigate({ search: params.toString() });
    } else if (type === 'brand') {
      setFilters(prev => {
        const updated = prev.brands.includes(value)
          ? prev.brands.filter(brand => brand !== value)
          : [...prev.brands, value];
        return { ...prev, brands: updated };
      });
    } else if (type === 'forTruck') {
      setFilters(prev => {
        const updated = prev.forTrucks.includes(value)
          ? prev.forTrucks.filter(item => item !== value)
          : [...prev.forTrucks, value];
        return { ...prev, forTrucks: updated };
      });
    } else if (type === 'priceMin') {
      setFilters(prev => ({ ...prev, priceRange: [parseInt(value) || 0, prev.priceRange[1]] }));
    } else if (type === 'priceMax') {
      setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], parseInt(value) || 30000] }));
    }
  };

  const resetFilters = () => {
    setFilters({
      category: 'all',
      priceRange: [0, 30000],
      brands: [],
      forTrucks: []
    });
    navigate({ search: '' });
  };

  // Загрузка
  if (loading) {
    return (
      <div className="page">
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  // Ошибка
  if (error) {
    return (
      <div className="page">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Попробовать снова</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="collection-container">
        <div className="collection-header">
          <h1>Каталог деталей для фур</h1>
          <button className="filter-button" onClick={toggleFilter}>
            {filterOpen ? 'Скрыть фильтры' : 'Фильтры'}
            {(filters.brands.length > 0 || filters.forTrucks.length > 0) && 
              <span className="filter-indicator"></span>
            }
          </button>
        </div>

        {/* Категории */}
        <div className="categories-nav">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-button ${filters.category === category.id ? 'active' : ''}`}
              onClick={() => updateFilter('category', category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="collection-content">
          {/* Фильтры */}
          <div className={`filters-panel ${filterOpen ? 'open' : ''}`}>
            <div className="filter-group">
              <h3>Цена</h3>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="От"
                  value={filters.priceRange[0] || ''}
                  onChange={(e) => updateFilter('priceMin', e.target.value)}
                />
                <span>—</span>
                <input
                  type="number"
                  placeholder="До"
                  value={filters.priceRange[1] || ''}
                  onChange={(e) => updateFilter('priceMax', e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <h3>Бренд</h3>
              <div className="brand-filters">
                {brandOptions.map(brand => (
                  <label key={brand} className="brand-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand)}
                      onChange={() => updateFilter('brand', brand)}
                    />
                    {brand}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3>Тип транспорта</h3>
              <div className="trucktype-filters">
                {forTruckOptions.map(type => (
                  <label key={type} className="brand-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.forTrucks.includes(type)}
                      onChange={() => updateFilter('forTruck', type)}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <button className="reset-filters" onClick={resetFilters}>
              Сбросить все
            </button>
          </div>

          {/* Сетка товаров */}
          <div className="products-grid">
            {products.length > 0 ? (
              products.map(product => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  showActions={true}
                  showCategory={false}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                />
              ))
            ) : (
              <div className="no-products">
                <p>По вашему запросу ничего не найдено</p>
                <button onClick={resetFilters}>Сбросить фильтры</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TruckPartsCollection;

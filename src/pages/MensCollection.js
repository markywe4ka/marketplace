import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import '../styles/CollectionPage.css';

const ElectronicsCollection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 40000],
    manufacturers: [],
    forTrucks: []
  });

  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');

  // Категории и фильтры
  const manufacturerOptions = ['Bosch', 'HELLA', 'Valeo', 'Magneti Marelli', 'Delphi', 'Varta', 'Banner'];
  const forTruckOptions = ['Грузовик', 'Прицеп', 'Тягач', 'Автобус'];

  useEffect(() => {
    setCategories([
      { id: 'all', name: 'Все' },
      { id: 'starters', name: 'Стартеры' },
      { id: 'alternators', name: 'Генераторы' },
      { id: 'batteries', name: 'Аккумуляторы' },
      { id: 'lights', name: 'Фары/Лампы' },
      { id: 'sensors', name: 'Датчики' }
    ]);
  }, []);

  useEffect(() => {
    if (categoryParam) {
      setFilters(prev => ({ ...prev, category: categoryParam }));
    }
  }, [categoryParam]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Примеры товаров (здесь можно подключить свой API)
        const data = [
          {
            id: '1',
            name: 'Стартер Bosch для MAN TGX',
            price: 11200,
            originalPrice: null,
            category: 'starters',
            manufacturer: 'Bosch',
            forTruck: 'Грузовик',
            isNew: true,
            description: 'Стартер для грузовых автомобилей MAN TGX, 24V, оригинал.',
            images: [
              'https://images.pexels.com/photos/13302056/pexels-photo-13302056.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load'
            ],
            stock: 'in-stock'
          },
          {
            id: '2',
            name: 'Генератор HELLA 28V для Scania',
            price: 19500,
            originalPrice: 20900,
            category: 'alternators',
            manufacturer: 'HELLA',
            forTruck: 'Тягач',
            isNew: false,
            description: 'Генератор HELLA для Scania R, высокое качество.',
            images: [
              'https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=400'
            ],
            stock: 'in-stock'
          },
          {
            id: '3',
            name: 'Аккумулятор Varta 225Ah',
            price: 17400,
            originalPrice: 18800,
            category: 'batteries',
            manufacturer: 'Varta',
            forTruck: 'Грузовик',
            isNew: true,
            description: 'Аккумулятор для грузовых авто и автобусов. Емкость 225Ач.',
            images: [
              'https://images.pexels.com/photos/13065692/pexels-photo-13065692.jpeg?auto=compress&cs=tinysrgb&w=400'
            ],
            stock: 'in-stock'
          },
          {
            id: '4',
            name: 'Фара передняя Valeo для DAF XF',
            price: 8200,
            originalPrice: 9500,
            category: 'lights',
            manufacturer: 'Valeo',
            forTruck: 'Грузовик',
            isNew: false,
            description: 'Фара головного света Valeo для DAF XF, LED.',
            images: [
              'https://images.pexels.com/photos/32496111/pexels-photo-32496111.jpeg?auto=compress&cs=tinysrgb&w=600'
            ],
            stock: 'in-stock'
          },
          {
            id: '5',
            name: 'Датчик ABS Magneti Marelli',
            price: 2400,
            originalPrice: null,
            category: 'sensors',
            manufacturer: 'Magneti Marelli',
            forTruck: 'Прицеп',
            isNew: true,
            description: 'Датчик ABS для грузовых прицепов, универсальный.',
            images: [
              'https://images.pexels.com/photos/25284580/pexels-photo-25284580.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
            ],
            stock: 'in-stock'
          }
        ];

        // Фильтрация
        const filtered = data.filter(product => {
          if (filters.category !== 'all' && product.category !== filters.category) return false;
          if (filters.priceRange[0] > 0 && product.price < filters.priceRange[0]) return false;
          if (filters.priceRange[1] < 40000 && product.price > filters.priceRange[1]) return false;
          if (filters.manufacturers.length > 0 && !filters.manufacturers.includes(product.manufacturer)) return false;
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

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    alert('Товар добавлен в корзину!');
  };

  const handleAddToWishlist = (product) => {
    alert('Товар добавлен в избранное!');
  };

  const toggleFilter = () => setFilterOpen(!filterOpen);

  const updateFilter = (type, value) => {
    if (type === 'category') {
      setFilters(prev => ({ ...prev, category: value }));
      const params = new URLSearchParams(location.search);
      if (value === 'all') params.delete('category');
      else params.set('category', value);
      navigate({ search: params.toString() });
    } else if (type === 'manufacturer') {
      setFilters(prev => {
        const updated = prev.manufacturers.includes(value)
          ? prev.manufacturers.filter(brand => brand !== value)
          : [...prev.manufacturers, value];
        return { ...prev, manufacturers: updated };
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
      setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], parseInt(value) || 40000] }));
    }
  };

  const resetFilters = () => {
    setFilters({
      category: 'all',
      priceRange: [0, 40000],
      manufacturers: [],
      forTrucks: []
    });
    navigate({ search: '' });
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

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
          <h1>Электрооборудование для грузовых авто</h1>
          <button className="filter-button" onClick={toggleFilter}>
            {filterOpen ? 'Скрыть фильтры' : 'Фильтры'}
            {(filters.manufacturers.length > 0 || filters.forTrucks.length > 0) &&
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
              <h3>Производитель</h3>
              <div className="brand-filters">
                {manufacturerOptions.map(brand => (
                  <label key={brand} className="brand-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.manufacturers.includes(brand)}
                      onChange={() => updateFilter('manufacturer', brand)}
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
          {/* Товары */}
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

export default ElectronicsCollection;

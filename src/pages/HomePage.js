import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import '../styles/HomePage.css';
import api from '../services/api';
import { useCart } from '../context/CartContext';

function HomePage() {
  const { addToCart } = useCart();

  // State
  const [heroSlides, setHeroSlides] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [socialPosts, setSocialPosts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newsletter, setNewsletter] = useState('');
  const [emailError, setEmailError] = useState('');
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);

  // Add to cart
  const handleAddToCart = useCallback((product) => {
    try {
      addToCart(product, 1);
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  }, [addToCart]);

  // Wishlist
  const handleAddToWishlist = useCallback((product) => {
    // Тут можно сделать избранное
    console.log('Added to wishlist:', product);
  }, []);

  // Data loading
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Данные для баннера (hero)
        const demoHeroSlides = [
          {
            id: 1,
            title: 'Запчасти для грузовиков и фур',
            subtitle: 'Доставка по Молдове и Европе',
            description: 'Качественные детали и быстрая доставка для вашего бизнеса. Более 5000 позиций для фур и грузовых авто.',
            image: 'https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // грузовик на трассе
            mobileImage: 'https://images.pexels.com/photos/1624600/pexels-photo-1624600.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            buttonText: 'Каталог запчастей',
            buttonLink: '/collections/truck-parts',
            overlayColor: 'rgba(0,0,0,0.35)'
          }
        ];

        // Категории (только подходящие фото!)
        const yourCategories = [
  {
    id: 1,
    name: 'Двигатель и топливная система',
    slug: 'engine',
    image: 'https://images.pexels.com/photos/2027045/pexels-photo-2027045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' // двигатель грузовика
  },
  {
    id: 2,
    name: 'Тормозная система',
    slug: 'brakes',
    image: 'https://images.pexels.com/photos/7565164/pexels-photo-7565164.jpeg?auto=compress&cs=tinysrgb&w=600' // тормозной диск
  },
  {
    id: 3,
    name: 'Кузовные детали',
    slug: 'body-parts',
    image: 'https://images.pexels.com/photos/32523527/pexels-photo-32523527.jpeg?auto=compress&cs=tinysrgb&w=600' // фура крупным планом
  },
  {
    id: 4,
    name: 'Аксессуары для водителей',
    slug: 'driver-accessories',
    image: 'https://images.pexels.com/photos/7539640/pexels-photo-7539640.jpeg?auto=compress&cs=tinysrgb&w=600' // интерьер кабины грузовика
  }
];


        // Продукты
        const demoProducts = [
          {
            _id: 'p1',
            id: 'p1',
            name: 'Турбокомпрессор Scania R420',
            category: 'Двигатель и топливная система',
            description: 'Оригинальный турбокомпрессор для Scania серии R, евро-5.',
            price: 18500,
            originalPrice: 21000,
            images: [
              'https://images.pexels.com/photos/7565164/pexels-photo-7565164.jpeg?auto=compress&cs=tinysrgb&w=600'
            ],
            availableColors: [],
            isNew: true,
            stock: 'in-stock',
            tags: ['new', 'featured'],
            composition: 'Металл, заводская сборка'
          },
          {
            _id: 'p2',
            id: 'p2',
            name: 'Передний тормозной диск DAF XF',
            category: 'Тормозная система',
            description: 'Высокопрочный тормозной диск для DAF XF 105.',
            price: 4500,
            originalPrice: null,
            images: [
              'https://images.pexels.com/photos/4022545/pexels-photo-4022545.jpeg?auto=compress&cs=tinysrgb&w=600'
            ],
            availableColors: [],
            isNew: false,
            stock: 'in-stock',
            tags: ['bestseller'],
            composition: 'Чугун, износостойкий'
          },
          {
            _id: 'p3',
            id: 'p3',
            name: 'Фара MAN TGX левая',
            category: 'Кузовные детали',
            description: 'Совместима с MAN TGX, светодиодная.',
            price: 5600,
            originalPrice: 6700,
            images: [
              'https://images.pexels.com/photos/1409968/pexels-photo-1409968.jpeg?auto=compress&cs=tinysrgb&w=600'
            ],
            availableColors: [],
            isNew: true,
            stock: 'in-stock',
            tags: ['new'],
            composition: 'Пластик, стекло'
          },
          {
            _id: 'p4',
            id: 'p4',
            name: 'Комплект щеток стеклоочистителя Volvo FH',
            category: 'Аксессуары для водителей',
            description: 'Универсальные щетки для всех моделей Volvo FH.',
            price: 750,
            originalPrice: null,
            images: [
              'https://images.pexels.com/photos/12496786/pexels-photo-12496786.jpeg?auto=compress&cs=tinysrgb&w=600'
            ],
            availableColors: [],
            isNew: false,
            stock: 'in-stock',
            tags: ['bestseller', 'sale'],
            composition: 'Резина, пластик'
          },
          {
            _id: 'p5',
            id: 'p5',
            name: 'Фильтр масляный Mercedes Actros',
            category: 'Двигатель и топливная система',
            description: 'Оригинальный масляный фильтр для Actros.',
            price: 950,
            originalPrice: null,
            images: [
              'https://images.pexels.com/photos/4489765/pexels-photo-4489765.jpeg?auto=compress&cs=tinysrgb&w=600'
            ],
            availableColors: [],
            isNew: true,
            stock: 'in-stock',
            tags: ['new'],
            composition: 'Фильтрующая бумага'
          }
        ];

        // Соц.сеть: как пример, Instagram компании
        const demoSocialPosts = [
          {
            id: 's1',
            image: 'https://images.pexels.com/photos/17156981/pexels-photo-17156981/free-photo-of-lamborghini.jpeg?auto=compress&cs=tinysrgb&w=600',
            link: 'https://instagram.com/anattrans_md'
          },
          {
            id: 's2',
            image: 'https://images.pexels.com/photos/10874527/pexels-photo-10874527.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
            link: 'https://instagram.com/anattrans_md'
          },
          {
            id: 's3',
            image: 'https://images.pexels.com/photos/29252132/pexels-photo-29252132.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
            link: 'https://instagram.com/anattrans_md'
          },
          {
            id: 's4',
            image: 'https://images.pexels.com/photos/27911189/pexels-photo-27911189.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
            link: 'https://instagram.com/anattrans_md'
          }
          ,
          {
            id: 's5',
            image: 'https://images.pexels.com/photos/9182351/pexels-photo-9182351.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
            link: 'https://instagram.com/anattrans_md'
          }
        ];

        setHeroSlides(demoHeroSlides);
        setCategories(yourCategories);
        setFeaturedProducts(demoProducts);
        setNewArrivals(demoProducts.filter(p => p.isNew));
        setSocialPosts(demoSocialPosts);
        setLoading(false);
      } catch (error) {
        setError('Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Фильтры
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const getFilteredProducts = () => {
    if (activeFilter === 'all') {
      return featuredProducts.slice(0, 4);
    }
    return featuredProducts
      .filter(product => product.tags && product.tags.includes(activeFilter))
      .slice(0, 4);
  };

  // Подписка на рассылку
  const handleNewsletterSubmit = useCallback((e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletter)) {
      setEmailError('Пожалуйста, введите корректный email');
      return;
    }
    setEmailError('');
    setSubscribeSuccess(true);
    setNewsletter('');
    setTimeout(() => {
      setSubscribeSuccess(false);
    }, 5000);
  }, [newsletter]);

  if (loading) {
    return (
      <div className="page-loader">
        <div className="loader-logo">
          ANATTRANS
          <div className="loader-progress"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fusion-store">
        <div className="error-container">
          <div className="container">
            <div className="error-message">
              <i className="bi bi-exclamation-triangle-fill error-icon"></i>
              <h3>Что-то пошло не так</h3>
              <p>{error}</p>
              <button 
                className="btn"
                onClick={() => window.location.reload()}
              >
                Попробовать снова
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fusion-store">
      {/* Hero banner */}
      <section className="hero">
        <div className="hero-text">
          <div className="hero-subtitle">{heroSlides[0].subtitle}</div>
          <h1 className="hero-title">{heroSlides[0].title}</h1>
          <p className="hero-description">{heroSlides[0].description}</p>
          <Link to={heroSlides[0].buttonLink} className="btn">
            {heroSlides[0].buttonText}
          </Link>
        </div>
        <div className="hero-image">
          <img src={heroSlides[0].image} alt="Hero" />
        </div>
      </section>

      {/* Категории */}
      {categories.length > 0 && (
        <section className="categories">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Категории товаров</h2>
              <p className="section-description">Запчасти и аксессуары для всех видов грузовиков и прицепов</p>
            </div>
            <div className="categories-grid">
              {categories.map(category => (
                <div key={category.id} className="category-card">
                  <img src={category.image} alt={category.name} className="category-image" />
                  <div className="category-content">
                    <h3 className="category-title">{category.name}</h3>
                    <Link to={`/collection/${category.slug}`} className="shop-link">
                      Перейти <span>→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Популярные товары */}
      <section className="featured-products">
        <div className="container">
          <div className="products-header">
            <h2 className="products-title">Популярные запчасти</h2>
            <div className="product-filters">
              <button 
                className={`product-filter ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterChange('all')}
              >
                Все
              </button>
              <button 
                className={`product-filter ${activeFilter === 'new' ? 'active' : ''}`}
                onClick={() => handleFilterChange('new')}
              >
                Новинки
              </button>
              <button 
                className={`product-filter ${activeFilter === 'bestseller' ? 'active' : ''}`}
                onClick={() => handleFilterChange('bestseller')}
              >
                Хит продаж
              </button>
              <button 
                className={`product-filter ${activeFilter === 'sale' ? 'active' : ''}`}
                onClick={() => handleFilterChange('sale')}
              >
                Распродажа
              </button>
            </div>
          </div>
          <div className="products-grid">
            {getFilteredProducts().map(product => (
              <ProductCard 
                key={product._id || product.id} 
                product={product}
                showActions={true}
                showCategory={true}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Баннер о доставке и сервисе */}
      <section className="collection-banner">
        <div className="container">
          <div className="banner-content">
            <div className="banner-text">
              <div className="banner-subtitle">Профессиональные перевозки</div>
              <h2 className="banner-title">Anattrans – ваш партнёр в мире автозапчастей</h2>
              <p className="banner-description">
                Надежная логистика, быстрая доставка, персональный подход. Работаем с оптовыми и розничными клиентами по всей Молдове и Европе.
              </p>
              <div className="banner-cta">
                <Link to="/about" className="btn">О компании</Link>
                <Link to="/contacts" className="btn outlined-btn">Контакты</Link>
              </div>
            </div>
            <div className="banner-image">
              <img src="https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80" alt="Trucks" />
            </div>
          </div>
        </div>
      </section>

      {/* Новинки */}
      <section className="featured-products">
        <div className="container">
          <div className="products-header">
            <h2 className="products-title">Новые поступления</h2>
            <Link to="/collections/new" className="btn outlined-btn">Смотреть все</Link>
          </div>
          <div className="products-grid">
            {newArrivals.slice(0, 4).map(product => (
              <ProductCard 
                key={product._id || product.id} 
                product={product}
                showActions={true}
                showCategory={true}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Instagram секция */}
      <section className="instagram-section">
        <div className="container">
          <div className="instagram-header">
            <h2 className="section-title">Instagram</h2>
            <p className="section-description">Новости компании, отзывы и фото наших клиентов — следите за нами!</p>
          </div>
          <div className="instagram-grid">
            {socialPosts.map(post => (
              <a 
                key={post.id} 
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-item"
              >
                <img src={post.image} alt="Instagram Post" />
                <div className="instagram-overlay">
                  <div className="instagram-icon">♡</div>
                </div>
              </a>
            ))}
          </div>
          <div className="instagram-cta">
            <div className="instagram-username">@anattrans_md</div>
            <a 
              href="https://instagram.com/anattrans_md" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn outlined-btn"
            >
              Подписаться
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter-content">
            <h2 className="newsletter-title">Подпишитесь на новости и акции</h2>
            <p className="newsletter-description">Узнавайте первыми о поступлениях, скидках и специальных предложениях для бизнеса</p>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input 
                type="email" 
                className="newsletter-input" 
                placeholder="Ваш email"
                value={newsletter}
                onChange={(e) => setNewsletter(e.target.value)}
                required
              />
              <button type="submit" className="newsletter-btn">Подписаться</button>
            </form>
            {emailError && (
              <div className="newsletter-error">{emailError}</div>
            )}
            {subscribeSuccess && (
              <div className="newsletter-success">Спасибо за подписку!</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;

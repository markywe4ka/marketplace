import React, { useState, useEffect, useContext, use } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import '../styles/ProductPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(useCart);
  
  // Состояние товара
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Состояние выбора пользователя
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  
  // Состояние отзывов
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  
  // Состояние рекомендаций
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  // Загрузка товара
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Попытка получить товар из API
        try {
          const productData = await api.products.getProductById(id);
          setProduct(productData);
          
          // Установка начальных значений выбора
          if (productData.availableColors && productData.availableColors.length > 0) {
            setSelectedColor(productData.availableColors[0].code);
          }
          
          if (productData.sizes && productData.sizes.length > 0) {
            setSelectedSize(productData.sizes[0]);
          }
          
          // Загрузка отзывов
          try {
            const reviewsData = await api.reviews.getProductReviews(id);
            setReviews(reviewsData);
          } catch (reviewsError) {
            console.error('Ошибка при загрузке отзывов:', reviewsError);
            // Используем пустой массив отзывов в случае ошибки
            setReviews([]);
          }
          
          // Загрузка связанных товаров
          try {
            const relatedData = await api.products.getRelatedProducts(id);
            setRelatedProducts(relatedData);
          } catch (relatedError) {
            console.error('Ошибка при загрузке связанных товаров:', relatedError);
            // Используем пустой массив связанных товаров в случае ошибки
            setRelatedProducts([]);
          }
          
          // Проверка, находится ли товар в избранном
          try {
            const wishlistStatus = await api.wishlist.isInWishlist(id);
            setIsInWishlist(wishlistStatus);
          } catch (wishlistError) {
            console.error('Ошибка при проверке статуса избранного:', wishlistError);
            setIsInWishlist(false);
          }
          
        } catch (apiError) {
          console.error('Ошибка API при получении товара:', apiError);
          
          // Если API недоступно, попробуем получить товар из localStorage
          const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
          const storedMensProducts = JSON.parse(localStorage.getItem('mens_products') || '[]');
          const allStoredProducts = [...storedProducts, ...storedMensProducts];
          
          const localProduct = allStoredProducts.find(p => p.id === id);
          
          if (localProduct) {
            setProduct({
              ...localProduct,
              _id: localProduct.id,
              availableColors: localProduct.colors
            });
            
            // Установка начальных значений выбора
            if (localProduct.colors && localProduct.colors.length > 0) {
              setSelectedColor(localProduct.colors[0].code);
            }
            
            if (localProduct.sizes && localProduct.sizes.length > 0) {
              setSelectedSize(localProduct.sizes[0]);
            }
          } else {
            throw new Error('Товар не найден');
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Ошибка при загрузке товара:', err);
        setError('Не удалось загрузить товар. Пожалуйста, попробуйте позже.');
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  // Обработчик изменения количества
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };
  
  // Обработчик добавления в корзину
  const handleAddToCart = async () => {
    if (!selectedColor || !selectedSize) {
      alert('Пожалуйста, выберите цвет и размер товара');
      return;
    }
    
    try {
      // Формируем объект товара для добавления в корзину
      const cartItem = {
        ...product,
        quantity,
        color: selectedColor,
        size: selectedSize
      };
      
      // Пытаемся добавить товар через API
      try {
        await api.cart.addToCart(product._id || product.id, quantity, {
          color: selectedColor,
          size: selectedSize
        });
      } catch (apiError) {
        console.error('Ошибка API при добавлении в корзину:', apiError);
        // Если API недоступно, добавляем только локально
      }
      
      // Добавляем товар в локальную корзину
      addToCart(cartItem);
      
      alert('Товар добавлен в корзину');
      
      // Опционально: перенаправление в корзину
      // navigate('/cart');
    } catch (error) {
      console.error('Ошибка при добавлении товара в корзину:', error);
      alert('Ошибка при добавлении товара в корзину');
    }
  };
  
  // Обработчик добавления в избранное
  const handleToggleWishlist = async () => {
    try {
      if (isInWishlist) {
        // Удаляем из избранного
        try {
          await api.wishlist.removeFromWishlist(product._id || product.id);
          setIsInWishlist(false);
          alert('Товар удален из избранного');
        } catch (apiError) {
          console.error('Ошибка API при удалении из избранного:', apiError);
          alert('Ошибка при удалении из избранного');
        }
      } else {
        // Добавляем в избранное
        try {
          await api.wishlist.addToWishlist(product._id || product.id);
          setIsInWishlist(true);
          alert('Товар добавлен в избранное');
        } catch (apiError) {
          console.error('Ошибка API при добавлении в избранное:', apiError);
          alert('Ошибка при добавлении в избранное');
        }
      }
    } catch (error) {
      console.error('Ошибка при работе с избранным:', error);
      alert('Произошла ошибка. Пожалуйста, попробуйте позже');
    }
  };
  
  // Обработчик выбора изображения
  const handleImageChange = (index) => {
    setCurrentImage(index);
  };
  
  // Обработчик переключения отзывов
  const toggleReviews = () => {
    setShowAllReviews(!showAllReviews);
  };
  
  // Форматирование цены
  const formatPrice = (price) => {
    return price ? `${price.toLocaleString('ru-RU')} ₽` : '';
  };
  
  // Получение текущего цвета
  const getCurrentColor = () => {
    if (!product || !selectedColor) return null;
    
    const colors = product.availableColors || product.colors || [];
    return colors.find(color => color.code === selectedColor);
  };
  
  // Рассчет рейтинга
  const calculateRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };
  
  // Рендеринг звезд рейтинга
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className="star full">★</span>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<span key={i} className="star half">★</span>);
      } else {
        stars.push(<span key={i} className="star empty">☆</span>);
      }
    }
    
    return stars;
  };
  
  // Загрузка страницы
  if (loading) {
    return (
      <div className="product-page">
        <div className="container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Загрузка товара...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Обработка ошибок
  if (error || !product) {
    return (
      <div className="product-page">
        <div className="container">
          <div className="error-message">
            <p>{error || 'Товар не найден'}</p>
            <button onClick={() => navigate('/')}>Вернуться на главную</button>
          </div>
        </div>
      </div>
    );
  }
  
  // Текущий цвет
  const currentColor = getCurrentColor();
  
  // Рейтинг товара
  const rating = calculateRating();
  
  return (
    <div className="product-page">
      <div className="container">
        {/* Хлебные крошки */}
        <div className="breadcrumbs">
          <a href="/">Главная</a>
          <span className="breadcrumb-separator">›</span>
          <a href={`/collection/${product.category}`}>{product.category}</a>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{product.name}</span>
        </div>
        
        <div className="product-content">
          {/* Галерея изображений */}
          <div className="product-gallery">
            <div className="main-image">
              <img 
                src={product.images[currentImage]} 
                alt={product.name} 
              />
              {product.isNew && <div className="product-badge new">Новинка</div>}
              {product.originalPrice && (
                <div className="product-badge sale">
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                </div>
              )}
            </div>
            
            <div className="thumbnail-gallery">
              {product.images.map((image, index) => (
                <div 
                  key={index}
                  className={`thumbnail ${index === currentImage ? 'active' : ''}`}
                  onClick={() => handleImageChange(index)}
                >
                  <img src={image} alt={`${product.name} - изображение ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Информация о товаре */}
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            
            {/* Рейтинг и отзывы */}
            <div className="product-rating">
              <div className="stars">
                {renderStars(rating)}
              </div>
              <div className="review-count">
                {reviews.length} {reviews.length === 1 ? 'отзыв' : 
                  reviews.length >= 2 && reviews.length <= 4 ? 'отзыва' : 'отзывов'}
              </div>
            </div>
            
            {/* Цена */}
            <div className="product-price">
              {product.originalPrice && (
                <span className="original-price">{formatPrice(product.originalPrice)}</span>
              )}
              <span className="current-price">{formatPrice(product.price)}</span>
            </div>
            
            {/* Описание */}
            <div className="product-description">
              <p>{product.description}</p>
            </div>
            
            {/* Выбор цвета */}
            {(product.availableColors || product.colors) && (product.availableColors || product.colors).length > 0 && (
              <div className="product-colors">
                <div className="option-label">Цвет: {currentColor && currentColor.name}</div>
                <div className="color-options">
                  {(product.availableColors || product.colors).map(color => (
                    <div 
                      key={color.code}
                      className={`color-option ${selectedColor === color.code ? 'selected' : ''}`}
                      style={{ backgroundColor: color.code }}
                      title={color.name}
                      onClick={() => setSelectedColor(color.code)}
                    ></div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Выбор размера */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="product-sizes">
                <div className="option-label">Размер:</div>
                <div className="size-options">
                  {product.sizes.map(size => (
                    <div 
                      key={size}
                      className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Наличие */}
            <div className="product-availability">
              <span className={`availability-indicator ${product.stock || 'in-stock'}`}>
                {product.stock === 'out-of-stock' ? 'Нет в наличии' : 
                 product.stock === 'low-stock' ? 'Осталось мало' : 
                 'В наличии'}
              </span>
            </div>
            
            {/* Количество и кнопки действий */}
            <div className="product-actions">
              <div className="quantity-control">
                <button 
                  className="quantity-btn minus"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <input 
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                  className="quantity-input"
                />
                <button 
                  className="quantity-btn plus"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 10}
                >
                  +
                </button>
              </div>
              
              <div className="action-buttons">
                <button 
                  className="add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={product.stock === 'out-of-stock'}
                >
                  {product.stock === 'out-of-stock' ? 'Нет в наличии' : 'Добавить в корзину'}
                </button>
                
                <button 
                  className={`wishlist-btn ${isInWishlist ? 'in-wishlist' : ''}`}
                  onClick={handleToggleWishlist}
                >
                  <span className="wishlist-icon">♡</span>
                </button>
              </div>
            </div>
            
            {/* Дополнительная информация */}
            <div className="product-meta">
              <div className="meta-item">
                <span className="meta-label">Артикул:</span>
                <span className="meta-value">{product.sku || product._id || product.id}</span>
              </div>
              
              <div className="meta-item">
                <span className="meta-label">Состав:</span>
                <span className="meta-value">{product.composition || 'Информация отсутствует'}</span>
              </div>
              
              {product.category && (
                <div className="meta-item">
                  <span className="meta-label">Категория:</span>
                  <span className="meta-value">{product.category}</span>
                </div>
              )}
            </div>
            
            {/* Информация о доставке */}
            <div className="delivery-info">
              <div className="info-item">
                <div className="info-icon">🚚</div>
                <div className="info-text">Бесплатная доставка при заказе от 5000 ₽</div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">↩️</div>
                <div className="info-text">Возврат в течение 14 дней</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Вкладки с дополнительной информацией */}
        <div className="product-tabs">
          <div className="tabs-header">
            <div className="tab active">Описание</div>
            <div className="tab">Характеристики</div>
            <div className="tab">Отзывы ({reviews.length})</div>
          </div>
          
          <div className="tab-content">
            <div className="tab-pane active">
              <h3>Описание</h3>
              <p>{product.description}</p>
              
              {product.details && (
                <div className="product-details">
                  <h4>Детали:</h4>
                  <ul>
                    {product.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Отзывы */}
        {reviews.length > 0 && (
          <div className="product-reviews">
            <h3>Отзывы клиентов</h3>
            
            <div className="reviews-list">
              {reviews.slice(0, showAllReviews ? reviews.length : 3).map(review => (
                <div key={review._id || review.id} className="review-item">
                  <div className="review-header">
                    <div className="reviewer-name">{review.author || 'Покупатель'}</div>
                    <div className="review-date">
                      {new Date(review.date || review.createdAt).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                  
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                  
                  <div className="review-content">
                    <p>{review.text || review.content}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {reviews.length > 3 && (
              <button 
                className="show-more-btn"
                onClick={toggleReviews}
              >
                {showAllReviews ? 'Показать меньше' : `Показать все отзывы (${reviews.length})`}
              </button>
            )}
          </div>
        )}
        
        {/* Похожие товары */}
        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h3>Похожие товары</h3>
            
            <div className="products-slider">
              {relatedProducts.map(relatedProduct => (
                <div key={relatedProduct._id || relatedProduct.id} className="related-product-card">
                  <a href={`/product/${relatedProduct._id || relatedProduct.id}`} className="product-link">
                    <div className="related-product-image">
                      <img 
                        src={relatedProduct.images && relatedProduct.images.length > 0 ? 
                          relatedProduct.images[0] : '/placeholder.jpg'
                        } 
                        alt={relatedProduct.name} 
                      />
                    </div>
                    
                    <div className="related-product-info">
                      <h4 className="related-product-name">{relatedProduct.name}</h4>
                      <div className="related-product-price">
                        {relatedProduct.originalPrice && (
                          <span className="original-price">{formatPrice(relatedProduct.originalPrice)}</span>
                        )}
                        <span className="current-price">{formatPrice(relatedProduct.price)}</span>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
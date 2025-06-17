// src/components/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductCard.css';

const ProductCard = ({ product, showCategory = false }) => {
  const [selectedColor, setSelectedColor] = useState(product.availableColors?.[0]?.code || null);
  
  const { _id, name, price, discount, images, category, availableColors } = product;
  
  // Вычисляем финальную цену с учетом скидки
  const finalPrice = discount ? Math.round(price * (1 - discount / 100)) : price;
  
  // Функция для правильного форматирования цены
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'decimal',
      minimumFractionDigits: 0
    }).format(price) + ' ₽';
  };
  
  // Выбираем картинку для отображения в зависимости от выбранного цвета
  const getDisplayImage = () => {
    if (availableColors && availableColors.length > 0 && selectedColor) {
      const colorVariant = availableColors.find(color => color.code === selectedColor);
      return colorVariant && colorVariant.image ? colorVariant.image : images?.[0];
    }
    return images?.[0];
  };
  
  return (
    <div className="product-card">
      <div className="product-image-container">
        <Link to={`/product/${_id}`} className="product-link">
          <img 
            src={getDisplayImage() || 'https://via.placeholder.com/300x400'}
            alt={name}
            className="product-image"
          />
          
          {/* Бейджи для скидок */}
          {discount > 0 && <span className="product-badge discount">-{discount}%</span>}
        </Link>
      </div>
      
      <div className="product-info">
        {/* Показываем категорию, если требуется */}
        {showCategory && category && (
          <div className="product-category">
            {category.toUpperCase()}
          </div>
        )}
        
        <h3 className="product-title">
          <Link to={`/product/${_id}`}>{name}</Link>
        </h3>
        
        <div className="product-price">
          {formatPrice(finalPrice)}
        </div>
        
        {/* Цветовые варианты в квадратиках */}
        {availableColors && availableColors.length > 0 && (
          <div className="product-colors">
            {availableColors.map(color => (
              <div 
                key={color.code}
                className={`color-option ${selectedColor === color.code ? 'active' : ''}`}
                style={{ backgroundColor: color.code }}
                onClick={() => setSelectedColor(color.code)}
                title={color.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
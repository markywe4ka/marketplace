// components/ImageContainer.jsx
import React, { useState } from 'react';
import '../styles/ImageContainer.css';

function ImageContainer({ 
  src, 
  alt, 
  className = '',
  fallbackColor = '#f0f0f0',
  lazyLoad = true
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // CSS классы для контейнера
  const containerClass = `mk-image-container ${className}`;
  
  // Обработчики событий изображения
  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => setHasError(true);
  
  return (
    <div 
      className={containerClass}
      style={{ backgroundColor: fallbackColor }}
    >
      {!hasError ? (
        <img 
          src={src} 
          alt={alt} 
          className={`mk-image ${imageLoaded ? 'mk-image-loaded' : 'mk-image-loading'}`}
          loading={lazyLoad ? "lazy" : "eager"}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      ) : (
        <div className="mk-image-placeholder" aria-label={alt}>
          <span>{alt.charAt(0) || 'M'}</span>
        </div>
      )}
      
      {/* Индикатор загрузки, отображается только при загрузке изображения */}
      {!imageLoaded && !hasError && (
        <div className="mk-image-loader">
          <div className="mk-spinner"></div>
        </div>
      )}
    </div>
  );
}

export default ImageContainer;
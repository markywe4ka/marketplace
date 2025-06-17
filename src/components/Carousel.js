import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../styles/Carousel.css';

/**
 * Reusable Carousel Component
 * @param {Array} items - Array of items to display in carousel
 * @param {Function} renderItem - Function to render each item
 * @param {Boolean} autoPlay - Whether to auto-play the carousel
 * @param {Number} interval - Time between slides in milliseconds
 * @param {Boolean} showIndicators - Whether to show indicators
 */
const Carousel = ({ items, renderItem, autoPlay = true, interval = 5000, showIndicators = true }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);
  
  const goToSlide = useCallback((index) => {
    setActiveIndex(index);
  }, []);
  
  const goToNextSlide = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % items.length);
  }, [items.length]);
  
  const goToPrevSlide = useCallback(() => {
    setActiveIndex(prev => (prev - 1 + items.length) % items.length);
  }, [items.length]);
  
  // Setup automatic slide switching
  useEffect(() => {
    if (autoPlay && items.length > 1) {
      intervalRef.current = setInterval(goToNextSlide, interval);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoPlay, goToNextSlide, interval, items.length]);
  
  // Pause autoplay on hover
  const handleMouseEnter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  
  const handleMouseLeave = () => {
    if (autoPlay && items.length > 1 && !intervalRef.current) {
      intervalRef.current = setInterval(goToNextSlide, interval);
    }
  };
  
  return (
    <div 
      className="mk-carousel" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="mk-carousel-inner">
        {items.map((item, index) => (
          <div
            key={typeof item.id !== 'undefined' ? item.id : index}
            className={`mk-carousel-item ${index === activeIndex ? 'mk-active' : ''}`}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      
      {items.length > 1 && (
        <>
          <button 
            className="mk-carousel-control mk-carousel-prev" 
            onClick={goToPrevSlide}
            aria-label="Previous slide"
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          
          <button 
            className="mk-carousel-control mk-carousel-next" 
            onClick={goToNextSlide}
            aria-label="Next slide"
          >
            <i className="bi bi-chevron-right"></i>
          </button>
          
          {showIndicators && (
            <div className="mk-carousel-indicators">
              {items.map((_, index) => (
                <button
                  key={index}
                  className={`mk-carousel-indicator ${index === activeIndex ? 'mk-active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Carousel;
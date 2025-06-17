import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  // Add click outside listener to close dropdown menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  return (
    <header className="mk-header" ref={headerRef}>
      <div className="mk-header-container">
        <div className="mk-section left">
          <button 
            className={`mk-menu-btn ${menuOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            aria-label="Menu"
            data-tooltip="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <nav className="mk-nav">
            <Link to="/" className={isActive('/') ? 'active' : ''}>Главная</Link>
            {/* Используем существующий маршрут для поиска */}
            <Link to="/search" className={isActive('/search') ? 'active' : ''}>Магазин</Link>
            {/* Исправляем пути к коллекциям в соответствии с App.js */}
            <Link to="/collections/women" className={isActive('/collections/women') ? 'active' : ''}>Электроника</Link>
            <Link to="/collections/men" className={isActive('/collections/men') ? 'active' : ''}>Запчасти</Link>
            {/* Для общей страницы коллекций используем SearchPage как в App.js */}
          </nav>
          
          {menuOpen && (
            <div className="mk-dropdown show">
              <Link to="/">Главная</Link>
              <Link to="/search">Магазин</Link>
              {/* Исправляем пути в выпадающем меню */}
              <Link to="/collections/women">Женщинам</Link>
              <Link to="/collections/men">Мужчинам</Link>
              <Link to="/collections">Коллекции</Link>
              {/* Используем существующий маршрут SearchPage для этих страниц */}
              <Link to="/about/collaboration">О нас</Link>
              {/* Для страницы контактов нужно будет добавить маршрут в App.js */}
              <Link to="/search?q=contact">Контакты</Link>
            </div>
          )}
        </div>
        
        <div className="mk-section center">
          <Link to="/" className="mk-logo">Anatrans</Link>
        </div>
        
        <div className="mk-section right">
          <div className="mk-search">
            <Link to="/search">
              <i className="bi bi-search"></i>
            </Link>
            <input type="text" placeholder="Поиск..." />
          </div>
          <Link to="/profile" data-tooltip="Профиль">
            <i className="bi bi-person"></i>
          </Link>
          {/* Для избранного можно использовать SearchPage с параметром */}
          <Link to="/search?favorites=true" data-tooltip="Избранное">
            <i className="bi bi-heart"></i>
          </Link>
          <Link to="/cart" className="mk-cart-icon" data-tooltip="Корзина">
            <i className="bi bi-bag"></i>
            <span className="mk-cart-count">0</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
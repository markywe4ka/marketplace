// Файл: src/components/Footer.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="mk-footer">
      <div className="mk-container">
        <div className="mk-footer-grid">
          
          {/* Меню разделов каталога */}
          <div className="mk-footer-column">
            <h5 className="mk-footer-heading">Каталог</h5>
            <ul className="mk-footer-list">
              <li><Link to="/search?category=Тормозная%20система" className="mk-footer-link">Тормозная система</Link></li>
              <li><Link to="/search?category=Двигатель" className="mk-footer-link">Двигатель</Link></li>
              <li><Link to="/search?category=Трансмиссия" className="mk-footer-link">Трансмиссия</Link></li>
              <li><Link to="/search?category=Электрика" className="mk-footer-link">Электрика</Link></li>
            </ul>
          </div>

          {/* Меню поддержки */}
          <div className="mk-footer-column">
            <h5 className="mk-footer-heading">Поддержка</h5>
            <ul className="mk-footer-list">
              <li><Link to="/shipping" className="mk-footer-link">Доставка и возврат</Link></li>
              <li><Link to="/help" className="mk-footer-link">Помощь и FAQ</Link></li>
              <li><Link to="/terms" className="mk-footer-link">Правила и условия</Link></li>
              <li><Link to="/privacy" className="mk-footer-link">Политика конфиденциальности</Link></li>
              <li><Link to="/contact" className="mk-footer-link">Контакты</Link></li>
            </ul>
          </div>

          {/* Подписка и соцсети */}
          <div className="mk-footer-column">
            <h5 className="mk-footer-heading">Подписка</h5>
            <p className="mk-footer-text">
              Подпишитесь на нашу рассылку, чтобы получать новости и спецпредложения.
            </p>
            <div className="mk-social-icons">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="mk-social-icon">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="mk-social-icon">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="mk-social-icon">
                <i className="bi bi-twitter"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Нижняя часть футера */}
        <div className="mk-footer-bottom">
          <p className="mk-copyright">
            © 2025 TruckPartsStore. Все права защищены.
          </p>
          <div className="mk-payment-icons">
            <img src="/api/placeholder/40/25?text=VISA"   alt="Visa"      className="mk-payment-icon" />
            <img src="/api/placeholder/40/25?text=MC"     alt="Mastercard" className="mk-payment-icon" />
            <img src="/api/placeholder/40/25?text=PAYPAL" alt="PayPal"     className="mk-payment-icon" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

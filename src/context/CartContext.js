import React, { createContext, useState, useContext, useEffect } from 'react';

// Создание контекста
const CartContext = createContext();

// Hook для использования контекста корзины
export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  // Начальное состояние корзины - проверяем localStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Сохранение корзины в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Добавление товара в корзину
  const addToCart = (product) => {
    setCart(prevCart => {
      // Проверяем, есть ли уже такой товар в корзине
      const existingItemIndex = prevCart.findIndex(
        item => 
          item.id === product.id && 
          item.color === product.color && 
          item.size === product.size
      );

      if (existingItemIndex !== -1) {
        // Если товар есть, обновляем количество
        const updatedCart = [...prevCart];
        const newQuantity = updatedCart[existingItemIndex].quantity + product.quantity;
        updatedCart[existingItemIndex].quantity = Math.min(newQuantity, 10); // Ограничение в 10 штук
        return updatedCart;
      } else {
        // Если товара нет, добавляем новый
        return [...prevCart, product];
      }
    });
  };

  // Удаление товара из корзины
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // Обновление количества товара
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 10) return; // Проверка на допустимые значения
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Очистка корзины
  const clearCart = () => {
    setCart([]);
  };

  // Подсчет общего количества товаров в корзине
  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Подсчет общей стоимости корзины
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Объект значений контекста
  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemsCount,
    getCartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
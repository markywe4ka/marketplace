// Получение корзины из локального хранилища
export const getCartFromStorage = () => {
    const cartItems = localStorage.getItem('cartItems');
    return cartItems ? JSON.parse(cartItems) : [];
  };
  
  // Добавление товара в корзину
  export const addToCart = (product, quantity) => {
    const cartItems = getCartFromStorage();
    
    const existingItem = cartItems.find(item => item._id === product._id);
    
    if (existingItem) {
      // Если товар уже в корзине, обновляем количество
      const updatedItems = cartItems.map(item => 
        item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return updatedItems;
    } else {
      // Если товара еще нет в корзине, добавляем его
      const newCartItems = [...cartItems, { ...product, quantity }];
      localStorage.setItem('cartItems', JSON.stringify(newCartItems));
      return newCartItems;
    }
  };
  
  // Удаление товара из корзины
  export const removeFromCart = (productId) => {
    const cartItems = getCartFromStorage();
    const updatedItems = cartItems.filter(item => item._id !== productId);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    return updatedItems;
  };
  
  // Обновление количества товара в корзине
  export const updateCartItemQuantity = (productId, quantity) => {
    const cartItems = getCartFromStorage();
    const updatedItems = cartItems.map(item => 
      item._id === productId ? { ...item, quantity } : item
    );
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    return updatedItems;
  };
  
  // Очистка корзины
  export const clearCart = () => {
    localStorage.removeItem('cartItems');
    return [];
  };
  
  // Расчет общей стоимости корзины
  export const calculateCartTotal = (cartItems) => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
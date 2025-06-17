import axios from 'axios';

// Базовый URL вашего API сервера
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Создаем инстанс axios с базовым URL
const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Таймаут запроса (10 секунд)
  headers: {
    'Content-Type': 'application/json'
  }
});

// Перехватчик запросов - добавляет токен авторизации
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Перехватчик ответов - обрабатывает ошибки авторизации
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Если ошибка 401 (не авторизован), выполняем выход пользователя
    if (error.response && error.response.status === 401) {
      // Удаляем токен
      localStorage.removeItem('token');
      // Перенаправляем на страницу входа
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API для работы с продуктами
export const productAPI = {
  // Получение всех продуктов с возможностью фильтрации
  getProducts: async (params = {}) => {
    try {
      const response = await API.get('/products', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  
  // Получение мужской коллекции
  getMensProducts: async (params = {}) => {
    try {
      const response = await API.get('/products/category/men', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching men\'s products:', error);
      throw error;
    }
  },
  
  // Получение женской коллекции
  getWomensProducts: async (params = {}) => {
    try {
      const response = await API.get('/products/category/women', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching women\'s products:', error);
      throw error;
    }
  },
  
  // Получение продукта по ID
  getProductById: async (id) => {
    try {
      const response = await API.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Поиск продуктов
  searchProducts: async (query, params = {}) => {
    try {
      const response = await API.get('/products/search', { 
        params: { query, ...params } 
      });
      return response.data;
    } catch (error) {
      console.error(`Error searching products with query "${query}":`, error);
      throw error;
    }
  },
  
  // Получение новых поступлений
  getNewArrivals: async (limit = 8) => {
    try {
      const response = await API.get('/products/new', { 
        params: { limit } 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      throw error;
    }
  },
  
  // Получение популярных товаров
  getFeaturedProducts: async (limit = 8) => {
    try {
      const response = await API.get('/products/featured', { 
        params: { limit } 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  },
  
  // Получение товаров со скидкой
  getSaleProducts: async (limit = 8) => {
    try {
      const response = await API.get('/products/sale', { 
        params: { limit } 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching sale products:', error);
      throw error;
    }
  }
};

// API для работы с категориями
export const categoryAPI = {
  // Получение всех категорий
  getCategories: async () => {
    try {
      const response = await API.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
  
  // Получение категории по ID или slug
  getCategoryBySlug: async (slug) => {
    try {
      const response = await API.get(`/categories/${slug}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category with slug ${slug}:`, error);
      throw error;
    }
  },
  
  // Получение товаров по категории
  getProductsByCategory: async (categoryId, params = {}) => {
    try {
      const response = await API.get(`/products/category/${categoryId}`, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching products for category ${categoryId}:`, error);
      throw error;
    }
  }
};

// API для работы с корзиной
export const cartAPI = {
  // Получение корзины пользователя
  getCart: async () => {
    try {
      const response = await API.get('/cart');
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },
  
  // Добавление товара в корзину
  addToCart: async (productId, quantity = 1, options = {}) => {
    try {
      const response = await API.post('/cart/add', { 
        productId, 
        quantity, 
        ...options 
      });
      return response.data;
    } catch (error) {
      console.error(`Error adding product ${productId} to cart:`, error);
      throw error;
    }
  },
  
  // Обновление количества товара в корзине
  updateCartItem: async (productId, quantity) => {
    try {
      const response = await API.put('/cart/update', { 
        productId, 
        quantity 
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${productId} in cart:`, error);
      throw error;
    }
  },
  
  // Удаление товара из корзины
  removeFromCart: async (productId) => {
    try {
      const response = await API.delete(`/cart/remove/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing product ${productId} from cart:`, error);
      throw error;
    }
  },
  
  // Очистка корзины
  clearCart: async () => {
    try {
      const response = await API.delete('/cart/clear');
      return response.data;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
};

// API для работы с аутентификацией
export const authAPI = {
  // Регистрация пользователя
  register: async (userData) => {
    try {
      const response = await API.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },
  
  // Вход пользователя
  login: async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },
  
  // Выход пользователя
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Можно добавить запрос к API для инвалидации токена на сервере
    // await API.post('/auth/logout');
  },
  
  // Получение данных текущего пользователя
  getCurrentUser: async () => {
    try {
      const response = await API.get('/auth/me');
      // Сохраняем данные пользователя в localStorage для быстрого доступа
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },
  
  // Обновление данных пользователя
  updateProfile: async (userData) => {
    try {
      const response = await API.put('/auth/profile', userData);
      // Обновляем данные пользователя в localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
  
  // Смена пароля
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await API.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },
  
  // Запрос на восстановление пароля
  forgotPassword: async (email) => {
    try {
      const response = await API.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw error;
    }
  },
  
  // Сброс пароля
  resetPassword: async (token, newPassword) => {
    try {
      const response = await API.post('/auth/reset-password', {
        token,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }
};

// API для работы с заказами
export const orderAPI = {
  // Создание заказа
  createOrder: async (orderData) => {
    try {
      const response = await API.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },
  
  // Получение заказов пользователя
  getUserOrders: async () => {
    try {
      const response = await API.get('/orders');
      return response.data;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },
  
  // Получение заказа по ID
  getOrderById: async (id) => {
    try {
      const response = await API.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Отмена заказа
  cancelOrder: async (id) => {
    try {
      const response = await API.put(`/orders/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error(`Error canceling order with ID ${id}:`, error);
      throw error;
    }
  }
};

// API для работы с отзывами
export const reviewAPI = {
  // Получение отзывов для продукта
  getProductReviews: async (productId) => {
    try {
      const response = await API.get(`/reviews/product/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for product ${productId}:`, error);
      throw error;
    }
  },
  
  // Добавление отзыва
  addReview: async (productId, reviewData) => {
    try {
      const response = await API.post('/reviews', {
        productId,
        ...reviewData
      });
      return response.data;
    } catch (error) {
      console.error(`Error adding review for product ${productId}:`, error);
      throw error;
    }
  },
  
  // Удаление отзыва
  deleteReview: async (reviewId) => {
    try {
      const response = await API.delete(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting review ${reviewId}:`, error);
      throw error;
    }
  }
};

// API для работы с избранным
export const wishlistAPI = {
  // Получение избранных товаров
  getWishlist: async () => {
    try {
      const response = await API.get('/wishlist');
      return response.data;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      throw error;
    }
  },
  
  // Добавление товара в избранное
  addToWishlist: async (productId) => {
    try {
      const response = await API.post('/wishlist/add', { productId });
      return response.data;
    } catch (error) {
      console.error(`Error adding product ${productId} to wishlist:`, error);
      throw error;
    }
  },
  
  // Удаление товара из избранного
  removeFromWishlist: async (productId) => {
    try {
      const response = await API.delete(`/wishlist/remove/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing product ${productId} from wishlist:`, error);
      throw error;
    }
  },
  
  // Проверка, находится ли товар в избранном
  isInWishlist: async (productId) => {
    try {
      const response = await API.get(`/wishlist/check/${productId}`);
      return response.data.inWishlist;
    } catch (error) {
      console.error(`Error checking if product ${productId} is in wishlist:`, error);
      throw error;
    }
  }
};

// Объединяем все API в один объект для удобного импорта
const api = {
  products: productAPI,
  categories: categoryAPI,
  cart: cartAPI,
  auth: authAPI,
  orders: orderAPI,
  reviews: reviewAPI,
  wishlist: wishlistAPI
};

export default api;
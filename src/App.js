import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import OrderDetailsPage from './pages/OrderDetailsPage';

import { AuthProvider } from './context/AuthContext';

// Components
import './components/Header';
import './components/Footer';
import './styles/HomePage.css';
import './styles/ImageContainer.css';
import './styles/ProductCard.css';
import './styles/CollectionPage.css';
import './styles/SearchPage.css';
import './styles/ProductPage.css';
import './styles/CartPage.css';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import Layout from './components/Layout'; // Layout wrapper for site

// Pages
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import NotFoundPage from './pages/NotFoundPage';
 // 404 page

// Collection Pages
import MensCollectionPage from './pages/MensCollection';
import WomensCollectionPage from './pages/WomensCollection';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductEdit from './pages/admin/AdminProductEdit';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminCategories from './pages/admin/AdminCategories';
import AdminInventory from './pages/admin/AdminInventory';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public routes with shared Layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="product/:id" element={<ProductPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="order-success" element={<OrderSuccessPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="order/:id" element={<OrderDetailsPage />} />
              
              {/* Collection routes */}
              <Route path="collections/women" element={<WomensCollectionPage />} />
              <Route path="collections/men" element={<MensCollectionPage />} />
              
              {/* Make sure these match the paths used in HomePage.js */}
              <Route path="collection/:slug" element={<SearchPage />} />
              <Route path="collections/:type" element={<SearchPage />} />
              
              {/* Additional routes */}
              <Route path="lookbook" element={<SearchPage />} />
              <Route path="shoes" element={<SearchPage />} />
              <Route path="about/collaboration" element={<SearchPage />} />

              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="orders"
                element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                }
              />
              {/* 404 route - must be last in the list */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Admin routes */}
            <Route
              path="/admin"
              element={<AdminLayout />}
            >
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<AdminProductEdit />} />
              <Route path="products/edit/:id" element={<AdminProductEdit />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
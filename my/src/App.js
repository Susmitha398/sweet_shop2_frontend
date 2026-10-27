import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';

// Pages
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import SweetDetailPage from './pages/SweetDetailPage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <LocationProvider>
          <CartProvider>
            <div className="royal-app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Navbar />
              <CartDrawer />
              <Toast />

              <main style={{ flex: 1 }}>
                <Routes>
                  {/* Home Page with multiple sweet sections */}
                  <Route path="/" element={<HomePage />} />

                  {/* Dedicated Category Page (e.g. /category/alwa, /category/laddu, etc.) */}
                  <Route path="/category/:categorySlug" element={<CategoryPage />} />

                  {/* Sweet Product Details */}
                  <Route path="/sweet/:identifier" element={<SweetDetailPage />} />

                  {/* Navbar Search Results */}
                  <Route path="/search" element={<SearchPage />} />

                  {/* Shopping Cart */}
                  <Route path="/cart" element={<CartPage />} />

                  {/* Final Purchase / Checkout */}
                  <Route path="/checkout" element={<CheckoutPage />} />

                  {/* Order Confirmation & Receipt */}
                  <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />

                  {/* User Authentication */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              <Footer />
            </div>
          </CartProvider>
        </LocationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

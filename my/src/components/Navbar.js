import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation as useRouterLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import '../styles/Navbar.css';

import API_BASE from '../config/api';

export default function Navbar() {
  const navigate = useNavigate();
  const routerLocation = useRouterLocation();
  const { cartCount, setIsCartOpen } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const {
    currentLocation,
    selectLocation,
    detectLiveLocation,
    isDetectingGps,
    isLocationModalOpen,
    setIsLocationModalOpen,
    availableLocations
  } = useLocation();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef(null);

  // User menu dropdown
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Categories list
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setCategories(data.data);
      })
      .catch(err => console.warn('Categories fetch error:', err));
  }, []);

  // Debounced search for live suggestions
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchSuggestions([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsSearching(true);
      fetch(`${API_BASE}/sweets?search=${encodeURIComponent(searchQuery.trim())}`)
        .then(res => res.json())
        .then(data => {
          setIsSearching(false);
          if (data.success) {
            setSearchSuggestions(data.data.slice(0, 6)); // Top 6 matches
            setShowSearchDropdown(true);
          }
        })
        .catch(() => setIsSearching(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="royal-header">
      {/* 1. TOP ANNOUNCEMENT STRIP */}
      <div className="top-announcement-strip">
        <div className="container top-announcement-content">
          <span>✨ <strong>100% Pure Desi Ghee Guarantee</strong> • Farm Fresh Ingredients</span>
          <span>⚡ Express Delivery in 20-30 Mins from Nearest Sweet Depot</span>
          <span className="announcement-badge">Code: SWEET10 for 10% OFF</span>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <div className="container navbar-main">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo">
          <div className="brand-icon-wrap">
            <span>👑</span>
          </div>
          <div className="brand-text-wrap">
            <span className="brand-title">Royal Mithai</span>
            <span className="brand-subtitle">Authentic Confections</span>
          </div>
        </Link>

        {/* Location Picker Button */}
        <button
          type="button"
          className="location-btn"
          onClick={() => setIsLocationModalOpen(true)}
          title="Change delivery location"
        >
          <span>📍</span>
          <div className="location-text">
            {currentLocation.name.split(',')[0]}
          </div>
          <span style={{ fontSize: '0.65rem' }}>▼</span>
        </button>

        {/* SEARCH BOX WITH LIVE AUTOCOMPLETE (Requested) */}
        <div className="navbar-search-container" ref={searchRef}>
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="search-input"
              placeholder="Search sweets (e.g. Tirunelveli Halwa, Laddu, Kaju Katli)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchSuggestions.length > 0) setShowSearchDropdown(true);
              }}
            />
            <button type="submit" className="search-submit-btn" aria-label="Search">
              {isSearching ? '⏳' : '🔍'}
            </button>
          </form>

          {/* Search Dropdown Results */}
          {showSearchDropdown && searchSuggestions.length > 0 && (
            <div className="search-dropdown">
              <div style={{ padding: '8px 14px', fontSize: '0.75rem', fontWeight: '700', color: '#9C8E84', textTransform: 'uppercase' }}>
                Matching Sweets ({searchSuggestions.length})
              </div>
              {searchSuggestions.map((item) => (
                <Link
                  key={item.id || item._id}
                  to={`/sweet/${item.slug || item.id}`}
                  className="search-dropdown-item"
                  onClick={() => setShowSearchDropdown(false)}
                >
                  <img src={item.image} alt={item.name} className="search-dropdown-img" />
                  <div className="search-dropdown-info">
                    <span className="search-dropdown-name">{item.name}</span>
                    <div className="search-dropdown-meta">
                      <span>🏷️ {item.category}</span>
                      <span>📍 {item.shopLocation ? item.shopLocation.split(',')[0] : 'Depot'}</span>
                    </div>
                  </div>
                  <div className="search-dropdown-price">
                    ₹{Math.round(item.pricePerKg * 0.52)}
                  </div>
                </Link>
              ))}
              <div style={{ padding: '10px 14px', textAlign: 'center', background: '#FAF7F2' }}>
                <button
                  type="button"
                  style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.85rem' }}
                  onClick={handleSearchSubmit}
                >
                  View all results for "{searchQuery}" →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Action Links */}
        <div className="navbar-actions">
          <Link
            to="/category/alwa"
            className="nav-alwa-special-btn"
            title="Exclusive Halwa Showcase"
          >
            <span>👑</span>
            <span>Halwa (Alwa) Specials</span>
          </Link>

          {/* User Auth: Login or Profile Dropdown */}
          {isAuthenticated ? (
            <div className="auth-user-dropdown" ref={userMenuRef}>
              <button
                type="button"
                className="auth-user-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span>👤</span>
                <span>{user.name.split(' ')[0]}</span>
                <span style={{ fontSize: '0.65rem' }}>▼</span>
              </button>

              {showUserMenu && (
                <div className="user-menu-popover">
                  <div className="user-menu-header">
                    <div className="user-menu-name">{user.name}</div>
                    <div className="user-menu-email">{user.email}</div>
                  </div>
                  <Link
                    to="/cart"
                    className="user-menu-item"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <span>🛒</span> My Cart ({cartCount})
                  </Link>
                  <button
                    type="button"
                    className="user-menu-item"
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-nav-login">
              Login / Sign Up
            </Link>
          )}

          {/* Cart Drawer Trigger */}
          <button
            type="button"
            className="nav-cart-btn"
            onClick={() => setIsCartOpen(true)}
            aria-label="View Cart"
          >
            <span>🛒</span>
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="nav-cart-badge">{cartCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* 3. SECONDARY CATEGORY STRIP */}
      <div className="container secondary-category-strip">
        <Link
          to="/"
          className={`strip-cat-link ${routerLocation.pathname === '/' ? 'active' : ''}`}
        >
          🏠 All Sweets
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id || cat.slug}
            to={`/category/${cat.slug}`}
            className={`strip-cat-link ${routerLocation.pathname === `/category/${cat.slug}` ? 'active' : ''}`}
          >
            {cat.badge ? cat.badge.split(' ')[0] : '🍬'} {cat.name}
          </Link>
        ))}
      </div>

      {/* 4. LOCATION SELECTION MODAL */}
      {isLocationModalOpen && (
        <div className="modal-overlay" onClick={() => setIsLocationModalOpen(false)}>
          <div className="location-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Select Delivery Location</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsLocationModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#6B5E55', marginBottom: '16px' }}>
              We calculate the exact distance in km and delivery time from our sweet shops to your location.
            </p>

            <button
              type="button"
              className="location-gps-btn"
              onClick={detectLiveLocation}
              disabled={isDetectingGps}
            >
              <span>{isDetectingGps ? '⏳ Detecting GPS...' : '📍 Use My Current Live Location'}</span>
            </button>

            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#9C8E84', marginBottom: '8px', textTransform: 'uppercase' }}>
              Or Choose Branch / City Area:
            </div>

            <div className="location-list">
              {availableLocations.map((loc) => (
                <div
                  key={loc.name}
                  className={`location-option-item ${currentLocation.name === loc.name ? 'selected' : ''}`}
                  onClick={() => selectLocation(loc)}
                >
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{loc.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6B5E55' }}>{loc.state}</div>
                  </div>
                  {currentLocation.name === loc.name && (
                    <span style={{ color: 'var(--primary)', fontWeight: '800' }}>✓ Active</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

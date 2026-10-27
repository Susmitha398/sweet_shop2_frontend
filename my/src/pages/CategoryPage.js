import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SweetCard from '../components/SweetCard';
import { useLocation } from '../context/LocationContext';
import '../styles/Category.css';

import API_BASE from '../config/api';

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const { currentLocation } = useLocation();

  const [categoryInfo, setCategoryInfo] = useState(null);
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting
  const [sortBy, setSortBy] = useState('recommended');
  const [dietaryFilter, setDietaryFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    Promise.all([
      fetch(`${API_BASE}/categories/${categorySlug}`).then(r => r.json()),
      fetch(`${API_BASE}/sweets?category=${categorySlug}&userLat=${currentLocation.lat}&userLng=${currentLocation.lng}`).then(r => r.json())
    ])
      .then(([catData, sweetData]) => {
        if (catData.success) setCategoryInfo(catData.data);
        if (sweetData.success) setSweets(sweetData.data);
        setLoading(false);
      })
      .catch(err => {
        console.warn('Category fetch error:', err);
        setLoading(false);
      });
  }, [categorySlug, currentLocation]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>👑</div>
        <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary)' }}>
          Loading Category Sweets...
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Preparing authentic sweets for your celebration</p>
      </div>
    );
  }

  // Filter by dietary
  let filteredSweets = [...sweets];
  if (dietaryFilter === 'ghee') {
    filteredSweets = filteredSweets.filter(s => s.dietary && s.dietary.toLowerCase().includes('ghee'));
  } else if (dietaryFilter === 'sugarfree') {
    filteredSweets = filteredSweets.filter(s => s.dietary && s.dietary.toLowerCase().includes('sugar-free'));
  }

  // Sort
  if (sortBy === 'price-asc') {
    filteredSweets.sort((a, b) => a.pricePerKg - b.pricePerKg);
  } else if (sortBy === 'price-desc') {
    filteredSweets.sort((a, b) => b.pricePerKg - a.pricePerKg);
  } else if (sortBy === 'rating') {
    filteredSweets.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'distance') {
    filteredSweets.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  }

  return (
    <div className="container" style={{ paddingTop: '1rem', paddingBottom: '3rem' }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        <Link to="/" style={{ color: 'var(--primary)', fontWeight: '600' }}>Home</Link>
        {' '}/ Category /{' '}
        <span style={{ color: 'var(--text-primary)', fontWeight: '700' }}>
          {categoryInfo ? categoryInfo.name : categorySlug}
        </span>
      </div>

      {/* Category Hero Banner */}
      <div className="category-hero">
        <div className="category-hero-info">
          <span className="category-badge-pill">
            {categoryInfo?.badge || '👑 Heritage Category'}
          </span>
          <h1 className="category-title">
            {categoryInfo ? categoryInfo.name : `${categorySlug.toUpperCase()} Specials`}
          </h1>
          <p className="category-tagline">
            {categoryInfo?.tagline || 'Slow-simmered in 100% pure desi ghee with authentic traditional recipes.'}
          </p>
          <div style={{ fontSize: '0.84rem', color: 'var(--gold-dark)', fontWeight: '700', marginTop: '10px' }}>
            Showing {filteredSweets.length} exclusive sweets in this category
          </div>
        </div>

        {categoryInfo?.image && (
          <img
            src={categoryInfo.image}
            alt={categoryInfo.name}
            className="category-hero-img"
          />
        )}
      </div>

      {/* Filter and Sort Controls */}
      <div className="category-filter-bar">
        <div className="filter-group">
          <span className="filter-label">Filter:</span>
          <div className="dietary-pills">
            <button
              type="button"
              className={`dietary-pill ${dietaryFilter === 'all' ? 'active' : ''}`}
              onClick={() => setDietaryFilter('all')}
            >
              All Sweets
            </button>
            <button
              type="button"
              className={`dietary-pill ${dietaryFilter === 'ghee' ? 'active' : ''}`}
              onClick={() => setDietaryFilter('ghee')}
            >
              🧈 Pure Desi Ghee
            </button>
            <button
              type="button"
              className={`dietary-pill ${dietaryFilter === 'sugarfree' ? 'active' : ''}`}
              onClick={() => setDietaryFilter('sugarfree')}
            >
              🌿 Sugar Free / Healthy
            </button>
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-label">Sort By:</span>
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recommended">⭐ Recommended</option>
            <option value="rating">★ Highest Rated</option>
            <option value="price-asc">💰 Price: Low to High</option>
            <option value="price-desc">💰 Price: High to Low</option>
            <option value="distance">📍 Nearest Shop Distance (KM)</option>
          </select>

          <span className="category-results-count">
            ({filteredSweets.length} Items)
          </span>
        </div>
      </div>

      {/* Sweets Grid - Every single sweet has image, shop location, distance km, rate, offer, rating */}
      {filteredSweets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🍬</div>
          <h3 style={{ color: 'var(--text-primary)' }}>No sweets matched this filter</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
            Try resetting your dietary filter to view all sweets in this category.
          </p>
          <button
            type="button"
            className="btn-add-cart"
            onClick={() => setDietaryFilter('all')}
          >
            Show All {categoryInfo ? categoryInfo.name : 'Sweets'}
          </button>
        </div>
      ) : (
        <div className="sweets-grid">
          {filteredSweets.map((sweet) => (
            <SweetCard key={sweet.id || sweet._id} sweet={sweet} />
          ))}
        </div>
      )}
    </div>
  );
}

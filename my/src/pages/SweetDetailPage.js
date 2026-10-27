import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart, calculateItemPrice } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';
import SweetCard from '../components/SweetCard';
import ProductImage from '../components/ProductImage';
import '../styles/SweetDetail.css';

import API_BASE from '../config/api';

export default function SweetDetailPage() {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const { currentLocation, getDistanceToShop } = useLocation();

  const [sweet, setSweet] = useState(null);
  const [relatedSweets, setRelatedSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeight, setSelectedWeight] = useState('500g');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('desc');

  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    fetch(`${API_BASE}/sweets/${identifier}?userLat=${currentLocation.lat}&userLng=${currentLocation.lng}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setSweet(data.data);
          // Fetch related sweets in same category
          return fetch(`${API_BASE}/sweets?category=${data.data.categorySlug}&userLat=${currentLocation.lat}&userLng=${currentLocation.lng}`);
        }
        throw new Error('Sweet not found');
      })
      .then(res => res.json())
      .then(catData => {
        if (catData.success) {
          setRelatedSweets(catData.data.filter(s => s.slug !== identifier && s.id !== identifier).slice(0, 4));
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn('Sweet detail error:', err);
        setLoading(false);
      });
  }, [identifier, currentLocation]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>👑</div>
        <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary)' }}>
          Loading Royal Sweet Delicacy...
        </h2>
      </div>
    );
  }

  if (!sweet) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Sweet not found</h2>
        <Link to="/" className="btn-add-cart" style={{ display: 'inline-block', marginTop: '16px' }}>
          Back to Sweets Menu
        </Link>
      </div>
    );
  }

  // Price calculations
  const unitPrice = calculateItemPrice(sweet, selectedWeight);
  const baseOriginalPrice = sweet.originalPricePerKg || Math.round(sweet.pricePerKg * 1.18);
  const weightMultiplier = selectedWeight === '250g' ? 0.28 : selectedWeight === '500g' ? 0.52 : 1.0;
  const originalPrice = Math.round(baseOriginalPrice * weightMultiplier);
  const savings = Math.max(0, originalPrice - unitPrice);
  const totalItemPrice = unitPrice * quantity;

  // Dynamic distance & delivery minutes
  const distanceKm = getDistanceToShop(sweet.shopCoordinates, sweet.distanceBaseKm || 2.4);
  const deliveryMinutes = Math.max(15, Math.round(15 + distanceKm * 3.5));

  const handleAddToCart = () => {
    addToCart(sweet, selectedWeight, quantity);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    addToCart(sweet, selectedWeight, quantity);
    navigate('/checkout');
  };

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
        <Link to="/" style={{ color: 'var(--primary)', fontWeight: '600' }}>Home</Link>
        {' '}/ <Link to={`/category/${sweet.categorySlug}`} style={{ color: 'var(--primary)', fontWeight: '600' }}>{sweet.category}</Link>
        {' '}/ <span style={{ color: 'var(--text-primary)', fontWeight: '700' }}>{sweet.name}</span>
      </div>

      {/* Main Sweet Detail Card */}
      <div className="sweet-detail-layout">
        {/* Left: Product Image */}
        <div className="detail-gallery-wrap">
          <ProductImage src={sweet.image} alt={sweet.name} className="detail-main-img" />
          {sweet.isBestseller && (
            <span className="detail-badge-top">👑 Royal Bestseller</span>
          )}
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="detail-info-col">
          {/* Shop Location and Distance in KM */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
            <div className="detail-location-pill">
              <span>🏬</span>
              <span>{sweet.shopLocation}</span>
            </div>
            <div className="detail-distance-badge" title="Distance from your chosen location">
              <span>📍 {distanceKm} km away</span>
              <span>• ⚡ {deliveryMinutes} mins delivery</span>
            </div>
          </div>

          {/* Rating & Offer Tag */}
          <div className="detail-rating-offer-bar">
            <span className="detail-rating-badge">
              ★ {Number(sweet.rating || 4.8).toFixed(1)}
            </span>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              ({sweet.reviewsCount || 850} verified customer reviews)
            </span>
            {sweet.offer && (
              <span className="detail-offer-tag">🏷️ {sweet.offer}</span>
            )}
          </div>

          <h1 className="detail-title">{sweet.name}</h1>
          <Link to={`/category/${sweet.categorySlug}`} className="detail-category-link">
            Explore all {sweet.category} →
          </Link>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '14px' }}>
            {sweet.description}
          </p>

          {/* Weight Selection Pills */}
          <div className="detail-weight-section">
            <div className="detail-weight-title">Select Pack Weight:</div>
            <div className="detail-weight-options">
              {['250g', '500g', '1kg'].map((w) => (
                <button
                  key={w}
                  type="button"
                  className={`detail-weight-btn ${selectedWeight === w ? 'selected' : ''}`}
                  onClick={() => setSelectedWeight(w)}
                >
                  {w === '250g' ? 'Small Pack (250g)' : w === '500g' ? 'Family Pack (500g)' : 'Royal Box (1kg)'}
                </button>
              ))}
            </div>
          </div>

          {/* Price Box */}
          <div className="detail-price-box">
            <span className="detail-current-price">₹{totalItemPrice}</span>
            {originalPrice > unitPrice && (
              <span className="detail-original-price">₹{originalPrice * quantity}</span>
            )}
            {savings > 0 && (
              <span className="detail-savings-pill">Save ₹{savings * quantity}</span>
            )}
            <span style={{ marginLeft: 'auto', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              (₹{unitPrice} per {selectedWeight})
            </span>
          </div>

          {/* Quantity and Actions */}
          <div className="detail-actions-row">
            <div className="detail-qty-control">
              <button
                type="button"
                className="detail-qty-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="detail-qty-val">{quantity}</span>
              <button
                type="button"
                className="detail-qty-btn"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="btn-detail-add-cart"
              onClick={handleAddToCart}
            >
              🛒 Add to Cart
            </button>

            <button
              type="button"
              className="btn-detail-buy-now"
              onClick={handleBuyNow}
            >
              ⚡ Buy Now
            </button>
          </div>

          <div style={{ marginTop: '16px', fontSize: '0.8rem', color: '#6B5E55' }}>
            ⚡ In Stock • Freshly packed in food-grade tin containers upon order.
          </div>
        </div>
      </div>

      {/* Tabs: Description, Ingredients, Shelf life */}
      <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--border-light)', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '16px' }}>
          <button
            type="button"
            style={{
              fontWeight: '700',
              fontSize: '0.95rem',
              color: activeTab === 'desc' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'desc' ? '2.5px solid var(--primary)' : 'none',
              paddingBottom: '8px'
            }}
            onClick={() => setActiveTab('desc')}
          >
            Heritage Recipe & Story
          </button>
          <button
            type="button"
            style={{
              fontWeight: '700',
              fontSize: '0.95rem',
              color: activeTab === 'ing' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'ing' ? '2.5px solid var(--primary)' : 'none',
              paddingBottom: '8px'
            }}
            onClick={() => setActiveTab('ing')}
          >
            Ingredients & Purity
          </button>
          <button
            type="button"
            style={{
              fontWeight: '700',
              fontSize: '0.95rem',
              color: activeTab === 'storage' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'storage' ? '2.5px solid var(--primary)' : 'none',
              paddingBottom: '8px'
            }}
            onClick={() => setActiveTab('storage')}
          >
            Shelf Life & Storage
          </button>
        </div>

        {activeTab === 'desc' && (
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.94rem' }}>
            {sweet.detailedDescription || sweet.description}
          </p>
        )}

        {activeTab === 'ing' && (
          <div>
            <div style={{ fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>
              Handpicked Pure Ingredients:
            </div>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              {sweet.ingredients?.map((ing, idx) => (
                <li key={idx}><strong>{ing}</strong></li>
              ))}
              <li>100% Zero Synthetic Colors, Preservatives or Artificial Flavors</li>
            </ul>
          </div>
        )}

        {activeTab === 'storage' && (
          <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            <p><strong>Shelf Life:</strong> {sweet.shelfLife || '15 Days at room temperature'}</p>
            <p><strong>Storage Guidelines:</strong> Keep in a cool, dry place away from direct sunlight. To experience halwa at its best, warm gently for 10 seconds before serving.</p>
          </div>
        )}
      </div>

      {/* Related Sweets from same category */}
      {relatedSweets.length > 0 && (
        <section>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--primary)', marginBottom: '1.2rem' }}>
            More from {sweet.category}
          </h2>
          <div className="sweets-grid">
            {relatedSweets.map((s) => (
              <SweetCard key={s.id || s._id} sweet={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

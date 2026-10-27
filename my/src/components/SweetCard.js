import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart, calculateItemPrice } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';
import '../styles/SweetCard.css';
import ProductImage from './ProductImage';

export default function SweetCard({ sweet }) {
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const { getDistanceToShop } = useLocation();

  // Default to 500g
  const [selectedWeight, setSelectedWeight] = useState('500g');

  if (!sweet) return null;

  // Calculate live dynamic distance based on user location
  const distanceKm = getDistanceToShop(sweet.shopCoordinates, sweet.distanceBaseKm || 2.4);
  const deliveryMinutes = Math.max(15, Math.round(15 + distanceKm * 3.5));

  // Calculate price based on selected weight
  const currentPrice = calculateItemPrice(sweet, selectedWeight);
  const baseOriginalPrice = sweet.originalPricePerKg || Math.round(sweet.pricePerKg * 1.18);
  const weightMultiplier = selectedWeight === '250g' ? 0.28 : selectedWeight === '500g' ? 0.52 : 1.0;
  const originalPrice = Math.round(baseOriginalPrice * weightMultiplier);
  const savings = Math.max(0, originalPrice - currentPrice);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(sweet, selectedWeight, 1);
    setIsCartOpen(true);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    addToCart(sweet, selectedWeight, 1);
    navigate('/checkout');
  };

  const sweetLink = `/sweet/${sweet.slug || sweet.id}`;

  return (
    <div className="sweet-card">
      {/* 1. PRODUCT IMAGE */}
      <Link to={sweetLink} className="sweet-card-image-wrap">
        <ProductImage
          src={sweet.image}
          alt={sweet.name}
          className="sweet-card-image"
          loading="lazy"
        />
        {sweet.isBestseller && (
          <span className="sweet-card-badge-top">👑 Bestseller</span>
        )}
      </Link>

      {/* 2. DIRECTLY UNDERNEATH THE IMAGE (Requested: shop location, distance in km, rate, offer, rating) */}
      <div className="sweet-card-content">
        {/* SHOP LOCATION & DISTANCE IN KM */}
        <div className="sweet-location-row">
          <div className="sweet-shop-location" title={sweet.shopLocation}>
            <span role="img" aria-label="shop">🏬</span>
            <span>{sweet.shopLocation || 'Main Sweet Depot'}</span>
          </div>
          <div className="sweet-distance-badge" title="Distance from your current location">
            <span>📍 {distanceKm} km</span>
            <span>• ⚡ {deliveryMinutes}m</span>
          </div>
        </div>

        {/* RATING & OFFER */}
        <div className="sweet-rating-offer-row">
          <div className="sweet-rating-pill">
            <span>★ {Number(sweet.rating || 4.8).toFixed(1)}</span>
            <span className="sweet-reviews-count">({sweet.reviewsCount || 450})</span>
          </div>
          {sweet.offer && (
            <span className="sweet-offer-badge">🏷️ {sweet.offer}</span>
          )}
        </div>

        {/* PRODUCT NAME & SHORT DESCRIPTION */}
        <Link to={sweetLink}>
          <h3 className="sweet-title">{sweet.name}</h3>
        </Link>
        <p className="sweet-desc">{sweet.description}</p>

        {/* WEIGHT SELECTION PILLS */}
        <div className="sweet-weight-selector">
          <span className="sweet-weight-label">Weight:</span>
          <div className="sweet-weight-pills">
            {['250g', '500g', '1kg'].map(w => (
              <button
                key={w}
                type="button"
                className={`weight-pill ${selectedWeight === w ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedWeight(w);
                }}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        {/* RATE / PRICE */}
        <div className="sweet-price-row">
          <div className="sweet-price-group">
            <span className="sweet-current-price">₹{currentPrice}</span>
            {originalPrice > currentPrice && (
              <span className="sweet-original-price">₹{originalPrice}</span>
            )}
          </div>
          {savings > 0 && (
            <span className="sweet-savings-text">Save ₹{savings}</span>
          )}
        </div>

        {/* ACTIONS: ADD TO CART & BUY NOW */}
        <div className="sweet-card-actions">
          <button
            type="button"
            className="btn-add-cart"
            onClick={handleAddToCart}
          >
            🛒 Add to Cart
          </button>
          <button
            type="button"
            className="btn-buy-now"
            onClick={handleBuyNow}
          >
            ⚡ Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

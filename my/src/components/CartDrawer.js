import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/Cart.css';

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    cartCount,
    subtotal,
    deliveryFee,
    discount,
    totalAmount,
    updateQuantity,
    removeFromCart
  } = useCart();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleViewFullCart = () => {
    setIsCartOpen(false);
    navigate('/cart');
  };

  return (
    <div className="cart-drawer-backdrop" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-title">
            <span>🛒</span>
            <span>Your Sweet Cart ({cartCount})</span>
          </div>
          <button
            type="button"
            className="cart-drawer-close"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close Cart"
          >
            ✕
          </button>
        </div>

        {/* Free Delivery Threshold */}
        {subtotal < 500 ? (
          <div className="cart-delivery-indicator">
            <span>⚡ Add ₹{500 - subtotal} more for <strong>FREE Delivery</strong>!</span>
          </div>
        ) : (
          <div className="cart-delivery-indicator" style={{ background: '#E8F5E9', color: '#1B5E20' }}>
            <span>🎉 Congratulations! You have unlocked <strong>FREE Delivery</strong></span>
          </div>
        )}

        {/* Cart Items List */}
        <div className="cart-drawer-items">
          {cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <span className="empty-cart-icon">🍬</span>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>Your Cart is Empty</h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                Delicious Tirunelveli Halwas, Kaju Katlis and Motichoor Laddus are waiting for you!
              </p>
              <button
                type="button"
                className="btn-add-cart"
                style={{ marginTop: '10px' }}
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/category/alwa');
                }}
              >
                👑 Browse Halwa Specials
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.itemKey} className="cart-item-card">
                <img src={item.image} alt={item.name} className="cart-item-thumb" />
                <div className="cart-item-details">
                  <div className="cart-item-title">{item.name}</div>
                  <div className="cart-item-meta">
                    <span className="cart-item-weight-badge">{item.weight}</span>
                    <span className="cart-item-price-unit">₹{item.unitPrice} each</span>
                  </div>
                  <div className="cart-item-actions">
                    <div className="qty-counter">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateQuantity(item.itemKey, -1)}
                      >
                        -
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateQuantity(item.itemKey, 1)}
                      >
                        +
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span className="cart-item-total">₹{item.itemTotal}</span>
                      <button
                        type="button"
                        className="cart-item-remove-btn"
                        onClick={() => removeFromCart(item.itemKey)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-bill-row">
              <span>Item Subtotal:</span>
              <span>₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="cart-bill-row" style={{ color: 'var(--pistachio)' }}>
                <span>Festive Discount:</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <div className="cart-bill-row">
              <span>Delivery Charges:</span>
              <span>{deliveryFee === 0 ? <strong style={{ color: 'var(--pistachio)' }}>FREE</strong> : `₹${deliveryFee}`}</span>
            </div>
            <div className="cart-bill-row total-row">
              <span>To Pay:</span>
              <span>₹{totalAmount}</span>
            </div>

            <button
              type="button"
              className="btn-drawer-checkout"
              onClick={handleCheckout}
            >
              <span>Proceed to Purchase</span>
              <span>₹{totalAmount} →</span>
            </button>

            <button
              type="button"
              className="btn-view-full-cart"
              onClick={handleViewFullCart}
            >
              View Full Cart & Apply Coupons
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

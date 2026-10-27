import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/Cart.css';

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    cartCount,
    subtotal,
    deliveryFee,
    discount,
    totalAmount,
    appliedPromo,
    applyPromo,
    removePromo,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  const [inputCode, setInputCode] = useState('');

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (inputCode.trim()) {
      applyPromo(inputCode.trim());
      setInputCode('');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🛒</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary)', marginBottom: '8px' }}>
          Your Sweet Cart is Empty
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Explore our authentic Tirunelveli Halwas, Bengali Rasgullas and Kaju Katli confections!
        </p>
        <Link
          to="/category/alwa"
          style={{
            background: 'var(--primary)',
            color: '#FFFFFF',
            padding: '12px 28px',
            borderRadius: 'var(--radius-full)',
            fontWeight: '700',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          👑 Explore Royal Halwa Specials
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3.5rem' }}>
      <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
        <Link to="/" style={{ color: 'var(--primary)', fontWeight: '600' }}>Home</Link>
        {' '}/ Shopping Cart ({cartCount} items)
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--primary)', fontWeight: '900' }}>
          Shopping Cart
        </h1>
        <button
          type="button"
          style={{ color: '#C62828', fontSize: '0.86rem', fontWeight: '700', cursor: 'pointer' }}
          onClick={clearCart}
        >
          Clear All Items 🗑️
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '30px',
          alignItems: 'start'
        }}
      >
        {/* Left: Items Table */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {cartItems.map((item) => (
              <div
                key={item.itemKey}
                style={{
                  display: 'flex',
                  gap: '16px',
                  paddingBottom: '20px',
                  borderBottom: '1px solid #F5ECE3',
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '12px',
                    objectFit: 'cover',
                    border: '1px solid var(--border-light)'
                  }}
                />

                <div style={{ flex: 1, minWidth: '180px' }}>
                  <Link
                    to={`/sweet/${item.slug || item.sweetId}`}
                    style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-primary)' }}
                  >
                    {item.name}
                  </Link>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    <span>📍 {item.shopLocation}</span>
                  </div>
                  <div style={{ marginTop: '6px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span
                      style={{
                        background: 'var(--primary-subtle)',
                        color: 'var(--primary)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        border: '1px solid #FFCDD2'
                      }}
                    >
                      Weight: {item.weight}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      ₹{item.unitPrice} each
                    </span>
                  </div>
                </div>

                {/* Qty and Subtotal */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
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

                  <div style={{ fontWeight: '900', fontSize: '1.15rem', color: 'var(--text-primary)', minWidth: '70px', textAlign: 'right' }}>
                    ₹{item.itemTotal}
                  </div>

                  <button
                    type="button"
                    style={{ color: '#C62828', fontSize: '0.9rem', cursor: 'pointer' }}
                    onClick={() => removeFromCart(item.itemKey)}
                    title="Remove item"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem' }}>
              ← Add More Sweets
            </Link>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              100% Pure Desi Ghee Guarantee
            </span>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--text-primary)', fontWeight: '800' }}>
            Bill Summary
          </h2>

          <div className="cart-bill-row">
            <span>Item Total ({cartCount} items):</span>
            <span style={{ fontWeight: '700' }}>₹{subtotal}</span>
          </div>

          {appliedPromo && (
            <div className="cart-bill-row" style={{ color: 'var(--pistachio)' }}>
              <span>Festive Promo ({appliedPromo.code}):</span>
              <span style={{ fontWeight: '700' }}>-₹{discount}</span>
            </div>
          )}

          <div className="cart-bill-row">
            <span>Express Delivery Fee:</span>
            <span>{deliveryFee === 0 ? <strong style={{ color: 'var(--pistachio)' }}>FREE</strong> : `₹${deliveryFee}`}</span>
          </div>

          {subtotal < 500 && (
            <div style={{ fontSize: '0.78rem', color: '#8C4700', background: '#FEF3D6', padding: '6px 10px', borderRadius: '6px' }}>
              ⚡ Add ₹{500 - subtotal} more to get FREE express delivery!
            </div>
          )}

          <div className="cart-bill-row total-row">
            <span>Grand Total:</span>
            <span>₹{totalAmount}</span>
          </div>

          {/* Promo code input */}
          <div style={{ borderTop: '1px dashed #E0D4C5', paddingTop: '16px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-secondary)' }}>
              Have a Promo Code?
            </div>
            {appliedPromo ? (
              <div
                style={{
                  background: '#E8F5E9',
                  border: '1px solid #C8E6C9',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.85rem'
                }}
              >
                <span>🎉 <strong>{appliedPromo.code}</strong> Applied ({appliedPromo.discountPercent}% OFF)</span>
                <button
                  type="button"
                  style={{ color: '#C62828', fontWeight: '800', cursor: 'pointer' }}
                  onClick={removePromo}
                >
                  ✕
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="e.g. SWEET10"
                  className="form-input"
                  style={{ padding: '8px 12px', fontSize: '0.88rem', textTransform: 'uppercase' }}
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                />
                <button
                  type="submit"
                  style={{
                    background: 'var(--gold)',
                    color: '#FFFFFF',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: '800',
                    fontSize: '0.85rem'
                  }}
                >
                  Apply
                </button>
              </form>
            )}
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              Use coupon code <strong>SWEET10</strong> for 10% instant discount!
            </div>
          </div>

          <button
            type="button"
            className="btn-drawer-checkout"
            onClick={() => navigate('/checkout')}
          >
            <span>Proceed to Purchase</span>
            <span>₹{totalAmount} →</span>
          </button>
        </div>
      </div>
    </div>
  );
}

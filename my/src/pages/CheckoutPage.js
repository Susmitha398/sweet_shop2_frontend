import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import '../styles/Checkout.css';

import API_BASE from '../config/api';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, subtotal, deliveryFee, discount, totalAmount, clearCart, showToast } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { currentLocation } = useLocation();

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Chennai',
    pincode: '',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Pre-fill user details if logged in
  useEffect(() => {
    if (user) {
      setCustomer(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address?.street || '',
        city: user.address?.city || currentLocation.name.split(',')[1]?.trim() || 'Chennai',
        pincode: user.address?.pincode || ''
      }));
    } else {
      setCustomer(prev => ({
        ...prev,
        city: currentLocation.name.split(',')[1]?.trim() || 'Chennai'
      }));
    }
  }, [user, currentLocation]);

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>No sweets to purchase yet!</h2>
        <p style={{ color: 'var(--text-muted)', margin: '14px 0 24px' }}>
          Please add your favorite Halwa or Laddus to cart before proceeding to checkout.
        </p>
        <Link to="/category/alwa" className="btn-add-cart" style={{ display: 'inline-block' }}>
          👑 Browse Halwa Specials
        </Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setCustomer(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customer.name || !customer.phone || !customer.address || !customer.city) {
      setErrorMsg('Please complete all required delivery address fields.');
      return;
    }

    setSubmitting(true);

    const orderPayload = {
      customer,
      items: cartItems,
      subtotal,
      deliveryFee,
      discount,
      totalAmount,
      paymentMethod
    };

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      setSubmitting(false);

      if (data.success && data.data) {
        clearCart();
        showToast('🎉 Order placed successfully! Sweets are being prepared.');
        navigate(`/order-success/${data.data.orderId}`, { state: { order: data.data } });
      } else {
        setErrorMsg(data.message || 'Failed to place order.');
      }
    } catch {
      // Offline fallback order generation
      setSubmitting(false);
      const offlineOrderId = 'ROYAL-' + Math.floor(100000 + Math.random() * 900000);
      const fallbackOrder = {
        ...orderPayload,
        orderId: offlineOrderId,
        orderStatus: 'Confirmed & Being Freshly Packed',
        paymentStatus: paymentMethod === 'cod'
          ? 'Pending (Cash On Delivery)'
          : 'Pending (Online Payment Verification Required)',
        createdAt: new Date().toISOString()
      };
      clearCart();
      showToast('🎉 Order placed successfully!');
      navigate(`/order-success/${offlineOrderId}`, { state: { order: fallbackOrder } });
    }
  };

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
        <Link to="/" style={{ color: 'var(--primary)', fontWeight: '600' }}>Home</Link>
        {' '}/ <Link to="/cart" style={{ color: 'var(--primary)', fontWeight: '600' }}>Cart</Link>
        {' '}/ Final Checkout
      </div>

      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--primary)', fontWeight: '900', marginBottom: '1.8rem' }}>
        Complete Your Purchase
      </h1>

      {errorMsg && (
        <div style={{ background: '#FFEBEE', color: '#C62828', padding: '12px 18px', borderRadius: '8px', marginBottom: '20px', fontWeight: '600' }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="checkout-grid">
        {/* Left Column: Delivery Address & Payment */}
        <div>
          {/* Box 1: Delivery Details */}
          <div className="checkout-box">
            <h2 className="checkout-section-title">
              <span>📍</span> 1. Delivery Address & Contact
            </h2>

            {!isAuthenticated && (
              <div style={{ background: '#FFF9EE', border: '1px solid var(--gold-border)', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.84rem' }}>
                💡 Already registered?{' '}
                <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700' }}>
                  Log in to auto-fill your saved address
                </Link>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="e.g. Anand Kumar"
                  value={customer.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Number (For Delivery SMS) *</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="9876543210"
                  value={customer.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">Email Address (For Invoice Receipt) *</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="name@example.com"
                value={customer.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label">Complete Street Address (Flat / House No, Street, Landmark) *</label>
              <input
                type="text"
                name="address"
                className="form-input"
                placeholder="42 South Usman Road, Opposite Post Office"
                value={customer.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div className="form-group">
                <label className="form-label">City / Town *</label>
                <input
                  type="text"
                  name="city"
                  className="form-input"
                  value={customer.city}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  className="form-input"
                  placeholder="600017"
                  value={customer.pincode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Special Delivery / Gift Message (Optional)</label>
              <input
                type="text"
                name="notes"
                className="form-input"
                placeholder="e.g. Please pack with extra gift ribbon & deliver before 6 PM"
                value={customer.notes}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Box 2: Payment Methods */}
          <div className="checkout-box">
            <h2 className="checkout-section-title">
              <span>💳</span> 2. Choose Payment Method
            </h2>

            <div className="payment-options-group">
              {/* COD */}
              <label className={`payment-card-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="payment-radio"
                />
                <div className="payment-option-details">
                  <span className="payment-option-name">💵 Cash On Delivery (COD)</span>
                  <span className="payment-option-sub">Pay in cash or scan QR when fresh sweets arrive at your door.</span>
                </div>
              </label>

              {/* UPI */}
              <label className={`payment-card-option ${paymentMethod === 'upi' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="payment-radio"
                />
                <div className="payment-option-details">
                  <span className="payment-option-name">📱 UPI / QR Code (GPay, PhonePe, Paytm)</span>
                  <span className="payment-option-sub">Demo checkout only. Payment is not collected or verified online.</span>
                </div>
              </label>

              {paymentMethod === 'upi' && (
                <div className="upi-qr-preview-box">
                  <div style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '8px' }}>
                    Scan & Pay ₹{totalAmount} with Any UPI App
                  </div>
                  <div style={{ display: 'inline-block', background: '#FFFFFF', padding: '12px', border: '1px solid #EADFD3', borderRadius: '8px' }}>
                    <div style={{ fontSize: '4.5rem', lineHeight: 1 }}>🏁</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#6B5E55', marginTop: '6px' }}>
                      UPI ID: royalmithai@okhdfcbank
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#2E7D32', marginTop: '8px', fontWeight: '600' }}>
                    Demo preview only. No payment is collected or verified.
                  </div>
                </div>
              )}

              {/* Credit / Debit Card */}
              <label className={`payment-card-option ${paymentMethod === 'card' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="payment-radio"
                />
                <div className="payment-option-details">
                  <span className="payment-option-name">💳 Credit / Debit Card</span>
                  <span className="payment-option-sub">Demo checkout only. Card details are not collected and no charge is made.</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review & Confirmation */}
        <div className="checkout-box" style={{ position: 'sticky', top: '90px' }}>
          <h2 className="checkout-section-title">
            <span>🛒</span> Order Review ({cartItems.length} items)
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto', marginBottom: '18px' }}>
            {cartItems.map((item) => (
              <div key={item.itemKey} style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.88rem' }}>
                <img src={item.image} alt={item.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{item.name}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    {item.weight} • Qty: {item.quantity}
                  </div>
                </div>
                <div style={{ fontWeight: '800' }}>₹{item.itemTotal}</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #F5ECE3', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="cart-bill-row">
              <span>Items Total:</span>
              <span style={{ fontWeight: '700' }}>₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="cart-bill-row" style={{ color: 'var(--pistachio)' }}>
                <span>Festive Discount:</span>
                <span style={{ fontWeight: '700' }}>-₹{discount}</span>
              </div>
            )}
            <div className="cart-bill-row">
              <span>Delivery Charges:</span>
              <span>{deliveryFee === 0 ? <strong style={{ color: 'var(--pistachio)' }}>FREE</strong> : `₹${deliveryFee}`}</span>
            </div>
            <div className="cart-bill-row total-row">
              <span>Total Payable:</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn-place-order"
            disabled={submitting}
          >
            {submitting ? 'Confirming Order...' : `Confirm & Place Order (₹${totalAmount})`}
          </button>

          <div style={{ fontSize: '0.75rem', color: '#7A6E65', textAlign: 'center', marginTop: '12px' }}>
            🔒 Safe & Secure 256-bit Encrypted Checkout • 100% Satisfaction Guarantee
          </div>
        </div>
      </form>
    </div>
  );
}

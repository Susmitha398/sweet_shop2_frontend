import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/Auth.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const { showToast } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    street: '',
    city: 'Chennai',
    pincode: ''
  });

  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name || !formData.email || !formData.password) {
      setErrorMsg('Please enter your full name, email, and a password.');
      return;
    }

    const res = await register(formData);
    if (res.success) {
      showToast('Registration successful! Welcome to Royal Sweet Shop.');
      navigate('/');
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="container auth-page-wrap">
      <div className="auth-card" style={{ maxWidth: '540px' }}>
        <div className="auth-header">
          <div className="auth-logo-icon">🪔</div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join Royal Mithai for exclusive offers and express sweet delivery</p>
        </div>

        {errorMsg && <div className="auth-error-alert">{errorMsg}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="e.g. Ramesh Kumar"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Delivery Street Address</label>
            <input
              type="text"
              name="street"
              className="form-input"
              placeholder="House/Flat No, Street, Landmark"
              value={formData.street}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                name="city"
                className="form-input"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Pincode</label>
              <input
                type="text"
                name="pincode"
                className="form-input"
                placeholder="600017"
                value={formData.pincode}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}

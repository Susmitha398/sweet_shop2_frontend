import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/Auth.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const { showToast } = useCart();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      showToast('Logged in successfully! Welcome back.');
      navigate('/');
    } else {
      setErrorMsg(res.message);
    }
  };

  const fillDemoAccount = () => {
    setEmail('anand@royalmithai.com');
    setPassword('password123');
  };

  return (
    <div className="container auth-page-wrap">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo-icon">👑</div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your Royal Sweet Shop account</p>
        </div>

        {errorMsg && <div className="auth-error-alert">{errorMsg}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. anand@royalmithai.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In to Account'}
          </button>

          <button type="button" className="btn-demo-fill" onClick={fillDemoAccount}>
            ⚡ Click to Auto-Fill Demo Account (anand@royalmithai.com)
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}

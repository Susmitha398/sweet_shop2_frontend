import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#22110D', color: '#F4ECE4', marginTop: '4rem', paddingTop: '3.5rem' }}>
      <div className="container">
        {/* Top Badges */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            paddingBottom: '2.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '2.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '2.2rem' }}>🧈</span>
            <div>
              <div style={{ fontWeight: '800', color: '#FFFFFF' }}>100% Pure Desi Ghee</div>
              <div style={{ fontSize: '0.8rem', color: '#BCAFA4' }}>Only grass-fed cow butter ghee used</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '2.2rem' }}>⚡</span>
            <div>
              <div style={{ fontWeight: '800', color: '#FFFFFF' }}>Express Delivery</div>
              <div style={{ fontSize: '0.8rem', color: '#BCAFA4' }}>Dispatched fresh from nearest sweet depot</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '2.2rem' }}>🛡️</span>
            <div>
              <div style={{ fontWeight: '800', color: '#FFFFFF' }}>FSSAI Certified Fresh</div>
              <div style={{ fontSize: '0.8rem', color: '#BCAFA4' }}>Zero artificial colors or preservatives</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '2.2rem' }}>👑</span>
            <div>
              <div style={{ fontWeight: '800', color: '#FFFFFF' }}>100-Year Heritage</div>
              <div style={{ fontSize: '0.8rem', color: '#BCAFA4' }}>Generational royal sweet recipes</div>
            </div>
          </div>
        </div>

        {/* 4 Column Footer Links */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px',
            paddingBottom: '3rem'
          }}
        >
          {/* Col 1: About */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '1.6rem' }}>👑</span>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: '800', color: 'var(--gold)' }}>
                Royal Mithai
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#BCAFA4', lineHeight: 1.6, marginBottom: '16px' }}>
              We bring the authentic royal taste of South India and royal confectionery kingdoms right to your doorstep. Famous for traditional Tirunelveli Halwa, Kaju Katli, and Motichoor Laddus.
            </p>
            <div style={{ fontSize: '0.82rem', color: 'var(--gold-border)' }}>
              📞 Orders Helpline: +91 98765 43210<br />
              ✉️ Email: orders@royalmithai.com
            </div>
          </div>

          {/* Col 2: Sweet Categories */}
          <div>
            <h4 style={{ color: '#FFFFFF', marginBottom: '16px', fontSize: '1rem', fontWeight: '700' }}>
              Sweet Categories
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <Link to="/category/alwa" style={{ color: '#BCAFA4', transition: 'var(--transition)' }}>
                👑 Royal Halwa (Alwa) Specials
              </Link>
              <Link to="/category/laddu" style={{ color: '#BCAFA4' }}>
                🪔 Celebration Laddus
              </Link>
              <Link to="/category/bengali" style={{ color: '#BCAFA4' }}>
                ✨ Bengali & Milk Sweets
              </Link>
              <Link to="/category/kaju-dryfruit" style={{ color: '#BCAFA4' }}>
                💎 Kaju & Dry Fruit Collection
              </Link>
              <Link to="/category/barfi-peda" style={{ color: '#BCAFA4' }}>
                🥛 Rich Barfi & Peda
              </Link>
              <Link to="/category/ghee-specials" style={{ color: '#BCAFA4' }}>
                🧈 Pure Ghee Mysore Pak
              </Link>
            </div>
          </div>

          {/* Col 3: Shop Locations */}
          <div>
            <h4 style={{ color: '#FFFFFF', marginBottom: '16px', fontSize: '1rem', fontWeight: '700' }}>
              Sweet Depots & Locations
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: '#BCAFA4' }}>
              <div>📍 <strong>Chennai:</strong> T. Nagar Flagship Store, South Usman Rd</div>
              <div>📍 <strong>Chennai:</strong> Mylapore Heritage Branch, North Mada St</div>
              <div>📍 <strong>Tirunelveli:</strong> Main Bazaar Sweet Depot</div>
              <div>📍 <strong>Coimbatore:</strong> RS Puram Confectionery</div>
              <div>📍 <strong>Madurai:</strong> Meenakshi Temple East Tower Branch</div>
            </div>
          </div>

          {/* Col 4: Quick Customer Links */}
          <div>
            <h4 style={{ color: '#FFFFFF', marginBottom: '16px', fontSize: '1rem', fontWeight: '700' }}>
              Customer Services
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <Link to="/cart" style={{ color: '#BCAFA4' }}>Shopping Cart</Link>
              <Link to="/checkout" style={{ color: '#BCAFA4' }}>Fast Checkout</Link>
              <Link to="/login" style={{ color: '#BCAFA4' }}>User Account & Orders</Link>
              <Link to="/register" style={{ color: '#BCAFA4' }}>New Customer Register</Link>
              <div style={{ fontSize: '0.78rem', color: '#BCAFA4', marginTop: '10px' }}>
                Opening Hours: <strong>8:00 AM - 10:30 PM (All 7 Days)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '1.25rem 0',
            textAlign: 'center',
            fontSize: '0.78rem',
            color: '#8C7E73'
          }}
        >
          © 2026 Royal Mithai Mahal Pvt Ltd. All rights reserved. Made with pure love & pure desi ghee.
        </div>
      </div>
    </footer>
  );
}

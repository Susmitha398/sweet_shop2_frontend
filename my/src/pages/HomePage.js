import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';
import CategoryNav from '../components/CategoryNav';
import SweetCard from '../components/SweetCard';
import '../styles/Home.css';

import API_BASE from '../config/api';

export default function HomePage() {
  const [sweets, setSweets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/categories`).then(r => r.json()),
      fetch(`${API_BASE}/sweets`).then(r => r.json())
    ])
      .then(([catData, sweetData]) => {
        if (catData.success) setCategories(catData.data);
        if (sweetData.success) setSweets(sweetData.data);
        setLoading(false);
      })
      .catch(err => {
        console.warn('Home fetch error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>👑</div>
        <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary)' }}>
          Loading Royal Sweets...
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Preparing fresh confections with pure cow desi ghee</p>
      </div>
    );
  }

  // Filter sweets by category for the individual sections
  const alwaSweets = sweets.filter(s => s.categorySlug === 'alwa');
  const ladduSweets = sweets.filter(s => s.categorySlug === 'laddu');
  const bengaliSweets = sweets.filter(s => s.categorySlug === 'bengali');
  const kajuSweets = sweets.filter(s => s.categorySlug === 'kaju-dryfruit');
  const gheeSweets = sweets.filter(s => s.categorySlug === 'ghee-specials');
  const hamperSweets = sweets.filter(s => s.categorySlug === 'gift-hampers');

  return (
    <div className="container" style={{ paddingTop: '1rem' }}>
      {/* 1. HERO BANNER */}
      <HeroBanner />

      {/* 2. CATEGORY TILES EXPLORER */}
      <CategoryNav categories={categories} />

      {/* 3. SECTION 1: ROYAL HALWA (ALWA) SPECIALS (REQUESTED HIGHLIGHT) */}
      <section className="home-section" id="alwa-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="section-badge">👑 Heritage Signature Collection</span>
            <h2 className="section-title">Royal Halwa (Alwa) Specials</h2>
            <p className="section-subtitle">
              Authentic Tirunelveli Iruttu Kadai Halwa, Badam Halwa, Wheat Halwa and Karachi Cashew Halwa slow cooked in pure cow ghee.
            </p>
          </div>
          <Link to="/category/alwa" className="section-view-all-btn">
            View All Alwa Specials ({alwaSweets.length}) →
          </Link>
        </div>

        <div className="sweets-grid">
          {alwaSweets.slice(0, 4).map(sweet => (
            <SweetCard key={sweet.id || sweet._id} sweet={sweet} />
          ))}
        </div>
      </section>

      {/* 4. SECTION 2: CELEBRATION LADDUS */}
      <section className="home-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="section-badge">🪔 Golden Handcrafted Pearls</span>
            <h2 className="section-title">Celebration Laddus & Pedas</h2>
            <p className="section-subtitle">
              Saffron Motichoor, Tirupati style ghee laddus, and high-protein winter gond laddus.
            </p>
          </div>
          <Link to="/category/laddu" className="section-view-all-btn">
            View All Laddus ({ladduSweets.length}) →
          </Link>
        </div>

        <div className="sweets-grid">
          {ladduSweets.slice(0, 4).map(sweet => (
            <SweetCard key={sweet.id || sweet._id} sweet={sweet} />
          ))}
        </div>
      </section>

      {/* 5. SECTION 3: BENGALI & MILK DELICACIES */}
      <section className="home-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="section-badge">✨ Fresh Chenna Delights</span>
            <h2 className="section-title">Authentic Bengali & Milk Sweets</h2>
            <p className="section-subtitle">
              Spongy Kolkata rasgullas, chilled saffron kesar rasmalai, and mawa-stuffed gulab jamuns.
            </p>
          </div>
          <Link to="/category/bengali" className="section-view-all-btn">
            View All Bengali Sweets ({bengaliSweets.length}) →
          </Link>
        </div>

        <div className="sweets-grid">
          {bengaliSweets.slice(0, 4).map(sweet => (
            <SweetCard key={sweet.id || sweet._id} sweet={sweet} />
          ))}
        </div>
      </section>

      {/* 6. SECTION 4: ROYAL KAJU & DRY FRUITS */}
      <section className="home-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="section-badge">💎 100% Premium Nut Confections</span>
            <h2 className="section-title">Royal Kaju & Dry Fruit Collection</h2>
            <p className="section-subtitle">
              Real silver foil Kaju Katli, pistachio cashew rolls, and 100% sugar-free Afghan fig barfi.
            </p>
          </div>
          <Link to="/category/kaju-dryfruit" className="section-view-all-btn">
            View All Kaju Sweets ({kajuSweets.length}) →
          </Link>
        </div>

        <div className="sweets-grid">
          {kajuSweets.slice(0, 4).map(sweet => (
            <SweetCard key={sweet.id || sweet._id} sweet={sweet} />
          ))}
        </div>
      </section>

      {/* 7. SECTION 5: PURE GHEE SPECIALS */}
      <section className="home-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="section-badge">🧈 Melt-in-Mouth Confections</span>
            <h2 className="section-title">Pure Ghee Specials & Mysore Pak</h2>
            <p className="section-subtitle">
              Velvety ghee Mysore Pak, crispy honeycomb texture, and silken desi ghee Soan Papdi.
            </p>
          </div>
          <Link to="/category/ghee-specials" className="section-view-all-btn">
            View All Ghee Specials ({gheeSweets.length}) →
          </Link>
        </div>

        <div className="sweets-grid">
          {gheeSweets.slice(0, 4).map(sweet => (
            <SweetCard key={sweet.id || sweet._id} sweet={sweet} />
          ))}
        </div>
      </section>

      {/* 8. SECTION 6: GIFT HAMPERS & COMBOS */}
      {hamperSweets.length > 0 && (
        <section className="home-section">
          <div className="section-header">
            <div className="section-title-wrap">
              <span className="section-badge">🎁 Festive Edition</span>
              <h2 className="section-title">Festive Gift Boxes & Hampers</h2>
              <p className="section-subtitle">
                Elegantly packaged luxury gift boxes for weddings, corporate gifting and festive celebrations.
              </p>
            </div>
            <Link to="/category/gift-hampers" className="section-view-all-btn">
              View All Hampers ({hamperSweets.length}) →
            </Link>
          </div>

          <div className="sweets-grid">
            {hamperSweets.map(sweet => (
              <SweetCard key={sweet.id || sweet._id} sweet={sweet} />
            ))}
          </div>
        </section>
      )}

      {/* 9. PURE DESI GHEE COMMITMENT BANNER */}
      <div
        style={{
          background: '#FFF9EE',
          border: '1.5px solid var(--gold-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          margin: '2rem 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ maxWidth: '650px' }}>
          <div style={{ color: 'var(--gold-dark)', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase' }}>
            👑 The Royal Mithai Purity Promise
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--primary)', marginTop: '4px' }}>
            Why Thousands of Families Trust Our Sweets
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '8px', lineHeight: 1.6 }}>
            Every batch of our halwa is made with slow fermented wheat milk extracted naturally, simmered over firewood with 100% pure cow ghee. We never use artificial essences, dalda, or chemical preservatives.
          </p>
        </div>

        <Link
          to="/category/alwa"
          style={{
            background: 'var(--primary)',
            color: '#FFFFFF',
            padding: '12px 24px',
            borderRadius: 'var(--radius-full)',
            fontWeight: '800',
            fontSize: '0.92rem'
          }}
        >
          Taste Authentic Alwa →
        </Link>
      </div>
    </div>
  );
}

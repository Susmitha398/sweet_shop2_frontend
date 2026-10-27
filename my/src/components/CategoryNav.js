import React from 'react';
import { Link } from 'react-router-dom';

export default function CategoryNav({ categories = [], activeSlug = '' }) {
  if (!categories || categories.length === 0) return null;

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--primary)', fontWeight: '800' }}>
            Explore by Sweet Category
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Handcrafted with 100% pure desi ghee, natural spices, and heritage royal recipes.
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '12px'
        }}
      >
        {categories.map((cat) => {
          const isActive = activeSlug === cat.slug;
          return (
            <Link
              key={cat.id || cat.slug}
              to={`/category/${cat.slug}`}
              style={{
                background: isActive ? 'var(--primary)' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : 'var(--text-primary)',
                border: isActive ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 10px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                boxShadow: 'var(--shadow-sm)',
                transition: 'var(--transition)',
                textDecoration: 'none'
              }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: isActive ? '2px solid #FFFFFF' : '2px solid var(--gold-border)'
                }}
              />
              <span style={{ fontWeight: '700', fontSize: '0.85rem', lineHeight: 1.2 }}>
                {cat.name}
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  color: isActive ? '#FFE3E3' : 'var(--gold-dark)',
                  fontWeight: '600'
                }}
              >
                {cat.itemCount ? `${cat.itemCount} Sweets` : 'View Specials'}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

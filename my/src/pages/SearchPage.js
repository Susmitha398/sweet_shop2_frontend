import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SweetCard from '../components/SweetCard';
import { useLocation } from '../context/LocationContext';

import API_BASE from '../config/api';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { currentLocation } = useLocation();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    fetch(`${API_BASE}/sweets?search=${encodeURIComponent(query)}&userLat=${currentLocation.lat}&userLng=${currentLocation.lng}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setResults(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn('Search fetch error:', err);
        setLoading(false);
      });
  }, [query, currentLocation]);

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>
      <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        <Link to="/" style={{ color: 'var(--primary)', fontWeight: '600' }}>Home</Link>
        {' '}/ Search Results
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--primary)', fontWeight: '900' }}>
          Search Results for "{query}"
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '4px' }}>
          {loading ? 'Searching authentic confectionery catalog...' : `Found ${results.length} sweets matching your search.`}
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔍</div>
          <h3>Searching delicious sweets...</h3>
        </div>
      ) : results.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🍬</div>
          <h3>No sweets found for "{query}"</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
            Try searching for "Alwa", "Laddu", "Rasgulla", "Kaju Katli" or "Mysore Pak".
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/category/alwa" className="btn-add-cart">
              👑 Royal Halwa Specials
            </Link>
            <Link to="/category/kaju-dryfruit" className="btn-add-cart">
              💎 Kaju Katli Collection
            </Link>
          </div>
        </div>
      ) : (
        <div className="sweets-grid">
          {results.map((sweet) => (
            <SweetCard key={sweet.id || sweet._id} sweet={sweet} />
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import API_BASE from '../config/api';

/**
 * DbStatusBanner – polls /api/health every 15s and shows a
 * sticky warning banner at the top of the page when the
 * MongoDB connection is down.
 */
export default function DbStatusBanner() {
  const [dbError, setDbError] = useState(null);
  const [visible, setVisible] = useState(true);

  const checkHealth = async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      const data = await res.json();
      if (data.database === 'disconnected') {
        setDbError(data.db_error || 'Database is disconnected. Data will not be saved.');
        setVisible(true);
      } else {
        setDbError(null);
      }
    } catch {
      setDbError('⚠️ Cannot reach the backend server. Please check your internet connection.');
      setVisible(true);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 15000); // re-check every 15s
    return () => clearInterval(interval);
  }, []);

  if (!dbError || !visible) return null;

  return (
    <div style={styles.banner}>
      <span style={styles.icon}>🔴</span>
      <span style={styles.text}>{dbError}</span>
      <button style={styles.closeBtn} onClick={() => setVisible(false)} title="Dismiss">✕</button>
    </div>
  );
}

const styles = {
  banner: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    backgroundColor: '#7f1d1d',
    color: '#fee2e2',
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontFamily: 'sans-serif',
    fontSize: '14px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
  },
  icon: {
    fontSize: '16px',
    flexShrink: 0,
  },
  text: {
    flex: 1,
    fontWeight: '500',
  },
  closeBtn: {
    background: 'transparent',
    border: '1px solid #fca5a5',
    color: '#fee2e2',
    borderRadius: '4px',
    padding: '2px 8px',
    cursor: 'pointer',
    fontSize: '13px',
    flexShrink: 0,
  }
};

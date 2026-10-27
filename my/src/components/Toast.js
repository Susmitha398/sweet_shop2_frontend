import React from 'react';
import { useCart } from '../context/CartContext';

export default function Toast() {
  const { toast } = useCart();

  if (!toast.show) return null;

  const bgColors = {
    success: '#2E7D32',
    error: '#C62828',
    info: '#1565C0'
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        backgroundColor: bgColors[toast.type] || '#2E7D32',
        color: '#FFFFFF',
        padding: '14px 22px',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '0.95rem',
        fontWeight: '600',
        animation: 'slideUpToast 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <span>{toast.message}</span>
      <style>{`
        @keyframes slideUpToast {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

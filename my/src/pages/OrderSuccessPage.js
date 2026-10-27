import React, { useState, useEffect } from 'react';
import { useParams, useLocation as useRouteLocation, Link } from 'react-router-dom';

import API_BASE from '../config/api';

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const routeLocation = useRouteLocation();

  const [order, setOrder] = useState(routeLocation.state?.order || null);
  const [loading, setLoading] = useState(!routeLocation.state?.order);

  useEffect(() => {
    if (!order && orderId) {
      setLoading(true);
      fetch(`${API_BASE}/orders/${orderId}`)
        .then(r => r.json())
        .then(data => {
          if (data.success && data.data) {
            setOrder(data.data);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [orderId, order]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Loading your order details...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem', maxWidth: '800px' }}>
      {/* Celebration Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FFF9EE 0%, #FEF3D6 100%)',
          border: '1.5px solid var(--gold-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '30px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '24px'
        }}
      >
        <div style={{ fontSize: '3.5rem', marginBottom: '8px' }}>🎉</div>
        <div style={{ color: 'var(--gold-dark)', fontWeight: '800', fontSize: '0.86rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Order Confirmed
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--primary)', fontWeight: '900', marginTop: '6px' }}>
          Thank You For Your Order!
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '6px' }}>
          Your sweets are being freshly packed in pure cow desi ghee and will be dispatched immediately.
        </p>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: '#FFFFFF',
            border: '1px solid var(--border-light)',
            padding: '8px 20px',
            borderRadius: 'var(--radius-full)',
            marginTop: '16px',
            fontWeight: '800',
            fontSize: '0.92rem',
            color: 'var(--primary)'
          }}
        >
          <span>Order ID: {order ? order.orderId : orderId}</span>
          <span>•</span>
          <span style={{ color: 'var(--pistachio)' }}>⚡ Fresh Express Dispatch</span>
        </div>
      </div>

      {/* Invoice Card */}
      {order && (
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F5ECE3', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Delivering to:</div>
              <div style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                {order.customer?.name}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {order.customer?.address}, {order.customer?.city} - {order.customer?.pincode}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                📞 {order.customer?.phone}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated Delivery Time:</div>
              <div style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--pistachio)' }}>
                ⏱ {order.estimatedDeliveryTime || '25 - 35 mins'}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Payment: <strong>{order.paymentMethod?.toUpperCase()}</strong> ({order.paymentStatus})
              </div>
            </div>
          </div>

          {/* Items Purchased List */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '14px' }}>
            Sweets In This Order
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            {order.items?.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '10px 14px',
                  background: '#FAF7F2',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)'
                }}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '0.94rem' }}>{item.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Weight: <strong>{item.weight}</strong> • Qty: <strong>{item.quantity}</strong> (₹{item.unitPrice} each)
                  </div>
                </div>
                <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>
                  ₹{item.itemTotal}
                </div>
              </div>
            ))}
          </div>

          {/* Billing Breakdown */}
          <div style={{ borderTop: '1px dashed #E0D4C5', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '300px', marginLeft: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span>Subtotal:</span>
              <span style={{ fontWeight: '700' }}>₹{order.subtotal}</span>
            </div>
            {order.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--pistachio)' }}>
                <span>Discount:</span>
                <span style={{ fontWeight: '700' }}>-₹{order.discount}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span>Delivery Charges:</span>
              <span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '900', color: 'var(--primary)', borderTop: '1px solid #EFE6DC', paddingTop: '8px' }}>
              <span>Order Total:</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '14px', marginTop: '28px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-add-cart"
              onClick={() => window.print()}
            >
              🖨️ Print Receipt
            </button>
            <Link
              to="/"
              style={{
                background: 'var(--primary)',
                color: '#FFFFFF',
                padding: '10px 22px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: '700',
                fontSize: '0.9rem'
              }}
            >
              Continue Sweet Shopping →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

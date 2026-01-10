"use client";

import React from 'react';

interface ReceiptProps {
  paymentDetails: {
    orderId?: string;
    tracker?: string;
    amount?: string;
    timestamp?: string;
    payerName?: string;
  } | null;
}

const Receipt: React.FC<ReceiptProps> = ({ paymentDetails }) => {
  if (!paymentDetails) return null;

  return (
    <div style={{ padding: 24, fontFamily: 'Inter, system-ui, -apple-system, sans-serif', color: '#111827' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', border: '1px solid #E5E7EB', borderRadius: 8, padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h2 style={{ margin: 0 }}>QanoonMate</h2>
            <div style={{ color: '#6B7280', fontSize: 12 }}>Payment Receipt</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{paymentDetails.amount}</div>
            <div style={{ color: '#6B7280', fontSize: 12 }}>{paymentDetails.timestamp}</div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div>
              <div style={{ color: '#6B7280', fontSize: 12 }}>Order ID</div>
              <div style={{ fontFamily: 'monospace', fontSize: 13 }}>{paymentDetails.orderId}</div>
            </div>
            <div>
              <div style={{ color: '#6B7280', fontSize: 12 }}>Transaction ID</div>
              <div style={{ fontFamily: 'monospace', fontSize: 13 }}>{paymentDetails.tracker}</div>
            </div>
            <div style={{ gridColumn: '1 / -1', marginTop: 8 }}>
              <div style={{ color: '#6B7280', fontSize: 12 }}>Billed To</div>
              <div style={{ fontSize: 13 }}>{paymentDetails.payerName || 'You'}</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20, borderTop: '1px dashed #E5E7EB', paddingTop: 12, fontSize: 12, color: '#6B7280' }}>
          <div>Thank you for your purchase. This receipt is your proof of payment.</div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;

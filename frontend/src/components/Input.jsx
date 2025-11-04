import React from 'react';

export default function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: 16, width: '100%' }}>
      <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>{label}</label>
      <input
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '1rem',
          borderRadius: 6,
          border: '1px solid #ccc',
          boxSizing: 'border-box',
        }}
        {...props}
      />
    </div>
  );
}

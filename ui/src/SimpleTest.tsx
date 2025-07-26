import React from 'react';

export default function SimpleTest() {
  console.log('🧪 SimpleTest rendering...');
  
  return (
    <div style={{
      minHeight: '100vh',
      background: '#3b82f6', // Blue background
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      color: 'white'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', margin: 0 }}>
          ✅ React App Works!
        </h1>
        <p style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
          Server running on localhost:5501
        </p>
      </div>
    </div>
  );
}
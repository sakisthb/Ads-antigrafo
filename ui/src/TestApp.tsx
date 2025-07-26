// Simple Test App για debugging
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function TestHomePage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#f0f9ff',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#1e40af' }}>
          ✅ React App Works!
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#64748b' }}>
          Basic routing and rendering is functional.
        </p>
        <div style={{
          background: 'white',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        }}>
          <p><strong>✅ Router:</strong> Working</p>
          <p><strong>✅ JSX:</strong> Rendering</p>
          <p><strong>✅ Styles:</strong> Applied</p>
        </div>
      </div>
    </div>
  );
}

export default function TestApp() {
  console.log('🧪 TestApp rendering...');
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TestHomePage />} />
        <Route path="*" element={
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>404 - Page Not Found</h2>
            <p>But the app is working!</p>
          </div>
        } />
      </Routes>
    </Router>
  );
}
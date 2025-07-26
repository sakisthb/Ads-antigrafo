// Simple App για testing
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function SimpleHomePage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀 Ads Pro Platform</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
          Professional Attribution System για Agencies
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button style={{
            padding: '1rem 2rem',
            fontSize: '1rem',
            background: 'rgba(255,255,255,0.2)',
            border: '2px solid white',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer'
          }}>
            Start Free Trial
          </button>
          <button style={{
            padding: '1rem 2rem',
            fontSize: '1rem',
            background: 'transparent',
            border: '2px solid white',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer'
          }}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SimpleApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SimpleHomePage />} />
        <Route path="*" element={<div style={{ padding: '2rem' }}>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
// import SimpleApp from './SimpleApp.tsx'
// import TestApp from './TestApp.tsx'
// import SimpleTest from './SimpleTest.tsx'
// import BasicTest from './BasicTest.tsx'
import './index.css'

console.log('🚀 Starting Ads Pro Application...');

try {
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('✅ App rendered successfully');
} catch (error) {
  console.error('❌ Failed to render app:', error);
}

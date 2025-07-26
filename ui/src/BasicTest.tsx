import React from 'react';

export default function BasicTest() {
  return React.createElement('div', {
    style: {
      minHeight: '100vh',
      background: '#3b82f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      color: 'white'
    }
  }, 
  React.createElement('div', { style: { textAlign: 'center' } },
    React.createElement('h1', { 
      style: { fontSize: '3rem', margin: 0 } 
    }, '✅ React App Works!'),
    React.createElement('p', { 
      style: { fontSize: '1.5rem', marginTop: '1rem' } 
    }, 'Server running on localhost:5501')
  ));
}
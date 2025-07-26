// Debug environment variables
export function debugEnvironment() {
  console.log('🔍 Environment Variables Debug:');
  console.log('VITE_USE_FIREBASE_EMULATOR:', import.meta.env.VITE_USE_FIREBASE_EMULATOR);
  console.log('VITE_FIREBASE_AUTH_EMULATOR_PORT:', import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_PORT);
  console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
  console.log('NODE_ENV:', import.meta.env.NODE_ENV);
  console.log('MODE:', import.meta.env.MODE);
  
  // Check if we're in development
  console.log('Is Development:', import.meta.env.DEV);
  console.log('Is Production:', import.meta.env.PROD);
  
  // Check all env vars
  console.log('All env vars:', Object.keys(import.meta.env));
}

// Debug Firebase configuration
export function debugFirebaseConfig() {
  console.log('🔥 Firebase Configuration Debug:');
  
  // Import firebase config
  import('./firebase-config.json').then(config => {
    console.log('Firebase Config:', config);
  }).catch(err => {
    console.error('Failed to load Firebase config:', err);
  });
  
  // Check if auth is initialized
  import('./firebase').then(({ auth }) => {
    console.log('Auth initialized:', !!auth);
    console.log('Current user:', auth.currentUser);
    console.log('Auth config:', auth.config);
  }).catch(err => {
    console.error('Failed to load Firebase auth:', err);
  });
}

// Debug authentication state
export function debugAuthState() {
  console.log('🔐 Authentication State Debug:');
  
  // Check localStorage
  console.log('LocalStorage auth keys:', Object.keys(localStorage).filter(key => 
    key.includes('auth') || key.includes('firebase') || key.includes('user')
  ));
  
  // Check sessionStorage
  console.log('SessionStorage auth keys:', Object.keys(sessionStorage).filter(key => 
    key.includes('auth') || key.includes('firebase') || key.includes('user')
  ));
  
  // Check cookies
  console.log('Cookies:', document.cookie);
} 
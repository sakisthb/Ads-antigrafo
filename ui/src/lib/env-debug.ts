// Debug environment variables in browser context
export function logEnvironmentDebug() {
  console.log('🔍 Environment Variables in Browser:');
  console.log('=====================================');
  
  // Log all environment variables
  Object.keys(import.meta.env).forEach(key => {
    console.log(`${key}:`, import.meta.env[key]);
  });
  
  console.log('\n🔧 Vite Specific Variables:');
  console.log('VITE_USE_FIREBASE_EMULATOR:', import.meta.env.VITE_USE_FIREBASE_EMULATOR);
  console.log('VITE_FIREBASE_AUTH_EMULATOR_PORT:', import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_PORT);
  console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
  
  console.log('\n🌍 Environment Info:');
  console.log('NODE_ENV:', import.meta.env.NODE_ENV);
  console.log('MODE:', import.meta.env.MODE);
  console.log('DEV:', import.meta.env.DEV);
  console.log('PROD:', import.meta.env.PROD);
  
  console.log('\n📱 Browser Info:');
  console.log('User Agent:', navigator.userAgent);
  console.log('Platform:', navigator.platform);
  console.log('Language:', navigator.language);
  
  console.log('\n🌐 Location Info:');
  console.log('Protocol:', window.location.protocol);
  console.log('Host:', window.location.host);
  console.log('Port:', window.location.port);
  console.log('Pathname:', window.location.pathname);
  console.log('Search:', window.location.search);
  console.log('Hash:', window.location.hash);
}

// Debug Firebase initialization
export function logFirebaseDebug() {
  console.log('🔥 Firebase Debug Info:');
  console.log('========================');
  
  // Check if Firebase is available
  try {
    import('./firebase').then(({ auth, app }) => {
      console.log('Firebase App:', app);
      console.log('Firebase Auth:', auth);
      console.log('Auth Current User:', auth.currentUser);
      console.log('Auth Config:', auth.config);
      
      // Check if emulator is connected
      const authInternal = (auth as any)._delegate;
      console.log('Auth Internal:', authInternal);
      
      if (authInternal && authInternal._authDomain) {
        console.log('Auth Domain:', authInternal._authDomain);
      }
      
      if (authInternal && authInternal._canInitEmulator) {
        console.log('Can Init Emulator:', authInternal._canInitEmulator);
      }
      
    }).catch(err => {
      console.error('Failed to import Firebase:', err);
    });
  } catch (error) {
    console.error('Firebase not available:', error);
  }
}

// Debug authentication context
export function logAuthContextDebug() {
  console.log('🔐 Auth Context Debug:');
  console.log('======================');
  
  // Check if auth context is available
  try {
    import('@/lib/auth-context').then(({ useAuth }) => {
      console.log('Auth Context Hook:', useAuth);
    }).catch(err => {
      console.error('Failed to import Auth Context:', err);
    });
  } catch (error) {
    console.error('Auth Context not available:', error);
  }
} 
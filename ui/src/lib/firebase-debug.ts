// Comprehensive Firebase debug for browser context
export async function debugFirebaseInBrowser() {
  console.log('🔥 Comprehensive Firebase Debug in Browser');
  console.log('============================================');
  
  try {
    // Import Firebase modules
    const { initializeApp } = await import('firebase/app');
    const { getAuth, connectAuthEmulator, onAuthStateChanged } = await import('firebase/auth');
    
    console.log('✅ Firebase modules imported successfully');
    
    // Firebase config
    const firebaseConfig = {
      apiKey: "demo-api-key",
      authDomain: "demo-project.firebaseapp.com",
      projectId: "demo-project",
      storageBucket: "demo-project.appspot.com",
      messagingSenderId: "123456789",
      appId: "1:123456789:web:abcdef123456",
      measurementId: "G-XXXXXXXXXX"
    };
    
    console.log('📋 Firebase Config:', firebaseConfig);
    
    // Initialize Firebase
    console.log('\n1. Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    console.log('✅ Firebase initialized');
    console.log('App:', app);
    console.log('Auth:', auth);
    
    // Check environment variables
    console.log('\n2. Environment Variables:');
    console.log('VITE_USE_FIREBASE_EMULATOR:', import.meta.env.VITE_USE_FIREBASE_EMULATOR);
    console.log('VITE_FIREBASE_AUTH_EMULATOR_PORT:', import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_PORT);
    
    // Connect to emulator
    console.log('\n3. Connecting to emulator...');
    const useEmulator = import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true';
    console.log('Use Emulator:', useEmulator);
    
    if (useEmulator) {
      const emulatorPort = import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_PORT || '5603';
      const emulatorUrl = `http://localhost:${emulatorPort}`;
      console.log('Emulator URL:', emulatorUrl);
      
      try {
        connectAuthEmulator(auth, emulatorUrl, { disableWarnings: true });
        console.log('✅ Connected to Firebase Auth emulator');
             } catch (error: any) {
         console.log('⚠️  Emulator connection error (might already be connected):', error.message);
       }
    } else {
      console.log('🏭 Using production Firebase');
    }
    
    // Test auth state listener
    console.log('\n4. Testing auth state listener...');
    let authStateReceived = false;
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('📡 Auth state changed:', user ? `User: ${user.email}` : 'No user');
      authStateReceived = true;
    });
    
    // Wait for auth state
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (authStateReceived) {
      console.log('✅ Auth state listener working');
    } else {
      console.log('⚠️  No auth state received');
    }
    
    // Cleanup
    unsubscribe();
    console.log('\n✅ Firebase debug completed');
    
     } catch (error: any) {
     console.error('💥 Firebase debug failed:', error.message);
     console.error('Stack:', error.stack);
   }
}

// Test authentication flow
export async function testAuthFlow() {
  console.log('🔐 Testing Authentication Flow');
  console.log('==============================');
  
  try {
    const { signInWithEmailAndPassword, signOut } = await import('firebase/auth');
    const { auth } = await import('./firebase');
    
    console.log('1. Current auth state:', auth.currentUser);
    
    // Test sign in
    console.log('\n2. Testing sign in...');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, 'demo@example.com', 'demo123');
      console.log('✅ Sign in successful');
      console.log('User:', userCredential.user.email);
      console.log('UID:', userCredential.user.uid);
         } catch (error: any) {
       console.log('❌ Sign in failed:', error.message);
     }
    
    // Test sign out
    console.log('\n3. Testing sign out...');
    try {
      await signOut(auth);
      console.log('✅ Sign out successful');
    } catch (error) {
      console.log('❌ Sign out failed:', error.message);
    }
    
    console.log('\n✅ Auth flow test completed');
    
  } catch (error) {
    console.error('💥 Auth flow test failed:', error);
  }
} 
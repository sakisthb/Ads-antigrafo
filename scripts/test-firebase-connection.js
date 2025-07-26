#!/usr/bin/env node

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};

async function testFirebaseConnection() {
  console.log('🧪 Testing Firebase Emulator Connection...\n');

  try {
    // Initialize Firebase
    console.log('1. Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    console.log('✅ Firebase initialized');

    // Connect to emulator
    console.log('\n2. Connecting to Firebase Auth emulator...');
    const emulatorUrl = 'http://localhost:5603';
    connectAuthEmulator(auth, emulatorUrl, { disableWarnings: true });
    console.log(`✅ Connected to emulator at ${emulatorUrl}`);

    // Test auth state listener
    console.log('\n3. Testing auth state listener...');
    let authStateReceived = false;
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('📡 Auth state changed:', user ? `User: ${user.email}` : 'No user');
      authStateReceived = true;
    });

    // Wait a bit for auth state
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (authStateReceived) {
      console.log('✅ Auth state listener working');
    } else {
      console.log('⚠️  No auth state received yet');
    }

    // Test sign in
    console.log('\n4. Testing sign in...');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, 'demo@example.com', 'demo123');
      console.log('✅ Sign in successful');
      console.log('   User:', userCredential.user.email);
      console.log('   UID:', userCredential.user.uid);
    } catch (error) {
      console.log('❌ Sign in failed:', error.message);
    }

    // Test sign out
    console.log('\n5. Testing sign out...');
    try {
      await auth.signOut();
      console.log('✅ Sign out successful');
    } catch (error) {
      console.log('❌ Sign out failed:', error.message);
    }

    // Cleanup
    unsubscribe();
    console.log('\n✅ All tests completed');

  } catch (error) {
    console.error('💥 Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testFirebaseConnection().then(() => {
  console.log('\n🏁 Firebase connection test finished');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
}); 
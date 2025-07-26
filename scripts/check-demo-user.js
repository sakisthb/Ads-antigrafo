#!/usr/bin/env node

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Connect to emulator
const emulatorUrl = 'http://localhost:5603';
connectAuthEmulator(auth, emulatorUrl, { disableWarnings: true });

async function checkDemoUser() {
  try {
    console.log('🔍 Checking if demo user exists...');
    
    // Try to sign in with demo credentials
    const userCredential = await signInWithEmailAndPassword(auth, 'demo@example.com', 'demo123');
    console.log('✅ Demo user exists and can sign in!');
    console.log('   Email:', userCredential.user.email);
    console.log('   UID:', userCredential.user.uid);
    
    // Sign out
    await auth.signOut();
    console.log('✅ Successfully signed out');
    
  } catch (error) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      console.log('❌ Demo user does not exist. Creating...');
      
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, 'demo@example.com', 'demo123');
        console.log('✅ Demo user created successfully!');
        console.log('   Email:', userCredential.user.email);
        console.log('   UID:', userCredential.user.uid);
        
        // Sign out
        await auth.signOut();
        console.log('✅ Successfully signed out');
        
      } catch (createError) {
        console.error('❌ Failed to create demo user:', createError.message);
      }
    } else {
      console.error('❌ Error checking demo user:', error.message);
    }
  }
}

checkDemoUser().then(() => {
  console.log('🏁 Check complete');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
}); 
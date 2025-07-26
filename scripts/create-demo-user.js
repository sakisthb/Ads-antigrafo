import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, connectAuthEmulator } from 'firebase/auth';

// Firebase config for emulator
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
connectAuthEmulator(auth, 'http://localhost:5503', { disableWarnings: true });

async function createDemoUser() {
  try {
    console.log('🔄 Creating demo user...');
    
    // Try to create a new user
    const userCredential = await createUserWithEmailAndPassword(auth, 'demo@example.com', 'demo123');
    console.log('✅ Demo user created successfully!');
    console.log('📧 Email:', userCredential.user.email);
    console.log('🆔 UID:', userCredential.user.uid);
    
    return userCredential.user;
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️  Demo user already exists, trying to sign in...');
      try {
        const userCredential = await signInWithEmailAndPassword(auth, 'demo@example.com', 'demo123');
        console.log('✅ Demo user signed in successfully!');
        console.log('📧 Email:', userCredential.user.email);
        console.log('🆔 UID:', userCredential.user.uid);
        return userCredential.user;
      } catch (signInError) {
        console.error('❌ Failed to sign in:', signInError.message);
        throw signInError;
      }
    } else {
      console.error('❌ Failed to create demo user:', error.message);
      throw error;
    }
  }
}

// Run the script
createDemoUser()
  .then(() => {
    console.log('🎉 Demo user setup completed!');
    console.log('🌐 You can now test the app at: http://localhost:5501');
    console.log('🔐 Use these credentials:');
    console.log('   Email: demo@example.com');
    console.log('   Password: demo123');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Demo user setup failed:', error);
    process.exit(1);
  }); 
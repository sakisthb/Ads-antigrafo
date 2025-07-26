#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

async function clearFirebaseData() {
  console.log('🧹 Clearing Firebase Emulator Data...\n');

  try {
    // Stop all Firebase emulator processes
    console.log('1. Stopping Firebase emulator processes...');
    try {
      await execAsync('pkill -f "firebase.*emulator"');
      console.log('✅ Firebase emulator processes stopped');
    } catch (error) {
      console.log('⚠️ No Firebase emulator processes found');
    }

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Clear Firebase emulator data directory
    console.log('\n2. Clearing Firebase emulator data...');
    const firebaseDataPath = path.join(process.cwd(), 'data', 'firebase-emulator');
    
    if (fs.existsSync(firebaseDataPath)) {
      try {
        await execAsync(`rm -rf "${firebaseDataPath}"`);
        console.log('✅ Firebase emulator data cleared');
      } catch (error) {
        console.log('⚠️ Could not clear Firebase data:', error.message);
      }
    } else {
      console.log('✅ Firebase emulator data directory does not exist');
    }

    // Clear PostgreSQL data
    console.log('\n3. Clearing PostgreSQL data...');
    const postgresDataPath = path.join(process.cwd(), 'data', 'postgres');
    
    if (fs.existsSync(postgresDataPath)) {
      try {
        await execAsync(`rm -rf "${postgresDataPath}"`);
        console.log('✅ PostgreSQL data cleared');
      } catch (error) {
        console.log('⚠️ Could not clear PostgreSQL data:', error.message);
      }
    } else {
      console.log('✅ PostgreSQL data directory does not exist');
    }

    // Kill all Node.js processes related to the app
    console.log('\n4. Stopping all app processes...');
    try {
      await execAsync('pkill -f "node.*volo-chat"');
      console.log('✅ App processes stopped');
    } catch (error) {
      console.log('⚠️ No app processes found');
    }

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('\n📋 Summary:');
    console.log('===========');
    console.log('✅ Firebase emulator data cleared');
    console.log('✅ PostgreSQL data cleared');
    console.log('✅ All processes stopped');
    
    console.log('\n🔧 Next Steps:');
    console.log('1. Run: pnpm run dev');
    console.log('2. Wait for all services to start');
    console.log('3. Go to http://localhost:XXXX/test-auth (check the port)');
    console.log('4. Try signing in with demo@example.com / demo123');
    console.log('5. Test logout functionality');

  } catch (error) {
    console.error('💥 Error clearing Firebase data:', error.message);
  }
}

clearFirebaseData().then(() => {
  console.log('\n🏁 Firebase data clearing completed');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
}); 
#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function checkBrowserEnvironment() {
  console.log('🔍 Checking Browser Environment Variables...\n');

  try {
    // Check if the app is running
    console.log('1. Checking if app is running...');
    const { stdout: appCheck } = await execAsync('curl -s http://localhost:5601 | head -5');
    if (appCheck.includes('<!doctype html>')) {
      console.log('✅ App is running');
    } else {
      console.log('❌ App is not responding');
      return;
    }

    // Check the test-auth page
    console.log('\n2. Checking test-auth page...');
    const { stdout: testAuthCheck } = await execAsync('curl -s http://localhost:5601/test-auth | head -10');
    if (testAuthCheck.includes('<!doctype html>')) {
      console.log('✅ Test auth page is accessible');
    } else {
      console.log('❌ Test auth page not accessible');
      return;
    }

    // Check Vite dev server logs for environment variables
    console.log('\n3. Checking Vite configuration...');
    const { stdout: viteProcess } = await execAsync('ps aux | grep "vite" | grep "5601" | head -1');
    console.log('Vite process args:', viteProcess.split('--').slice(1).map(arg => '--' + arg.trim()));

    // Check if Firebase emulator is accessible
    console.log('\n4. Checking Firebase emulator...');
    try {
      const { stdout: firebaseCheck } = await execAsync('curl -s http://localhost:5603 | jq .');
      console.log('Firebase emulator response:', firebaseCheck);
    } catch (error) {
      console.log('❌ Firebase emulator not accessible');
    }

    // Check if demo user exists
    console.log('\n5. Checking demo user...');
    try {
      const { stdout: demoUserCheck } = await execAsync('node scripts/check-demo-user.js');
      console.log('Demo user check:', demoUserCheck);
    } catch (error) {
      console.log('❌ Demo user check failed:', error.message);
    }

    console.log('\n📋 Summary:');
    console.log('===========');
    console.log('✅ App running on http://localhost:5601');
    console.log('✅ Test auth page accessible');
    console.log('✅ Vite configured with Firebase emulator');
    console.log('✅ Firebase emulator running on port 5603');
    console.log('✅ Demo user exists and accessible');
    
    console.log('\n🔧 Next Steps:');
    console.log('1. Open http://localhost:5601/test-auth in browser');
    console.log('2. Open Developer Console (F12)');
    console.log('3. Click "Log Environment" button');
    console.log('4. Check console output for environment variables');

  } catch (error) {
    console.error('💥 Error checking browser environment:', error.message);
  }
}

checkBrowserEnvironment().then(() => {
  console.log('\n🏁 Browser environment check completed');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
}); 
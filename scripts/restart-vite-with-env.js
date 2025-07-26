#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function restartViteWithEnv() {
  console.log('🔄 Restarting Vite with proper environment variables...\n');

  try {
    // Kill existing Vite process
    console.log('1. Stopping existing Vite process...');
    try {
      await execAsync('pkill -f "vite.*5601"');
      console.log('✅ Vite process stopped');
    } catch (error) {
      console.log('⚠️  No Vite process found or already stopped');
    }

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Start Vite with explicit environment variables
    console.log('\n2. Starting Vite with environment variables...');
    const env = {
      VITE_USE_FIREBASE_EMULATOR: 'true',
      VITE_FIREBASE_AUTH_EMULATOR_PORT: '5603',
      VITE_API_URL: 'http://localhost:5600'
    };

    const envString = Object.entries(env).map(([key, value]) => `${key}=${value}`).join(' ');
    
    const command = `cd ui && ${envString} pnpm run dev -- --port 5601 --strictPort --api-url http://localhost:5600 --use-firebase-emulator true --firebase-auth-port 5603`;
    
    console.log('Command:', command);
    
    // Start Vite in background
    const child = exec(command, {
      cwd: process.cwd(),
      stdio: 'pipe'
    });

    // Wait for Vite to start
    console.log('\n3. Waiting for Vite to start...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Check if Vite is running
    console.log('\n4. Checking if Vite is running...');
    try {
      const { stdout: checkResult } = await execAsync('curl -s http://localhost:5601 | head -5');
      if (checkResult.includes('<!doctype html>')) {
        console.log('✅ Vite is running successfully');
      } else {
        console.log('❌ Vite is not responding');
      }
    } catch (error) {
      console.log('❌ Cannot connect to Vite:', error.message);
    }

    console.log('\n📋 Summary:');
    console.log('===========');
    console.log('✅ Vite restarted with environment variables');
    console.log('✅ Environment variables set:');
    console.log('   VITE_USE_FIREBASE_EMULATOR=true');
    console.log('   VITE_FIREBASE_AUTH_EMULATOR_PORT=5603');
    console.log('   VITE_API_URL=http://localhost:5600');
    
    console.log('\n🔧 Next Steps:');
    console.log('1. Open http://localhost:5601/test-auth in browser');
    console.log('2. Check the "Environment Variables" section');
    console.log('3. Verify all values are correct');
    console.log('4. Try the authentication flow');

  } catch (error) {
    console.error('💥 Error restarting Vite:', error.message);
  }
}

restartViteWithEnv().then(() => {
  console.log('\n🏁 Vite restart completed');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
}); 
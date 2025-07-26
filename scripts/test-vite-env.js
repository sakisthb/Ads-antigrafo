#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

async function testViteEnvironment() {
  console.log('🔍 Testing Vite Environment Variables...\n');

  try {
    // Check Vite process arguments
    console.log('1. Checking Vite process arguments...');
    const { stdout: viteProcess } = await execAsync('ps aux | grep "vite" | grep "5601" | head -1');
    const args = viteProcess.split('--').slice(1).map(arg => arg.trim());
    console.log('Vite arguments:', args);

    // Check if environment variables are correctly passed
    const useEmulator = args.find(arg => arg.includes('use-firebase-emulator'));
    const authPort = args.find(arg => arg.includes('firebase-auth-port'));
    const apiUrl = args.find(arg => arg.includes('api-url'));

    console.log('\n2. Environment variable mapping:');
    console.log('use-firebase-emulator:', useEmulator);
    console.log('firebase-auth-port:', authPort);
    console.log('api-url:', apiUrl);

    // Check Vite config
    console.log('\n3. Checking Vite configuration...');
    const viteConfigPath = path.join(process.cwd(), 'ui', 'vite.config.ts');
    if (fs.existsSync(viteConfigPath)) {
      const viteConfig = fs.readFileSync(viteConfigPath, 'utf-8');
      console.log('Vite config exists and contains define section');
      
      // Check if define section is correct
      if (viteConfig.includes('import.meta.env.VITE_USE_FIREBASE_EMULATOR')) {
        console.log('✅ Vite config has environment variable definitions');
      } else {
        console.log('❌ Vite config missing environment variable definitions');
      }
    } else {
      console.log('❌ Vite config not found');
    }

    // Test Firebase connection directly
    console.log('\n4. Testing Firebase connection...');
    try {
      const { stdout: firebaseTest } = await execAsync('node scripts/test-firebase-connection.js');
      console.log('Firebase test result:', firebaseTest);
    } catch (error) {
      console.log('❌ Firebase test failed:', error.message);
    }

    // Check if the issue might be with the browser
    console.log('\n5. Potential issues and solutions:');
    console.log('=====================================');
    
    if (useEmulator && useEmulator.includes('true')) {
      console.log('✅ Firebase emulator is enabled');
    } else {
      console.log('❌ Firebase emulator might not be enabled');
    }

    if (authPort && authPort.includes('5603')) {
      console.log('✅ Firebase auth port is correct');
    } else {
      console.log('❌ Firebase auth port might be incorrect');
    }

    console.log('\n🔧 Debugging Steps:');
    console.log('1. Open http://localhost:5601/test-auth in browser');
    console.log('2. Check the "Environment Variables" section');
    console.log('3. Verify VITE_USE_FIREBASE_EMULATOR is "true"');
    console.log('4. Verify VITE_FIREBASE_AUTH_EMULATOR_PORT is "5603"');
    console.log('5. If values are undefined, there\'s a Vite configuration issue');

  } catch (error) {
    console.error('💥 Error testing Vite environment:', error.message);
  }
}

testViteEnvironment().then(() => {
  console.log('\n🏁 Vite environment test completed');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
}); 
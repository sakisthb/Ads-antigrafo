#!/usr/bin/env node

import { spawn } from 'child_process';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

async function checkPort(port) {
  try {
    const { stdout } = await execAsync(`lsof -i :${port}`);
    return stdout.trim().length > 0;
  } catch (error) {
    return false;
  }
}

async function checkUrl(url, description) {
  try {
    const { stdout } = await execAsync(`curl -s -o /dev/null -w "%{http_code}" ${url}`);
    const statusCode = parseInt(stdout);
    return statusCode === 200;
  } catch (error) {
    return false;
  }
}

async function main() {
  console.log('🔍 Checking all services...\n');

  const services = [
    { port: 5601, url: 'http://localhost:5601', name: 'Frontend (React App)' },
    { port: 5600, url: 'http://localhost:5600', name: 'Backend API' },
    { port: 5602, url: 'http://localhost:5602', name: 'Database Server' },
    { port: 5603, url: 'http://localhost:5603', name: 'Firebase Auth API' },
    { port: 5604, url: 'http://localhost:5604', name: 'Firebase Emulator UI' }
  ];

  const results = [];

  for (const service of services) {
    const portActive = await checkPort(service.port);
    const urlAccessible = await checkUrl(service.url, service.name);
    
    results.push({
      ...service,
      portActive,
      urlAccessible
    });

    const status = portActive && urlAccessible ? '✅' : '❌';
    console.log(`${status} ${service.name}`);
    console.log(`   Port ${service.port}: ${portActive ? 'Active' : 'Inactive'}`);
    console.log(`   URL ${service.url}: ${urlAccessible ? 'Accessible' : 'Not accessible'}`);
    console.log('');
  }

  console.log('📋 Summary:');
  console.log('===========');
  
  const allWorking = results.every(r => r.portActive && r.urlAccessible);
  
  if (allWorking) {
    console.log('🎉 All services are running correctly!');
    console.log('');
    console.log('🌐 Access URLs:');
    console.log('   • Main App: http://localhost:5601');
    console.log('   • Test Auth: http://localhost:5601/test-auth');
    console.log('   • Firebase UI: http://localhost:5604');
    console.log('');
    console.log('🔑 Demo Credentials:');
    console.log('   • Email: demo@example.com');
    console.log('   • Password: demo123');
    console.log('');
    console.log('📝 Next Steps:');
    console.log('   1. Open http://localhost:5601 in your browser');
    console.log('   2. Go to http://localhost:5601/test-auth');
    console.log('   3. Try signing in with demo credentials');
    console.log('   4. Check browser console for any errors');
    console.log('   5. If still having issues, use the "Hard Reset" button');
  } else {
    console.log('⚠️  Some services are not working properly:');
    results.forEach(result => {
      if (!result.portActive || !result.urlAccessible) {
        console.log(`   • ${result.name}: ${!result.portActive ? 'Port not active' : 'URL not accessible'}`);
      }
    });
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Make sure all services are running: pnpm run dev');
    console.log('   2. Check if ports are available');
    console.log('   3. Restart the development server');
  }
}

main().catch(console.error); 
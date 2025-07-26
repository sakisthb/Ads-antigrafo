/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    // Test environment
    environment: 'jsdom',
    
    // Setup files
    setupFiles: ['./src/test/setup.ts'],
    
    // Global test options
    globals: true,
    
    // Include patterns
    include: [
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],
    
    // Exclude patterns
    exclude: [
      'node_modules',
      'dist',
      '.next',
      '.vercel'
    ],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/stories/',
        'dist/',
        'coverage/',
        'tests/e2e/',
        '**/*.test.*',
        '**/*.spec.*',
        '**/*.stories.*'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      },
      // Report uncovered lines
      reportOnFailure: true,
      // Include all source files
      all: true,
      include: ['src/**/*.{ts,tsx}'],
    },
    
    // Test timeout
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // Watch options
    watch: {
      ignored: ['**/node_modules/**', '**/dist/**']
    },
    
    // Reporter options
    reporter: ['verbose', 'html'],
    outputFile: {
      html: './coverage/index.html'
    }
  },
  
  // Resolve alias for tests
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
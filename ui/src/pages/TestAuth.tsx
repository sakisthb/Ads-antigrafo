import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { debugEnvironment, debugFirebaseConfig, debugAuthState } from '@/lib/debug-env';
import { logEnvironmentDebug, logFirebaseDebug, logAuthContextDebug } from '@/lib/env-debug';
import { debugFirebaseInBrowser, testAuthFlow } from '@/lib/firebase-debug';

export function TestAuth() {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const [storageInfo, setStorageInfo] = useState<any>({});
  const [envInfo, setEnvInfo] = useState<any>({});

  useEffect(() => {
    // Get current storage info
    const info = {
      localStorage: Object.keys(localStorage).length,
      sessionStorage: Object.keys(sessionStorage).length,
      cookies: document.cookie ? document.cookie.split(';').length : 0,
      firebaseAuth: auth.currentUser ? 'Signed In' : 'Not Signed In'
    };
    setStorageInfo(info);

    // Get environment info
    const env = {
      VITE_USE_FIREBASE_EMULATOR: import.meta.env.VITE_USE_FIREBASE_EMULATOR,
      VITE_FIREBASE_AUTH_EMULATOR_PORT: import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_PORT,
      VITE_API_URL: import.meta.env.VITE_API_URL,
      NODE_ENV: import.meta.env.NODE_ENV,
      MODE: import.meta.env.MODE,
      DEV: import.meta.env.DEV,
      PROD: import.meta.env.PROD
    };
    setEnvInfo(env);
  }, [user]);

  const handleEmailSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          console.log('User created and signed in');
        } catch (registerErr: any) {
          setError(`Registration failed: ${registerErr.message}`);
        }
      } else {
        setError(`Sign in failed: ${err.message}`);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError(`Google sign in failed: ${err.message}`);
    }
  };

  const handleSignOut = async () => {
    try {
      console.log('🔄 Starting sign out process...');
      
      // First, try to sign out from Firebase
      await signOut(auth);
      console.log('✅ Firebase sign out successful');
      
      // Force clear all storage immediately
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      console.log('✅ Storage cleared');
      
      // Force page reload after a short delay
      setTimeout(() => {
        console.log('🔄 Reloading page...');
        window.location.reload();
      }, 500);
      
    } catch (err: any) {
      console.error('❌ Sign out error:', err);
      setError(`Sign out failed: ${err.message}`);
      
      // Even if Firebase sign out fails, clear storage and reload
      localStorage.clear();
      sessionStorage.clear();
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  const handleHardReset = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear all browser storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear all cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // Clear IndexedDB
      if ('indexedDB' in window) {
        const databases = await window.indexedDB.databases();
        databases.forEach(db => {
          if (db.name) {
            window.indexedDB.deleteDatabase(db.name);
          }
        });
      }
      
      // Force page reload with cache busting
      window.location.href = window.location.href + '?reset=' + Date.now();
    } catch (err: any) {
      setError(`Hard reset failed: ${err.message}`);
    }
  };

  const showStorageDetails = () => {
    console.log('📊 Current Storage State:');
    console.log('LocalStorage:', Object.keys(localStorage));
    console.log('SessionStorage:', Object.keys(sessionStorage));
    console.log('Cookies:', document.cookie);
    console.log('Firebase Auth State:', auth.currentUser);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Environment Info */}
          <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <h3 className="font-semibold text-green-800 dark:text-green-200">🌍 Environment Variables</h3>
            <div className="text-sm text-green-600 dark:text-green-300 space-y-1">
              <p><strong>VITE_USE_FIREBASE_EMULATOR:</strong> {envInfo.VITE_USE_FIREBASE_EMULATOR}</p>
              <p><strong>VITE_FIREBASE_AUTH_EMULATOR_PORT:</strong> {envInfo.VITE_FIREBASE_AUTH_EMULATOR_PORT}</p>
              <p><strong>VITE_API_URL:</strong> {envInfo.VITE_API_URL}</p>
              <p><strong>NODE_ENV:</strong> {envInfo.NODE_ENV}</p>
              <p><strong>MODE:</strong> {envInfo.MODE}</p>
              <p><strong>DEV:</strong> {envInfo.DEV ? 'true' : 'false'}</p>
              <p><strong>PROD:</strong> {envInfo.PROD ? 'true' : 'false'}</p>
            </div>
          </div>

          {/* Storage Info */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200">📊 Storage Info</h3>
            <div className="text-sm text-blue-600 dark:text-blue-300 space-y-1">
              <p>LocalStorage items: {storageInfo.localStorage}</p>
              <p>SessionStorage items: {storageInfo.sessionStorage}</p>
              <p>Cookies: {storageInfo.cookies}</p>
              <p>Firebase Auth: {storageInfo.firebaseAuth}</p>
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              <Button onClick={showStorageDetails} variant="outline" size="sm">
                Show Storage Details
              </Button>
              <Button onClick={debugEnvironment} variant="outline" size="sm">
                Debug Environment
              </Button>
              <Button onClick={debugFirebaseConfig} variant="outline" size="sm">
                Debug Firebase
              </Button>
              <Button onClick={debugAuthState} variant="outline" size="sm">
                Debug Auth State
              </Button>
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              <Button onClick={logEnvironmentDebug} variant="outline" size="sm">
                Log Environment
              </Button>
              <Button onClick={logFirebaseDebug} variant="outline" size="sm">
                Log Firebase
              </Button>
              <Button onClick={logAuthContextDebug} variant="outline" size="sm">
                Log Auth Context
              </Button>
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              <Button onClick={debugFirebaseInBrowser} variant="outline" size="sm">
                🔥 Debug Firebase in Browser
              </Button>
              <Button onClick={testAuthFlow} variant="outline" size="sm">
                🔐 Test Auth Flow
              </Button>
            </div>
          </div>

          {user ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <h3 className="font-semibold text-green-800 dark:text-green-200">✅ Signed In</h3>
                <p className="text-sm text-green-600 dark:text-green-300">
                  Email: {user.email}
                </p>
                <p className="text-sm text-green-600 dark:text-green-300">
                  UID: {user.uid}
                </p>
              </div>
              <Button onClick={handleSignOut} className="w-full">
                Sign Out
              </Button>
              <Button onClick={handleHardReset} variant="destructive" className="w-full">
                🚨 Hard Reset (Clear Everything)
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">❌ Not Signed In</h3>
                <p className="text-sm text-yellow-600 dark:text-yellow-300">
                  Please sign in to access the app
                </p>
              </div>
              
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button onClick={handleEmailSignIn} className="w-full">
                  Sign In with Email
                </Button>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>
              
              <Button onClick={handleGoogleSignIn} variant="outline" className="w-full">
                Sign In with Google
              </Button>
            </div>
          )}
          
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
import { reportError, addBreadcrumb } from './sentry';
import React from 'react';

// PWA installation and management
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAInstallState {
  canInstall: boolean;
  isInstalled: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
  platform: 'ios' | 'android' | 'desktop' | 'unknown';
}

class PWAManager {
  private state: PWAInstallState = {
    canInstall: false,
    isInstalled: false,
    installPrompt: null,
    platform: 'unknown'
  };

  private callbacks: Set<(state: PWAInstallState) => void> = new Set();

  constructor() {
    this.detectPlatform();
    this.setupEventListeners();
    this.checkInstallStatus();
  }

  // Detect user's platform
  private detectPlatform(): void {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/iphone|ipad|ipod/.test(userAgent)) {
      this.state.platform = 'ios';
    } else if (/android/.test(userAgent)) {
      this.state.platform = 'android';
    } else if ('standalone' in window.navigator && window.navigator.standalone !== undefined) {
      this.state.platform = 'ios';
    } else {
      this.state.platform = 'desktop';
    }
  }

  // Setup PWA event listeners
  private setupEventListeners(): void {
    // Before install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.state.installPrompt = e as BeforeInstallPromptEvent;
      this.state.canInstall = true;
      this.notifyStateChange();
      
      addBreadcrumb('PWA install prompt available', 'pwa');
    });

    // App installed
    window.addEventListener('appinstalled', () => {
      this.state.isInstalled = true;
      this.state.canInstall = false;
      this.state.installPrompt = null;
      this.notifyStateChange();
      
      addBreadcrumb('PWA installed successfully', 'pwa');
    });

    // Service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        this.handleServiceWorkerMessage(event.data);
      });
    }
  }

  // Check if app is already installed
  private checkInstallStatus(): void {
    // Check if running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone === true;
    
    this.state.isInstalled = isStandalone;
    
    // For iOS, check if added to home screen
    if (this.state.platform === 'ios') {
      this.state.isInstalled = (window.navigator as any).standalone === true;
    }
    
    this.notifyStateChange();
  }

  // Handle service worker messages
  private handleServiceWorkerMessage(data: any): void {
    switch (data.type) {
      case 'SYNC_START':
        addBreadcrumb('Background sync started', 'pwa');
        break;
      case 'SYNC_COMPLETE':
        addBreadcrumb('Background sync completed', 'pwa');
        break;
      default:
        console.log('SW Message:', data);
    }
  }

  // Notify state change to subscribers
  private notifyStateChange(): void {
    this.callbacks.forEach(callback => callback(this.state));
  }

  // Public API
  getState(): PWAInstallState {
    return { ...this.state };
  }

  subscribe(callback: (state: PWAInstallState) => void): () => void {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  async install(): Promise<boolean> {
    if (!this.state.canInstall || !this.state.installPrompt) {
      return false;
    }

    try {
      await this.state.installPrompt.prompt();
      const result = await this.state.installPrompt.userChoice;
      
      if (result.outcome === 'accepted') {
        addBreadcrumb('PWA install accepted', 'pwa');
        return true;
      } else {
        addBreadcrumb('PWA install dismissed', 'pwa');
        return false;
      }
    } catch (error) {
      reportError(error as Error, { context: 'pwa_install' });
      return false;
    }
  }

  getInstallInstructions(): string {
    switch (this.state.platform) {
      case 'ios':
        return 'Tap the share button and select "Add to Home Screen"';
      case 'android':
        return 'Tap the menu button and select "Add to Home screen"';
      case 'desktop':
        return 'Click the install button in your browser\'s address bar';
      default:
        return 'Install this app for a better experience';
    }
  }

  canShowInstallPrompt(): boolean {
    return this.state.canInstall && !this.state.isInstalled;
  }
}

// Service Worker registration and management
class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private updateCallbacks: Set<() => void> = new Set();

  async register(): Promise<void> {
    console.log('[PWA] Service Worker registration disabled for debugging');
    return;
    
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported');
      return;
    }

    // Only register service worker in production
    if (import.meta.env.DEV) {
      console.log('Service Worker registration skipped in development mode');
      return;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('Service Worker registered successfully');
      addBreadcrumb('Service Worker registered', 'pwa');

      // Handle updates
      this.registration.addEventListener('updatefound', () => {
        this.handleUpdate();
      });

      // Check for existing updates
      if (this.registration.waiting) {
        this.notifyUpdate();
      }

    } catch (error) {
      console.error('Service Worker registration failed:', error);
      reportError(error as Error, { context: 'sw_registration' });
    }
  }

  private handleUpdate(): void {
    if (!this.registration) return;

    const newWorker = this.registration.installing;
    if (!newWorker) return;

    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        this.notifyUpdate();
      }
    });
  }

  private notifyUpdate(): void {
    addBreadcrumb('Service Worker update available', 'pwa');
    this.updateCallbacks.forEach(callback => callback());
  }

  onUpdate(callback: () => void): () => void {
    this.updateCallbacks.add(callback);
    return () => this.updateCallbacks.delete(callback);
  }

  async updateServiceWorker(): Promise<void> {
    if (!this.registration || !this.registration.waiting) {
      return;
    }

    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  }

  async getVersion(): Promise<string | null> {
    if (!this.registration || !this.registration.active) {
      return null;
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.version || null);
      };

      this.registration!.active!.postMessage(
        { type: 'GET_VERSION' },
        [messageChannel.port2]
      );
    });
  }
}

// Offline detection and management
class OfflineManager {
  private isOnline = navigator.onLine;
  private callbacks: Set<(online: boolean) => void> = new Set();

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyStatusChange();
      addBreadcrumb('App back online', 'network');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyStatusChange();
      addBreadcrumb('App offline', 'network');
    });
  }

  private notifyStatusChange(): void {
    this.callbacks.forEach(callback => callback(this.isOnline));
  }

  getStatus(): boolean {
    return this.isOnline;
  }

  subscribe(callback: (online: boolean) => void): () => void {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }
}

// Push notifications manager
class NotificationManager {
  private registration: ServiceWorkerRegistration | null = null;

  setRegistration(registration: ServiceWorkerRegistration): void {
    this.registration = registration;
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    const permission = await Notification.requestPermission();
    addBreadcrumb(`Notification permission: ${permission}`, 'pwa');
    
    return permission;
  }

  async subscribeToPush(): Promise<PushSubscription | null> {
    if (!this.registration) {
      throw new Error('Service Worker not registered');
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          import.meta.env.VITE_VAPID_PUBLIC_KEY || ''
        )
      });

      addBreadcrumb('Push notification subscription created', 'pwa');
      return subscription;
    } catch (error) {
      reportError(error as Error, { context: 'push_subscription' });
      return null;
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

// Create singleton instances
export const pwaManager = new PWAManager();
export const serviceWorkerManager = new ServiceWorkerManager();
export const offlineManager = new OfflineManager();
export const notificationManager = new NotificationManager();

// Initialize PWA features
export async function initializePWA(): Promise<void> {
  try {
    // Register service worker
    await serviceWorkerManager.register();
    
    // Set up notification manager
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      notificationManager.setRegistration(registration);
    }

    addBreadcrumb('PWA initialized successfully', 'pwa');
  } catch (error) {
    reportError(error as Error, { context: 'pwa_init' });
  }
}

// React hooks for PWA features
export function usePWAInstall() {
  const [state, setState] = React.useState(pwaManager.getState());

  React.useEffect(() => {
    return pwaManager.subscribe(setState);
  }, []);

  const install = React.useCallback(() => {
    return pwaManager.install();
  }, []);

  return {
    ...state,
    install,
    instructions: pwaManager.getInstallInstructions(),
    canInstall: pwaManager.canShowInstallPrompt()
  };
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = React.useState(offlineManager.getStatus());

  React.useEffect(() => {
    return offlineManager.subscribe(setIsOnline);
  }, []);

  return isOnline;
}

export function useServiceWorkerUpdate() {
  const [updateAvailable, setUpdateAvailable] = React.useState(false);

  React.useEffect(() => {
    return serviceWorkerManager.onUpdate(() => {
      setUpdateAvailable(true);
    });
  }, []);

  const applyUpdate = React.useCallback(() => {
    serviceWorkerManager.updateServiceWorker();
  }, []);

  return { updateAvailable, applyUpdate };
}
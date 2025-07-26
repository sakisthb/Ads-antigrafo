import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  Smartphone, 
  Download, 
  X, 
  Wifi, 
  WifiOff, 
  RefreshCw,
  Bell,
  Star,
  Zap,
  Shield
} from 'lucide-react';
import { usePWAInstall, useOnlineStatus, useServiceWorkerUpdate } from '../lib/pwa';
import { toast } from 'sonner';

export function PWAInstallPrompt() {
  const { canInstall, platform, install, instructions } = usePWAInstall();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const success = await install();
      if (success) {
        toast.success('App installed successfully!');
        setShowPrompt(false);
      } else {
        toast.error('Installation was cancelled');
      }
    } catch (error) {
      toast.error('Installation failed');
    } finally {
      setIsInstalling(false);
    }
  };

  React.useEffect(() => {
    if (canInstall) {
      // Show prompt after a delay
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [canInstall]);

  if (!canInstall || !showPrompt) {
    return null;
  }

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-600" />
            Install Ads Pro
          </DialogTitle>
          <DialogDescription>
            Get the full app experience with offline access and push notifications
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Features */}
          <div className="grid gap-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg dark:bg-blue-900/20">
              <Zap className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Faster Performance</p>
                <p className="text-xs text-muted-foreground">Instant loading and smooth animations</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg dark:bg-green-900/20">
              <WifiOff className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Works Offline</p>
                <p className="text-xs text-muted-foreground">Access your data even without internet</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg dark:bg-purple-900/20">
              <Bell className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Push Notifications</p>
                <p className="text-xs text-muted-foreground">Get alerts about campaign updates</p>
              </div>
            </div>
          </div>

          {/* Platform-specific instructions */}
          {platform !== 'desktop' && (
            <div className="p-3 bg-gray-50 rounded-lg dark:bg-gray-900/20">
              <p className="text-sm text-muted-foreground">
                {instructions}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button 
              onClick={handleInstall} 
              disabled={isInstalling}
              className="flex-1"
            >
              {isInstalling ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Installing...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Install App
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setShowPrompt(false)}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function NetworkStatusIndicator() {
  const isOnline = useOnlineStatus();

  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge 
        variant={isOnline ? "default" : "destructive"}
        className="flex items-center gap-1"
      >
        {isOnline ? (
          <>
            <Wifi className="w-3 h-3" />
            Online
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3" />
            Offline
          </>
        )}
      </Badge>
    </div>
  );
}

export function ServiceWorkerUpdateNotification() {
  const { updateAvailable, applyUpdate } = useServiceWorkerUpdate();

  if (!updateAvailable) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Update Available
        </CardTitle>
        <CardDescription className="text-xs">
          A new version of Ads Pro is ready to install
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={applyUpdate}
            className="flex-1"
          >
            Update Now
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => {
              // Hide notification temporarily
              const element = document.querySelector('[data-update-notification]');
              if (element) {
                (element as HTMLElement).style.display = 'none';
              }
            }}
          >
            Later
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function PWAFeatures() {
  const { isInstalled, platform } = usePWAInstall();
  const isOnline = useOnlineStatus();

  if (!isInstalled) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-600" />
          App Features Active
        </CardTitle>
        <CardDescription>
          You're running the installed version of Ads Pro
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Offline Support</span>
            <Badge variant="outline" className="text-green-600 border-green-600">
              <Star className="w-3 h-3 mr-1" />
              Active
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Push Notifications</span>
            <Badge variant="outline" className="text-green-600 border-green-600">
              <Bell className="w-3 h-3 mr-1" />
              Available
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Network Status</span>
            <Badge variant={isOnline ? "default" : "destructive"}>
              {isOnline ? (
                <>
                  <Wifi className="w-3 h-3 mr-1" />
                  Connected
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 mr-1" />
                  Offline Mode
                </>
              )}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Platform</span>
            <Badge variant="outline">
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact install button for navbar
export function PWAInstallButton() {
  const { canInstall, install } = usePWAInstall();
  const [isInstalling, setIsInstalling] = useState(false);

  if (!canInstall) {
    return null;
  }

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const success = await install();
      if (success) {
        toast.success('App installed successfully!');
      }
    } catch (error) {
      toast.error('Installation failed');
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleInstall}
      disabled={isInstalling}
    >
      {isInstalling ? (
        <RefreshCw className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
    </Button>
  );
}
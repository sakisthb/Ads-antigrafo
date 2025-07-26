import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink,
  Settings,
  Database,
  Zap,
  Globe,
  ShoppingCart,
  Target,
  BarChart3,
  Key,
  Lock,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { integrationManager, type PlatformType } from '@/lib/api-integrations/integration-manager';

const PLATFORM_CONFIG = {
  meta: {
    name: 'Meta Ads (Facebook)',
    icon: Target,
    color: 'from-blue-500 to-blue-600',
    description: 'Συνδέστε τα Facebook & Instagram Ads',
    authUrl: 'https://developers.facebook.com/apps',
    requiredFields: ['clientId', 'clientSecret', 'accessToken'],
    permissions: ['ads_read', 'ads_management', 'business_management']
  },
  'google-ads': {
    name: 'Google Ads',
    icon: Globe,
    color: 'from-green-500 to-green-600',
    description: 'Συνδέστε το Google Ads account',
    authUrl: 'https://console.developers.google.com',
    requiredFields: ['clientId', 'clientSecret', 'accessToken', 'refreshToken', 'developerToken', 'customerId'],
    permissions: ['https://www.googleapis.com/auth/adwords']
  },
  'google-analytics': {
    name: 'Google Analytics 4',
    icon: BarChart3,
    color: 'from-orange-500 to-orange-600',
    description: 'Συνδέστε το Google Analytics',
    authUrl: 'https://console.developers.google.com',
    requiredFields: ['clientId', 'clientSecret', 'accessToken', 'refreshToken', 'propertyId'],
    permissions: ['https://www.googleapis.com/auth/analytics.readonly']
  },
  tiktok: {
    name: 'TikTok Ads',
    icon: Zap,
    color: 'from-pink-500 to-pink-600',
    description: 'Συνδέστε το TikTok for Business',
    authUrl: 'https://ads.tiktok.com/marketing_api',
    requiredFields: ['clientId', 'clientSecret', 'accessToken', 'advertiserId'],
    permissions: ['ads:read', 'ads:manage']
  },
  woocommerce: {
    name: 'WooCommerce',
    icon: ShoppingCart,
    color: 'from-purple-500 to-purple-600',
    description: 'Συνδέστε το WooCommerce store',
    authUrl: 'Direct API Keys',
    requiredFields: ['siteUrl', 'consumerKey', 'consumerSecret'],
    permissions: ['read', 'write']
  }
};

export function PlatformIntegrations() {
  const [connectionStatus, setConnectionStatus] = useState(new Map());
  const [isConnecting, setIsConnecting] = useState<PlatformType | null>(null);
  const [credentials, setCredentials] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    updateConnectionStatus();
  }, []);

  const updateConnectionStatus = () => {
    setConnectionStatus(integrationManager.getConnectionStatus());
  };

  const handleConnect = async (platform: PlatformType) => {
    const platformCreds = credentials[platform];
    if (!platformCreds) {
      toast.error('Παρακαλώ συμπληρώστε τα απαιτούμενα πεδία');
      return;
    }

    setIsConnecting(platform);

    try {
      let result;
      const apiCredentials = {
        platform,
        ...platformCreds
      };

      switch (platform) {
        case 'meta':
          result = await integrationManager.connectMeta(apiCredentials);
          break;
        case 'google-ads':
          result = await integrationManager.connectGoogleAds(apiCredentials, platformCreds.developerToken);
          break;
        case 'google-analytics':
          result = await integrationManager.connectGoogleAnalytics(apiCredentials);
          break;
        case 'tiktok':
          result = await integrationManager.connectTikTok(apiCredentials);
          break;
        case 'woocommerce':
          result = await integrationManager.connectWooCommerce(apiCredentials);
          break;
      }

      if (result?.success) {
        toast.success(`${PLATFORM_CONFIG[platform].name} συνδέθηκε επιτυχώς! 🎉`);
        updateConnectionStatus();
        // Clear credentials from state for security
        setCredentials(prev => ({ ...prev, [platform]: {} }));
      } else {
        toast.error(`Σφάλμα σύνδεσης: ${result?.message}`);
      }
    } catch (error: any) {
      toast.error(`Σφάλμα: ${error.message}`);
    } finally {
      setIsConnecting(null);
    }
  };

  const handleDisconnect = (platform: PlatformType) => {
    integrationManager.disconnect(platform);
    updateConnectionStatus();
    toast.info(`${PLATFORM_CONFIG[platform].name} αποσυνδέθηκε`);
  };

  const updateCredential = (platform: PlatformType, field: string, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value
      }
    }));
  };

  const renderPlatformCard = (platform: PlatformType) => {
    const config = PLATFORM_CONFIG[platform];
    const status = connectionStatus.get(platform);
    const isConnected = status?.connected || false;
    const Icon = config.icon;

    return (
      <Card key={platform} className={`border-2 transition-all duration-300 ${
        isConnected ? 'border-green-200 bg-green-50/50 dark:bg-green-950/20' : 'border-gray-200'
      }`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${config.color}`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold">{config.name}</div>
                <div className="text-sm text-muted-foreground">{config.description}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Συνδεδεμένο
                </Badge>
              ) : (
                <Badge variant="outline">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Μη συνδεδεμένο
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isConnected ? (
            <div className="space-y-3">
              <div className="text-sm text-green-600 dark:text-green-400">
                ✅ Σύνδεση ενεργή - Δεδομένα διαθέσιμα
              </div>
              {status?.lastSync && (
                <div className="text-xs text-muted-foreground">
                  Τελευταίος συγχρονισμός: {status.lastSync.toLocaleString('el-GR')}
                </div>
              )}
              {status?.accountInfo && (
                <div className="text-xs text-muted-foreground">
                  Λογαριασμοί: {Array.isArray(status.accountInfo) ? status.accountInfo.length : 1}
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleDisconnect(platform)}
                className="w-full"
              >
                Αποσύνδεση
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {status?.error && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {status.error}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-3">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Απαιτούμενα στοιχεία:
                </div>
                
                {config.requiredFields.map(field => (
                  <div key={field} className="space-y-1">
                    <Label htmlFor={`${platform}-${field}`} className="text-xs">
                      {getFieldLabel(field)}
                    </Label>
                    <Input
                      id={`${platform}-${field}`}
                      type={field.includes('secret') || field.includes('token') ? 'password' : 'text'}
                      placeholder={getFieldPlaceholder(field)}
                      value={credentials[platform]?.[field] || ''}
                      onChange={(e) => updateCredential(platform, field, e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <a 
                  href={config.authUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Developer Console
                </a>
                
                <Button 
                  size="sm" 
                  onClick={() => handleConnect(platform)}
                  disabled={isConnecting === platform}
                  className={`bg-gradient-to-r ${config.color} text-white hover:opacity-90`}
                >
                  {isConnecting === platform ? (
                    <>
                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                      Σύνδεση...
                    </>
                  ) : (
                    <>
                      <Key className="w-3 h-3 mr-1" />
                      Σύνδεση
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const getFieldLabel = (field: string): string => {
    const labels: Record<string, string> = {
      clientId: 'Client ID',
      clientSecret: 'Client Secret',
      accessToken: 'Access Token',
      refreshToken: 'Refresh Token',
      developerToken: 'Developer Token',
      customerId: 'Customer ID',
      propertyId: 'Property ID',
      advertiserId: 'Advertiser ID',
      siteUrl: 'Site URL',
      consumerKey: 'Consumer Key',
      consumerSecret: 'Consumer Secret'
    };
    return labels[field] || field;
  };

  const getFieldPlaceholder = (field: string): string => {
    const placeholders: Record<string, string> = {
      clientId: 'Το App/Client ID σας',
      clientSecret: 'Το App/Client Secret σας',
      accessToken: 'Το access token σας',
      refreshToken: 'Το refresh token σας',
      developerToken: 'Το Google Ads developer token',
      customerId: 'Το Google Ads customer ID',
      propertyId: 'Το GA4 property ID',
      advertiserId: 'Το TikTok advertiser ID',
      siteUrl: 'https://yourstore.com',
      consumerKey: 'Το WooCommerce consumer key',
      consumerSecret: 'Το WooCommerce consumer secret'
    };
    return placeholders[field] || `Εισάγετε ${field}`;
  };

  const connectedCount = Array.from(connectionStatus.values()).filter(status => status.connected).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Platform Integrations</h2>
          <p className="text-muted-foreground">
            Συνδέστε τις διαφημιστικές πλατφόρμες και το e-shop σας για ενοποιημένη ανάλυση
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {connectedCount}/5 Συνδεδεμένα
        </Badge>
      </div>

      {/* Security Notice */}
      <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
        <Shield className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-700 dark:text-amber-300">
          <strong>Ασφάλεια:</strong> Όλες οι συνδέσεις χρησιμοποιούν official APIs με proper rate limiting για να μην κινδυνεύσουν οι λογαριασμοί σας. 
          Τα credentials αποθηκεύονται τοπικά κρυπτογραφημένα.
        </AlertDescription>
      </Alert>

      {/* Platform Cards */}
      <Tabs defaultValue="advertising" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="advertising">Διαφημιστικές Πλατφόρμες</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
        </TabsList>

        <TabsContent value="advertising" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {renderPlatformCard('meta')}
            {renderPlatformCard('google-ads')}
            {renderPlatformCard('tiktok')}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-1 max-w-2xl">
            {renderPlatformCard('google-analytics')}
          </div>
        </TabsContent>

        <TabsContent value="ecommerce" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-1 max-w-2xl">
            {renderPlatformCard('woocommerce')}
          </div>
        </TabsContent>
      </Tabs>

      {/* Instructions */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Database className="w-5 h-5" />
            Οδηγίες Σύνδεσης
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-blue-600 dark:text-blue-400">
          <div>• <strong>Meta Ads:</strong> Δημιουργήστε Facebook App στο developers.facebook.com</div>
          <div>• <strong>Google Ads:</strong> Χρειάζεστε Developer Token + OAuth credentials</div>
          <div>• <strong>Google Analytics:</strong> Ενεργοποιήστε το Analytics Data API</div>
          <div>• <strong>TikTok Ads:</strong> Εγγραφή στο TikTok Marketing API</div>
          <div>• <strong>WooCommerce:</strong> Δημιουργήστε API keys στο WP Admin → WooCommerce → Settings → Advanced → REST API</div>
        </CardContent>
      </Card>
    </div>
  );
}
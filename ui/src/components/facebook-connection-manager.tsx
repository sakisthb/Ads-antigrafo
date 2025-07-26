import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle, CheckCircle, ExternalLink, Facebook, Settings } from 'lucide-react';
import metaAdsApi from '../lib/meta-ads-api';
import { useAuth } from '../lib/auth-context';

interface ConnectionStatus {
  isConnected: boolean;
  message: string;
  campaigns?: number;
  lastTested?: string;
}

export function FacebookConnectionManager() {
  const { user } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: false,
    message: 'Δεν έχει ελεγχθεί η σύνδεση'
  });
  const [isTesting, setIsTesting] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [isOauthLoading, setIsOauthLoading] = useState(false);
  const [oauthMessage, setOauthMessage] = useState<string | null>(null);

  const testConnection = async () => {
    setIsTesting(true);
    try {
      const result = await metaAdsApi.testConnection();
      
      setConnectionStatus({
        isConnected: result.success,
        message: result.message,
        campaigns: result.campaigns,
        lastTested: new Date().toLocaleString('el-GR')
      });
    } catch (error) {
      console.error('Connection test error:', error);
      setConnectionStatus({
        isConnected: false,
        message: 'Σφάλμα κατά τον έλεγχο σύνδεσης',
        lastTested: new Date().toLocaleString('el-GR')
      });
    } finally {
      setIsTesting(false);
    }
  };

  const startFacebookOAuth = () => {
    if (!user) {
      setOauthMessage('Πρέπει να είστε συνδεδεμένοι για να συνδεθείτε με το Facebook.');
      return;
    }

    setIsOauthLoading(true);
    setOauthMessage(null);
    const appId = import.meta.env.VITE_FACEBOOK_APP_ID;
    const redirectUri = `${window.location.origin}/api/v1/facebook/oauth/callback`;
    const state = Math.random().toString(36).substring(2, 15);
    const scope = 'ads_management,ads_read,business_management';
    const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${scope}&response_type=code`;

    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(authUrl, 'fb_oauth', `width=${width},height=${height},left=${left},top=${top}`);
    if (!popup) {
      setIsOauthLoading(false);
      setOauthMessage('Αποτυχία ανοίγματος popup. Ελέγξτε τα popup blockers.');
      return;
    }

    const interval = setInterval(async () => {
      try {
        if (!popup || popup.closed) {
          clearInterval(interval);
          setIsOauthLoading(false);
          setOauthMessage('Το popup έκλεισε χωρίς να ολοκληρωθεί η σύνδεση.');
          return;
        }
        const url = popup.location.href;
        if (url.startsWith(redirectUri)) {
          const params = new URL(url).searchParams;
          const code = params.get('code');
          const error = params.get('error');
          popup.close();
          clearInterval(interval);
          if (error) {
            setIsOauthLoading(false);
            setOauthMessage('Σφάλμα κατά το login στο Facebook: ' + error);
            return;
          }
          if (code) {
            try {
              const res = await fetch(`/api/v1/facebook/oauth/callback?code=${code}`);
              const data = await res.json();
              if (data.success) {
                setIsOauthLoading(false);
                setOauthMessage('Επιτυχής σύνδεση με Facebook!');
                testConnection();
              } else {
                setIsOauthLoading(false);
                setOauthMessage('Σφάλμα κατά την ανταλλαγή token: ' + (data.error || 'Άγνωστο σφάλμα'));
              }
            } catch (err) {
              setIsOauthLoading(false);
              setOauthMessage('Σφάλμα κατά την ανταλλαγή token.');
            }
          }
        }
      } catch (e) {
        // Ignore cross-origin errors until redirect
      }
    }, 500);
  };

  const openFacebookDeveloperPortal = () => {
    window.open('https://developers.facebook.com/apps/', '_blank');
  };

  const openFacebookAdsManager = () => {
    window.open('https://www.facebook.com/adsmanager/', '_blank');
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Facebook className="h-5 w-5 text-blue-600" />
          Facebook Ads API Connection
        </CardTitle>
        <CardDescription>
          Διαχείριση σύνδεσης με το Facebook Ads API για την ανάλυση καμπανιών
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Authentication Check */}
        {!user && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Πρέπει να είστε συνδεδεμένοι για να συνδεθείτε με το Facebook Ads API.
            </AlertDescription>
          </Alert>
        )}

        {/* Connection Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Κατάσταση Σύνδεσης</Label>
            <Badge variant={connectionStatus.isConnected ? "default" : "secondary"}>
              {connectionStatus.isConnected ? "Συνδεδεμένο" : "Μη Συνδεδεμένο"}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            {connectionStatus.isConnected ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            )}
            <span>{connectionStatus.message}</span>
          </div>
          
          {connectionStatus.campaigns !== undefined && (
            <div className="text-sm text-muted-foreground">
              Βρέθηκαν {connectionStatus.campaigns} καμπάνιες
            </div>
          )}
          
          {connectionStatus.lastTested && (
            <div className="text-xs text-muted-foreground">
              Τελευταίος έλεγχος: {connectionStatus.lastTested}
            </div>
          )}
        </div>

        {/* OAuth Message */}
        {oauthMessage && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{oauthMessage}</AlertDescription>
          </Alert>
        )}

        <Separator />

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={startFacebookOAuth}
            disabled={isOauthLoading || !user}
            variant="default"
            className="flex items-center gap-2"
          >
            <Facebook className="h-4 w-4" />
            {isOauthLoading ? 'Σύνδεση...' : 'Σύνδεση με Facebook'}
          </Button>
          <Button 
            onClick={testConnection} 
            disabled={isTesting || !user}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isTesting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Ελέγχος...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Έλεγχος Σύνδεσης
              </>
            )}
          </Button>
          
          <Button 
            onClick={() => setShowSetup(!showSetup)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Ρυθμίσεις
          </Button>
        </div>

        {/* Setup Instructions */}
        {showSetup && (
          <div className="space-y-4">
            <Separator />
            
            <div className="space-y-4">
              <h4 className="font-medium">Ρυθμίσεις Backend</h4>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Για να λειτουργήσει η σύνδεση με το Facebook Ads API, πρέπει να ρυθμίσετε τις παρακάτω μεταβλητές περιβάλλοντος στο backend:
                </AlertDescription>
              </Alert>

              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-1 gap-2">
                  <Label className="font-medium">FACEBOOK_ACCESS_TOKEN</Label>
                  <div className="text-muted-foreground">
                    Το access token του Facebook App σας με δικαιώματα ads_management
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label className="font-medium">FACEBOOK_AD_ACCOUNT_ID</Label>
                  <div className="text-muted-foreground">
                    Το ID του Ad Account σας (π.χ. act_123456789)
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label className="font-medium">FACEBOOK_APP_ID</Label>
                  <div className="text-muted-foreground">
                    Το App ID του Facebook App σας (για OAuth)
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label className="font-medium">FACEBOOK_APP_SECRET</Label>
                  <div className="text-muted-foreground">
                    Το App Secret του Facebook App σας (για OAuth)
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* External Links */}
            <div className="space-y-3">
              <h4 className="font-medium">Χρήσιμοι Σύνδεσμοι</h4>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={openFacebookDeveloperPortal}
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-3 w-3" />
                  Facebook Developer Portal
                </Button>
                
                <Button 
                  onClick={openFacebookAdsManager}
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-3 w-3" />
                  Facebook Ads Manager
                </Button>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Σημαντικό:</strong> Τα tokens και τα credentials διατηρούνται με ασφάλεια στο backend. 
                Το frontend επικοινωνεί μόνο με το API μας, όχι απευθείας με το Facebook.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 
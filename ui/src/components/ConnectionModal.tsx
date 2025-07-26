// Connection Modal Component
// Modal for managing platform connections and testing

import React, { useState } from 'react';
import { useDataSource } from '@/contexts/DataSourceContext';
import { DataSource, ConnectionConfig } from '@/types/dataSource';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  AlertCircle,
  CheckCircle,
  Loader2,
  Database,
  Facebook,
  Search,
  Zap,
  ShoppingBag,
  Music,
  Trash2,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ConnectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConnectionModal({ open, onOpenChange }: ConnectionModalProps) {
  const { state, addConnection, removeConnection, testConnection, syncConnection, showConnectionModal } = useDataSource();
  
  const [activeTab, setActiveTab] = useState('connections');
  const [testingConnection, setTestingConnection] = useState<string | null>(null);
  const [connectionForm, setConnectionForm] = useState<{
    platform: DataSource;
    displayName: string;
    config: ConnectionConfig;
  }>({
    platform: 'woocommerce',
    displayName: '',
    config: {}
  });

  const platformConfigs = {
    woocommerce: {
      name: 'WooCommerce',
      icon: Database,
      description: 'Connect your WooCommerce store for order and product data',
      fields: [
        { key: 'siteUrl', label: 'Store URL', type: 'url', placeholder: 'https://yourstore.com' },
        { key: 'consumerKey', label: 'Consumer Key', type: 'text', placeholder: 'ck_...' },
        { key: 'consumerSecret', label: 'Consumer Secret', type: 'password', placeholder: 'cs_...' },
        { key: 'version', label: 'API Version', type: 'select', options: ['wc/v3', 'wc/v2'], default: 'wc/v3' }
      ]
    },
    facebook: {
      name: 'Meta Ads',
      icon: Facebook,
      description: 'Connect Facebook and Instagram advertising accounts',
      fields: [
        { key: 'accessToken', label: 'Access Token', type: 'password', placeholder: 'EAAxxxxx...' },
        { key: 'adAccountId', label: 'Ad Account ID', type: 'text', placeholder: 'act_123456789' }
      ]
    },
    google: {
      name: 'Google Ads',
      icon: Search,
      description: 'Connect Google Ads for campaign performance data',
      fields: [
        { key: 'clientId', label: 'Client ID', type: 'text', placeholder: 'xxxxx.googleusercontent.com' },
        { key: 'clientSecret', label: 'Client Secret', type: 'password', placeholder: 'GOCSPX-xxxxx' },
        { key: 'refreshToken', label: 'Refresh Token', type: 'password', placeholder: '1//xxxxx' }
      ]
    },
    shopify: {
      name: 'Shopify',
      icon: ShoppingBag,
      description: 'Connect your Shopify store for comprehensive e-commerce data',
      fields: [
        { key: 'shopDomain', label: 'Shop Domain', type: 'text', placeholder: 'yourstore.myshopify.com' },
        { key: 'accessToken', label: 'Access Token', type: 'password', placeholder: 'shpat_xxxxx' }
      ]
    },
    tiktok: {
      name: 'TikTok Ads',
      icon: Music,
      description: 'Connect TikTok for Business advertising accounts',
      fields: [
        { key: 'accessToken', label: 'Access Token', type: 'password', placeholder: 'xxxxx' },
        { key: 'advertiserIds', label: 'Advertiser IDs', type: 'text', placeholder: '123456789' }
      ]
    }
  };

  const handleConnectionTest = async () => {
    if (!connectionForm.displayName || Object.keys(connectionForm.config).length === 0) {
      return;
    }

    setTestingConnection(connectionForm.platform);
    
    try {
      const isValid = await testConnection({
        id: 'test',
        platform: connectionForm.platform,
        displayName: connectionForm.displayName,
        config: connectionForm.config,
        status: 'connecting',
        createdAt: new Date(),
        updatedAt: new Date(),
        credentials: {}
      });

      if (isValid) {
        // Add connection if test successful
        await addConnection({
          platform: connectionForm.platform,
          displayName: connectionForm.displayName,
          config: connectionForm.config,
          status: 'connected',
          credentials: {}
        });
        
        // Reset form
        setConnectionForm({
          platform: 'woocommerce',
          displayName: '',
          config: {}
        });
      }
    } catch (error) {
      console.error('Connection test failed:', error);
    } finally {
      setTestingConnection(null);
    }
  };

  const handleSyncConnection = async (connectionId: string) => {
    setTestingConnection(connectionId);
    try {
      await syncConnection(connectionId);
    } finally {
      setTestingConnection(null);
    }
  };

  const renderConnectionForm = () => {
    const platformConfig = platformConfigs[connectionForm.platform as keyof typeof platformConfigs];
    const IconComponent = platformConfig.icon;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconComponent className="h-5 w-5" />
            Add {platformConfig.name} Connection
          </CardTitle>
          <CardDescription>
            {platformConfig.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Connection Name</Label>
            <Input
              id="displayName"
              placeholder={`My ${platformConfig.name} Store`}
              value={connectionForm.displayName}
              onChange={(e) => setConnectionForm(prev => ({ ...prev, displayName: e.target.value }))}
            />
          </div>

          {platformConfig.fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              {field.type === 'select' ? (
                <select
                  id={field.key}
                  className="w-full p-2 border rounded-md"
                  value={connectionForm.config[field.key as keyof ConnectionConfig] as string || field.default}
                  onChange={(e) => setConnectionForm(prev => ({
                    ...prev,
                    config: { ...prev.config, [field.key]: e.target.value }
                  }))}
                >
                  {field.options?.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <Input
                  id={field.key}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={connectionForm.config[field.key as keyof ConnectionConfig] as string || ''}
                  onChange={(e) => setConnectionForm(prev => ({
                    ...prev,
                    config: { ...prev.config, [field.key]: e.target.value }
                  }))}
                />
              )}
            </div>
          ))}

          <Button 
            onClick={handleConnectionTest}
            disabled={testingConnection === connectionForm.platform || !connectionForm.displayName}
            className="w-full"
          >
            {testingConnection === connectionForm.platform ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Testing Connection...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Test & Save Connection
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  };

  const renderExistingConnections = () => {
    if (state.connections.length === 0) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Database className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Connections</h3>
            <p className="text-muted-foreground mb-4">
              Add your first platform connection to start using live data
            </p>
            <Button onClick={() => setActiveTab('add-connection')}>
              Add Connection
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {state.connections.map((connection) => {
          const platformConfig = platformConfigs[connection.platform as keyof typeof platformConfigs];
          const IconComponent = platformConfig?.icon || Database;
          
          return (
            <Card key={connection.id}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5" />
                    <div>
                      <CardTitle className="text-base">{connection.displayName}</CardTitle>
                      <CardDescription>
                        {platformConfig?.name} • {connection.status}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        connection.status === 'connected' ? 'default' :
                        connection.status === 'error' ? 'destructive' : 'secondary'
                      }
                    >
                      {connection.status === 'connected' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {connection.status === 'error' && <AlertCircle className="h-3 w-3 mr-1" />}
                      {connection.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {connection.lastSync ? (
                      <>Last sync: {connection.lastSync.toLocaleString()}</>
                    ) : (
                      'Never synced'
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSyncConnection(connection.id)}
                      disabled={testingConnection === connection.id}
                    >
                      {testingConnection === connection.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeConnection(connection.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Data Connections</DialogTitle>
          <DialogDescription>
            Connect your business platforms to get real-time data and insights
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="connections">My Connections</TabsTrigger>
            <TabsTrigger value="add-connection">Add Connection</TabsTrigger>
          </TabsList>

          <TabsContent value="connections" className="mt-6">
            {renderExistingConnections()}
          </TabsContent>

          <TabsContent value="add-connection" className="mt-6">
            <div className="space-y-6">
              {/* Platform Selection */}
              <div className="space-y-3">
                <Label>Select Platform</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(platformConfigs).map(([key, config]) => {
                    const IconComponent = config.icon;
                    return (
                      <Button
                        key={key}
                        variant={connectionForm.platform === key ? "default" : "outline"}
                        className="h-auto p-4 flex flex-col items-center gap-2"
                        onClick={() => setConnectionForm(prev => ({ 
                          ...prev, 
                          platform: key as DataSource,
                          displayName: '',
                          config: {}
                        }))}
                      >
                        <IconComponent className="h-6 w-6" />
                        <span className="text-sm font-medium">{config.name}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Connection Form */}
              {renderConnectionForm()}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
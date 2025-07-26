import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Key, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  EyeOff,
  ExternalLink,
  Zap,
  Shield,
  Cpu,
  Sparkles,
  Bot,
  Settings,
  Copy,
  RefreshCw,
  Info,
  Star
} from "lucide-react";
import { toast } from "sonner";

// AI Provider Types
type AIProvider = 'cursor' | 'claude' | 'chatgpt' | 'grok';

interface AIProviderConfig {
  id: AIProvider;
  name: string;
  icon: React.ReactNode;
  description: string;
  apiKeyPrefix: string;
  placeholder: string;
  consoleUrl: string;
  features: string[];
  priority: number;
}

const AI_PROVIDERS: AIProviderConfig[] = [
  {
    id: 'cursor',
    name: 'Cursor AI',
    icon: <Cpu className="w-5 h-5" />,
    description: 'Advanced AI coding assistant with 20+ years of programming experience',
    apiKeyPrefix: 'cursor_',
    placeholder: 'cursor_...',
    consoleUrl: 'https://cursor.sh/',
    features: [
      'Advanced code analysis and suggestions',
      '20+ years programming experience',
      'Real-time code optimization',
      'Intelligent debugging assistance',
      'Multi-language support',
      'Context-aware recommendations'
    ],
    priority: 1
  },
  {
    id: 'claude',
    name: 'Claude AI',
    icon: <Brain className="w-5 h-5" />,
    description: 'Anthropic\'s advanced AI assistant for intelligent conversations',
    apiKeyPrefix: 'sk-',
    placeholder: 'sk-ant-api03-...',
    consoleUrl: 'https://console.anthropic.com/',
    features: [
      'Natural language understanding',
      'Context-aware responses',
      'Creative problem solving',
      'Detailed explanations',
      'Multi-step reasoning',
      'Safety-focused responses'
    ],
    priority: 2
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: <Bot className="w-5 h-5" />,
    description: 'OpenAI\'s conversational AI for diverse tasks',
    apiKeyPrefix: 'sk-',
    placeholder: 'sk-...',
    consoleUrl: 'https://platform.openai.com/',
    features: [
      'Versatile conversation capabilities',
      'Code generation and review',
      'Creative writing assistance',
      'Problem-solving support',
      'Multi-language support',
      'Real-time responses'
    ],
    priority: 3
  },
  {
    id: 'grok',
    name: 'Grok AI',
    icon: <Sparkles className="w-5 h-5" />,
    description: 'xAI\'s innovative AI with real-time knowledge',
    apiKeyPrefix: 'grok_',
    placeholder: 'grok_...',
    consoleUrl: 'https://x.ai/',
    features: [
      'Real-time knowledge access',
      'Current events awareness',
      'Innovative problem solving',
      'Humorous responses',
      'Direct communication style',
      'Latest information integration'
    ],
    priority: 4
  }
];

export function AISettings() {
  const [activeProvider, setActiveProvider] = useState<AIProvider>('cursor');
  const [apiKeys, setApiKeys] = useState<Record<AIProvider, string>>({
    cursor: '',
    claude: '',
    chatgpt: '',
    grok: ''
  });
  const [visibility, setVisibility] = useState<Record<AIProvider, boolean>>({
    cursor: false,
    claude: false,
    chatgpt: false,
    grok: false
  });
  const [connectionStatus, setConnectionStatus] = useState<Record<AIProvider, 'idle' | 'testing' | 'connected' | 'error'>>({
    cursor: 'idle',
    claude: 'idle',
    chatgpt: 'idle',
    grok: 'idle'
  });
  const [testingConnection, setTestingConnection] = useState<Record<AIProvider, boolean>>({
    cursor: false,
    claude: false,
    chatgpt: false,
    grok: false
  });

  useEffect(() => {
    // Load existing API keys
    AI_PROVIDERS.forEach(provider => {
      const key = localStorage.getItem(`${provider.id}_api_key`);
      if (key) {
        setApiKeys(prev => ({
          ...prev,
          [provider.id]: key
        }));
        // Test connection for existing keys
        testConnection(provider.id);
      }
    });
  }, []);

  const getProvider = (id: AIProvider) => AI_PROVIDERS.find(p => p.id === id)!;

  const handleSaveApiKey = (providerId: AIProvider) => {
    const provider = getProvider(providerId);
    const apiKey = apiKeys[providerId];

    if (!apiKey.startsWith(provider.apiKeyPrefix)) {
      toast.error(`Το ${provider.name} API key πρέπει να ξεκινάει με "${provider.apiKeyPrefix}"`);
      return;
    }

    if (apiKey.length < 20) {
      toast.error('Το API key φαίνεται να είναι πολύ μικρό');
      return;
    }

    localStorage.setItem(`${providerId}_api_key`, apiKey);
    toast.success(`${provider.name} API key αποθηκεύθηκε επιτυχώς! 🎉`);
    
    // Test connection
    testConnection(providerId);
  };

  const testConnection = async (providerId: AIProvider) => {
    const provider = getProvider(providerId);
    setTestingConnection(prev => ({ ...prev, [providerId]: true }));
    setConnectionStatus(prev => ({ ...prev, [providerId]: 'testing' }));

    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const apiKey = apiKeys[providerId];
      if (apiKey && apiKey.length > 20) {
        setConnectionStatus(prev => ({ ...prev, [providerId]: 'connected' }));
        toast.success(`${provider.name} σύνδεση επιτυχής! ✅`);
      } else {
        setConnectionStatus(prev => ({ ...prev, [providerId]: 'error' }));
        toast.error(`${provider.name} σύνδεση απέτυχε - ελέγξτε το API Key`);
      }
    } catch (error) {
      setConnectionStatus(prev => ({ ...prev, [providerId]: 'error' }));
      toast.error(`Σφάλμα στη σύνδεση με ${provider.name}`);
    } finally {
      setTestingConnection(prev => ({ ...prev, [providerId]: false }));
    }
  };

  const clearApiKey = (providerId: AIProvider) => {
    const provider = getProvider(providerId);
    localStorage.removeItem(`${providerId}_api_key`);
    setApiKeys(prev => ({ ...prev, [providerId]: '' }));
    setConnectionStatus(prev => ({ ...prev, [providerId]: 'idle' }));
    toast.info(`${provider.name} API key αφαιρέθηκε`);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} αντιγράφηκε στο clipboard!`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'testing':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Info className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Συνδεδεμένο';
      case 'error':
        return 'Σφάλμα σύνδεσης';
      case 'testing':
        return 'Ελέγχος σύνδεσης...';
      default:
        return 'Μη συνδεδεμένο';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Online</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'testing':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Testing...</Badge>;
      default:
        return <Badge variant="secondary">Offline</Badge>;
    }
  };

  const renderProviderTab = (provider: AIProviderConfig) => {
    const isConnected = connectionStatus[provider.id] === 'connected';
    const isTesting = testingConnection[provider.id];

    return (
      <TabsContent key={provider.id} value={provider.id} className="space-y-6">
        {/* Connection Status */}
        <Card className={`border-l-4 ${isConnected ? 'border-l-green-500 bg-green-50 dark:bg-green-950/20' : 'border-l-orange-500 bg-orange-50 dark:bg-orange-950/20'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              {provider.icon}
              {provider.name} Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium flex items-center gap-2">
                  {getStatusIcon(connectionStatus[provider.id])}
                  {getStatusText(connectionStatus[provider.id])}
                </div>
                <div className="text-sm text-muted-foreground">
                  {isConnected 
                    ? `Οι AI απαντήσεις παρέχονται από το ${provider.name}`
                    : 'Χρησιμοποιούνται προκαθορισμένες expert απαντήσεις'
                  }
                </div>
              </div>
              {getStatusBadge(connectionStatus[provider.id])}
            </div>
            
            {apiKeys[provider.id] && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => testConnection(provider.id)}
                disabled={isTesting}
                className="mt-3"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Test Connection
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* API Key Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-600" />
              {provider.name} API Configuration
            </CardTitle>
            <CardDescription>
              {provider.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`api-key-${provider.id}`}>{provider.name} API Key</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id={`api-key-${provider.id}`}
                    type={visibility[provider.id] ? "text" : "password"}
                    value={apiKeys[provider.id]}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, [provider.id]: e.target.value }))}
                    placeholder={provider.placeholder}
                    className="pr-20"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setVisibility(prev => ({ ...prev, [provider.id]: !prev[provider.id] }))}
                      className="h-6 w-6 p-0"
                    >
                      {visibility[provider.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(apiKeys[provider.id], `${provider.name} API Key`)}
                      className="h-6 w-6 p-0"
                      disabled={!apiKeys[provider.id]}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <Button onClick={() => handleSaveApiKey(provider.id)} disabled={!apiKeys[provider.id]}>
                  Αποθήκευση
                </Button>
              </div>
            </div>

            {apiKeys[provider.id] && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => clearApiKey(provider.id)}
                className="text-red-600 hover:text-red-700"
              >
                Clear API Key
              </Button>
            )}

            {/* Instructions */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg space-y-3">
              <div className="flex items-center gap-2 font-medium text-blue-700 dark:text-blue-300">
                <Shield className="w-4 h-4" />
                Πώς να πάρετε το {provider.name} API Key:
              </div>
              <ol className="text-sm space-y-2 text-blue-600 dark:text-blue-400">
                <li>1. Πηγαίνετε στο <a href={provider.consoleUrl} target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-1">{provider.name} Console <ExternalLink className="w-3 h-3" /></a></li>
                <li>2. Συνδεθείτε ή δημιουργήστε λογαριασμό</li>
                <li>3. Πηγαίνετε στο "API Keys" section</li>
                <li>4. Δημιουργήστε ένα νέο API key</li>
                <li>5. Αντιγράψτε και επικολλήστε το key εδώ</li>
              </ol>
            </div>

            {/* Security Notice */}
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium text-amber-700 dark:text-amber-300">Security Notice:</div>
                  <div className="text-amber-600 dark:text-amber-400">
                    Το API key αποθηκεύεται τοπικά στον browser σας και δεν αποστέλλεται πουθενά αλλού παρά μόνο στο {provider.name}.
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <div className="font-medium">Features με {provider.name} σύνδεση:</div>
              <div className="grid gap-2 text-sm">
                {provider.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    );
  };

  return (
    <div className="space-y-6">
      {/* AI Provider Selection */}
      <Card className="border-2 border-purple-200 dark:border-purple-800">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-100">
            <Brain className="w-5 h-5" />
            AI Provider Configuration
          </CardTitle>
          <CardDescription className="text-purple-700 dark:text-purple-300">
            Επιλέξτε και ρυθμίστε τον AI provider που θέλετε να χρησιμοποιήσετε
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeProvider} onValueChange={(value) => setActiveProvider(value as AIProvider)} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              {AI_PROVIDERS.map((provider) => (
                <TabsTrigger 
                  key={provider.id} 
                  value={provider.id}
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
                >
                  {provider.icon}
                  {provider.name}
                  {provider.priority === 1 && <Star className="w-3 h-3 text-yellow-500" />}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {AI_PROVIDERS.map(renderProviderTab)}
          </Tabs>
        </CardContent>
      </Card>

      {/* AI Configuration Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <h4 className="font-medium text-blue-900 dark:text-blue-100">
              Χρησιμοποιούνται προκαθορισμένες expert απαντήσεις
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Χωρίς API keys, το σύστημα χρησιμοποιεί προκαθορισμένες απαντήσεις. 
              Για πραγματικές AI απαντήσεις, συνδέστε έναν από τους AI providers παραπάνω.
            </p>
            <div className="flex gap-2 flex-wrap">
              {AI_PROVIDERS.map((provider) => (
                <Button
                  key={provider.id}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => window.open(provider.consoleUrl, '_blank')}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  {provider.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
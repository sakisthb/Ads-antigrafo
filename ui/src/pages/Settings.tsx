import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { KeyboardShortcutsHelp } from '@/components/keyboard-shortcuts-help';
import { AISettings } from '@/components/ai-settings';
import { PlatformIntegrations } from '@/components/platform-integrations';
import { DataFetchSettings } from '@/components/data-fetch-settings';
import { DataFetchStatus } from '@/components/data-fetch-status';
import { useSettings } from '@/contexts/SettingsContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { 
  Moon, 
  Sun, 
  Monitor, 
  Bell, 
  Keyboard, 
  Palette,
  Shield,
  Database,
  HelpCircle,
  RefreshCw,
  Sparkles,
  Zap,
  Brain,
  Key,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Copy,
  Download,
  Activity,
  Users,
  Settings as SettingsIcon,
  TestTube,
  Cpu,
  Globe,
  Info,
  AlertTriangle,
  XCircle,
  Eye,
  EyeOff
} from 'lucide-react';

// Clerk Setup Content Component
function ClerkSetupContent() {
  const [isDevMode, setIsDevMode] = useState(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY === 'pk_test_development-fallback-key' || !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
  const [copiedStep, setCopiedStep] = useState<string | null>(null);

  const copyToClipboard = (text: string, stepId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepId);
    toast.success('Αντιγράφηκε στο clipboard!');
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const currentKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_development-fallback-key';

  const steps = [
    {
      id: 'signup',
      title: '1. Δημιούργησε Λογαριασμό',
      description: 'Πήγαινε στο clerk.com και κάνε εγγραφή (δωρεάν για development)',
      action: (
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => window.open('https://clerk.com', '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Άνοιγμα Clerk.com
        </Button>
      )
    },
    {
      id: 'project',
      title: '2. Δημιούργησε Project',
      description: 'Στο Clerk Dashboard, δημιούργησε ένα νέο project για την εφαρμογή σου',
      details: [
        'Επέλεξε "Create Application"',
        'Διάλεξε όνομα για το project (π.χ. "Ads Pro")',
        'Επέλεξε authentication methods (Email, Google, κλπ.)'
      ]
    },
    {
      id: 'keys',
      title: '3. Πάρε τα API Keys',
      description: 'Αντίγραψε το Publishable Key από το Dashboard',
      details: [
        'Πήγαινε στο "API Keys" section',
        'Αντίγραψε το "Publishable Key" (ξεκινάει με pk_test_...)',
        'Αντικατέστησε το στο .env αρχείο παρακάτω'
      ]
    },
    {
      id: 'env',
      title: '4. Ενημέρωσε .env Αρχείο',
      description: 'Αντικατέστησε το development key με το πραγματικό σου',
      code: `# Αντί για:
VITE_CLERK_PUBLISHABLE_KEY=${currentKey}

# Βάλε το δικό σου key:
VITE_CLERK_PUBLISHABLE_KEY=pk_test_το_δικό_σου_key_εδώ`,
      action: (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => copyToClipboard('VITE_CLERK_PUBLISHABLE_KEY=', 'env')}
          className="w-full"
        >
          <Copy className="w-4 h-4 mr-2" />
          {copiedStep === 'env' ? 'Αντιγράφηκε!' : 'Copy Template'}
        </Button>
      )
    },
    {
      id: 'organizations',
      title: '5. Ενεργοποίησε Organizations',
      description: 'Για SaaS multi-tenancy, ενεργοποίησε τα Organizations',
      details: [
        'Πήγαινε στο "Organizations" section',
        'Ενεργοποίησε "Enable Organizations"',
        'Ρύθμισε organization roles (admin, member)'
      ]
    },
    {
      id: 'metadata',
      title: '6. Ρύθμισε User Metadata',
      description: 'Προσθήκη custom metadata για roles και subscription plans',
      code: `// User Public Metadata Schema:
{
  "role": "admin" | "moderator" | "client" | "viewer",
  "subscriptionPlan": "free" | "starter" | "professional" | "enterprise"
}

// Organization Public Metadata Schema:
{
  "subscriptionPlan": "free" | "starter" | "professional" | "enterprise",
  "features": {},
  "settings": {}
}`,
      action: (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => copyToClipboard(`{"role": "admin", "subscriptionPlan": "professional"}`, 'metadata')}
          className="w-full"
        >
          <Copy className="w-4 h-4 mr-2" />
          {copiedStep === 'metadata' ? 'Αντιγράφηκε!' : 'Copy User Metadata'}
        </Button>
      )
    },
    {
      id: 'restart',
      title: '7. Επανεκκίνηση',
      description: 'Μετά τις αλλαγές, κάνε restart την εφαρμογή',
      action: (
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Restart Application
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <div className={`p-4 rounded-xl border-2 ${isDevMode 
        ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800' 
        : 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800'
      }`}>
        <div className="flex items-center gap-3">
          {isDevMode ? (
            <AlertCircle className="w-5 h-5 text-yellow-600" />
          ) : (
            <CheckCircle className="w-5 h-5 text-green-600" />
          )}
          <div>
            <h3 className={`font-semibold ${isDevMode ? 'text-yellow-800 dark:text-yellow-200' : 'text-green-800 dark:text-green-200'}`}>
              {isDevMode ? 'Development Mode Active' : 'Clerk Connected'}
            </h3>
            <p className={`text-sm ${isDevMode ? 'text-yellow-700 dark:text-yellow-300' : 'text-green-700 dark:text-green-300'}`}>
              {isDevMode 
                ? 'Χρησιμοποιείς mock authentication. Ακολούθησε τα βήματα για να συνδεθεις με Clerk.'
                : 'Η εφαρμογή είναι συνδεδεμένη με Clerk authentication.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Setup Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="p-4 border rounded-xl bg-gray-50/50 dark:bg-gray-900/50">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-sm font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    {step.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {step.description}
                  </p>
                  
                  {step.details && (
                    <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-gray-400" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {step.code && (
                    <div className="mt-3">
                      <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto border">
                        <code>{step.code}</code>
                      </pre>
                    </div>
                  )}
                  
                  {step.action && (
                    <div className="mt-3">
                      {step.action}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Resources */}
      <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Επιπλέον Πόροι
        </h4>
        <div className="space-y-2 text-sm">
          <a 
            href="https://clerk.com/docs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            Clerk Documentation
          </a>
          <a 
            href="https://clerk.com/docs/organizations/overview" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            Organizations Setup
          </a>
        </div>
      </div>
    </div>
  );
}

export function Settings() {
  const { settings, updateSetting, resetSettings, exportSettings, importSettings } = useSettings();
  const { t } = useTranslation();
  const [showShortcuts, setShowShortcuts] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const settingsData = JSON.parse(e.target?.result as string);
        importSettings(settingsData);
      } catch (error) {
        toast.error(t('settings.invalidSettingsFile'));
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const settingsSections = [
    {
      title: t('settings.generalSettings'),
      icon: <Database className="w-5 h-5" />,
      color: 'from-blue-500 to-blue-600',
      items: [
        {
          title: t('settings.demoMode'),
          description: t('settings.demoModeDescription'),
          type: 'switch',
          value: settings.demoMode,
          onChange: (value: boolean) => updateSetting('demoMode', value)
        },
        {
          title: t('settings.autoRefresh'),
          description: t('settings.autoRefreshDescription'),
          type: 'switch',
          value: settings.autoRefresh,
          onChange: (value: boolean) => updateSetting('autoRefresh', value)
        }
      ]
    },
    {
      title: t('settings.displaySettings'),
      icon: <Palette className="w-5 h-5" />,
      color: 'from-purple-500 to-purple-600',
      items: [
        {
          title: t('settings.theme'),
          description: t('settings.themeDescription'),
          type: 'theme',
          value: settings.theme,
          onChange: (value: string) => updateSetting('theme', value as 'light' | 'dark' | 'system')
        },
        {
          title: t('settings.language'),
          description: t('settings.languageDescription'),
          type: 'language',
          value: settings.language,
          onChange: (value: string) => updateSetting('language', value as 'el' | 'en')
        }
      ]
    },
    {
      title: t('settings.notificationSettings'),
      icon: <Bell className="w-5 h-5" />,
      color: 'from-green-500 to-green-600',
      items: [
        {
          title: t('settings.notifications'),
          description: t('settings.notificationsDescription'),
          type: 'switch',
          value: settings.notifications,
          onChange: (value: boolean) => updateSetting('notifications', value)
        }
      ]
    },
    {
      title: t('settings.advancedSettings'),
      icon: <Zap className="w-5 h-5" />,
      color: 'from-orange-500 to-orange-600',
      items: [
        {
          title: t('settings.showAdvanced'),
          description: t('settings.showAdvancedDescription'),
          type: 'switch',
          value: settings.showAdvanced,
          onChange: (value: boolean) => updateSetting('showAdvanced', value)
        }
      ]
    },
    {
      title: 'Demo Authentication',
      icon: <Key className="w-5 h-5" />,
      color: 'from-blue-500 to-blue-600',
      isDemoAuth: true,
      items: []
    }
  ];

  const renderSettingItem = (item: any) => {
    switch (item.type) {
      case 'switch':
        return (
          <div className="flex items-center justify-between p-4 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-2xl transition-all duration-300 border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {item.title}
                  </Label>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
              </div>
            </div>
            <Switch
              checked={item.value}
              onCheckedChange={item.onChange}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-500"
            />
          </div>
        );

      case 'theme':
        return (
          <div className="p-4 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-2xl transition-all duration-300 border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50">
            <div className="flex items-center gap-4 mb-3">
              <Label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {item.title}
              </Label>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{item.description}</p>
            <div className="flex gap-3">
              {[
                { value: 'light', icon: Sun, label: t('settings.lightTheme') },
                { value: 'dark', icon: Moon, label: t('settings.darkTheme') },
                { value: 'system', icon: Monitor, label: t('settings.systemTheme') }
              ].map((themeOption) => {
                const Icon = themeOption.icon;
                return (
                  <Button
                    key={themeOption.value}
                    variant={item.value === themeOption.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => item.onChange(themeOption.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      item.value === themeOption.value
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-900/70'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {themeOption.label}
                  </Button>
                );
              })}
            </div>
          </div>
        );

      case 'language':
        return (
          <div className="p-4 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-2xl transition-all duration-300 border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50">
            <div className="flex items-center gap-4 mb-3">
              <Label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {item.title}
              </Label>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{item.description}</p>
            <div className="flex gap-3">
              {[
                { value: 'el', label: t('settings.greek'), flag: '🇬🇷' },
                { value: 'en', label: t('settings.english'), flag: '🇺🇸' }
              ].map((langOption) => (
                <Button
                  key={langOption.value}
                  variant={item.value === langOption.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => item.onChange(langOption.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    item.value === langOption.value
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-900/70'
                  }`}
                >
                  <span className="text-lg">{langOption.flag}</span>
                  {langOption.label}
                </Button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-foreground">{t('settings.breadcrumb')}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-full border border-blue-200/50 dark:border-blue-800/30">
                <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{t('settings.subtitle')}</span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {t('settings.title')}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t('settings.description')}
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={resetSettings}
                variant="outline"
                className="rounded-2xl px-6 py-3 transition-all duration-300 hover:scale-105 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {t('settings.resetSettings')}
              </Button>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="grid gap-8 lg:grid-cols-2">
          {settingsSections.map((section, index) => (
            <Card key={index} className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-500/10">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className={`p-2 bg-gradient-to-br ${section.color} rounded-xl shadow-lg`}>
                    {section.icon}
                  </div>
                  {section.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {t('settings.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.isDemoAuth ? (
                  <div className="space-y-4">
                    <Alert className="border-2 border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                        <div>
                          <AlertTitle className="font-semibold">
                            Demo Authentication Active
                          </AlertTitle>
                          <AlertDescription>
                            This application is using demo authentication with mock users. Perfect for development and testing.
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>
                    
                    <Card className="border-2 border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-lg">
                          <Users className="w-5 h-5 text-blue-600" />
                          Available Demo Users
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          You can log in with any of these demo accounts to test different user roles and permissions:
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Admin:</span>
                            <span className="text-gray-600 dark:text-gray-400">Athanasios Vlachos - Admin (admin@adspro.com / admin123)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Agency:</span>
                            <span className="text-gray-600 dark:text-gray-400">maria@digitalagency.gr / maria123</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Client:</span>
                            <span className="text-gray-600 dark:text-gray-400">nikos@techstartup.com / nikos123</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  section.items.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      {renderSettingItem(item)}
                      {itemIndex < section.items.length - 1 && (
                        <Separator className="my-4 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="border-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 backdrop-blur-xl rounded-3xl shadow-xl shadow-blue-500/10">
          <CardHeader className="text-center pb-6">
            <CardTitle className="flex items-center justify-center gap-3 text-2xl">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              {t('settings.quickActions')}
            </CardTitle>
            <CardDescription className="text-lg">
              {t('settings.quickActionsDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <Button 
                onClick={() => setShowShortcuts(true)}
                className="group p-6 h-auto flex flex-col items-center gap-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl hover:bg-white/70 dark:hover:bg-gray-900/70 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Keyboard className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('settings.keyboardShortcuts')}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t('settings.keyboardShortcutsDescription')}</p>
                </div>
              </Button>
              
              <Button 
                onClick={() => {
                  localStorage.removeItem('onboarding-completed');
                  toast.success(t('settings.onboardingReset'));
                }}
                className="group p-6 h-auto flex flex-col items-center gap-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl hover:bg-white/70 dark:hover:bg-gray-900/70 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <HelpCircle className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('settings.restartTour')}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t('settings.restartTourDescription')}</p>
                </div>
              </Button>
              
              <Button 
                onClick={exportSettings}
                className="group p-6 h-auto flex flex-col items-center gap-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl hover:bg-white/70 dark:hover:bg-gray-900/70 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('settings.exportSettings')}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t('settings.exportSettingsDescription')}</p>
                </div>
              </Button>
              
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="group p-6 h-auto flex flex-col items-center gap-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl hover:bg-white/70 dark:hover:bg-gray-900/70 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('settings.importSettings')}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t('settings.importSettingsDescription')}</p>
                </div>
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportSettings}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings (Conditional) */}
        {settings.showAdvanced && (
          <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-500/10">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                {t('settings.advancedSettings')}
              </CardTitle>
              <CardDescription className="text-base">
                {t('settings.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl border border-yellow-200/50 dark:border-yellow-800/30">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  {t('settings.advancedWarning')}
                </p>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-2xl transition-all duration-300 border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50">
                  <div className="flex items-center gap-4 mb-3">
                    <Label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {t('settings.debugMode')}
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{t('settings.debugModeDescription')}</p>
                  <Switch 
                    checked={settings.debugMode}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-red-500 data-[state=checked]:to-red-600"
                    onCheckedChange={(checked) => updateSetting('debugMode', checked)}
                  />
                </div>
                
                <div className="p-4 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-2xl transition-all duration-300 border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50">
                  <div className="flex items-center gap-4 mb-3">
                    <Label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {t('settings.performanceMode')}
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{t('settings.performanceModeDescription')}</p>
                  <Switch 
                    checked={settings.performanceMode}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-green-600"
                    onCheckedChange={(checked) => updateSetting('performanceMode', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Platform Integrations Section */}
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-0 shadow-2xl shadow-blue-500/10 dark:shadow-blue-500/5">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              <Database className="w-6 h-6 text-blue-600" />
              Platform Integrations
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Συνδέστε τις διαφημιστικές πλατφόρμες και το e-shop σας
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PlatformIntegrations />
          </CardContent>
        </Card>

        {/* Data Fetch Management Section */}
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-0 shadow-2xl shadow-blue-500/10 dark:shadow-blue-500/5">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              <Download className="w-6 h-6 text-blue-600" />
              Smart Data Fetch Manager
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Enterprise-grade rate limiting και intelligent data fetching
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataFetchSettings />
          </CardContent>
        </Card>

        {/* AI Configuration Section */}
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-0 shadow-2xl shadow-purple-500/10 dark:shadow-purple-500/5">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              <Brain className="w-6 h-6 text-purple-600" />
              AI Configuration
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Συνδέστε το Claude AI για έξυπνες, πραγματικές απαντήσεις
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AISettings />
          </CardContent>
        </Card>
      </div>
      {showShortcuts && <KeyboardShortcutsHelp />}
    </div>
  );
} 
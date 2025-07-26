import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import i18n from '@/lib/i18n';

export interface SettingsState {
  demoMode: boolean;
  theme: 'light' | 'dark' | 'system';
  language: 'el' | 'en';
  notifications: boolean;
  autoRefresh: boolean;
  showAdvanced: boolean;
  debugMode: boolean;
  performanceMode: boolean;
}

interface SettingsContextType {
  settings: SettingsState;
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
  resetSettings: () => void;
  exportSettings: () => void;
  importSettings: (settingsData: Partial<SettingsState>) => void;
}

const defaultSettings: SettingsState = {
  demoMode: false,
  theme: 'system',
  language: 'el',
  notifications: true,
  autoRefresh: true,
  showAdvanced: false,
  debugMode: false,
  performanceMode: false,
};

const SETTINGS_STORAGE_KEY = 'volo-settings';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        const loadedSettings = { ...defaultSettings, ...parsedSettings };
        setSettings(loadedSettings);
        
        // Sync language with i18next
        if (loadedSettings.language && loadedSettings.language !== i18n.language) {
          i18n.changeLanguage(loadedSettings.language);
        }
      } else {
        // Initialize language from i18next if no saved settings
        const currentLang = i18n.language;
        if (currentLang && ['el', 'en'].includes(currentLang)) {
          setSettings(prev => ({ ...prev, language: currentLang as 'el' | 'en' }));
        }
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
      toast.error(i18n.t('settings.settingsLoadError'));
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error);
      toast.error(i18n.t('settings.settingsSaveError'));
    }
  }, [settings]);

  // Apply theme changes to document
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      
      if (settings.theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark', prefersDark);
      } else {
        root.classList.toggle('dark', settings.theme === 'dark');
      }
    };

    applyTheme();

    // Listen for system theme changes if using system theme
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [settings.theme]);

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Special handling for demo mode
    if (key === 'demoMode') {
      localStorage.setItem('demoMode', value.toString());
      toast.success(`Demo Mode ${value ? 'ενεργοποιήθηκε' : 'απενεργοποιήθηκε'}`);
    }
    
    // Special handling for language changes
    if (key === 'language') {
      const newLanguage = value as 'el' | 'en';
      i18n.changeLanguage(newLanguage);
      // Note: We use direct strings here because the toast appears before the language change takes effect
      const langName = newLanguage === 'el' ? 'Ελληνικά' : 'English';
      toast.success(`Language changed to ${langName}`);
      return;
    }
    
    // Show appropriate toast messages
    switch (key) {
      case 'theme':
        const themeLabel = value === 'light' ? 'Φωτεινό' : value === 'dark' ? 'Σκοτεινό' : 'Αυτόματο';
        toast.success(`Θέμα άλλαξε σε ${themeLabel}`);
        break;
      case 'notifications':
        toast.success(`Ειδοποιήσεις ${value ? 'ενεργοποιήθηκαν' : 'απενεργοποιήθηκαν'}`);
        break;
      case 'autoRefresh':
        toast.success(`Αυτόματη ενημέρωση ${value ? 'ενεργοποιήθηκε' : 'απενεργοποιήθηκε'}`);
        break;
      case 'debugMode':
        toast.info(`Debug Mode ${value ? 'ενεργοποιήθηκε' : 'απενεργοποιήθηκε'}`);
        break;
      case 'performanceMode':
        toast.info(`Performance Mode ${value ? 'ενεργοποιήθηκε' : 'απενεργοποιήθηκε'}`);
        break;
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
    localStorage.removeItem('demoMode');
    i18n.changeLanguage(defaultSettings.language);
    toast.success(i18n.t('settings.settingsReset'));
  };

  const exportSettings = () => {
    try {
      const blob = new Blob([JSON.stringify(settings, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `volo-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(i18n.t('settings.settingsExported'));
    } catch (error) {
      console.error('Failed to export settings:', error);
      toast.error(i18n.t('settings.settingsSaveError'));
    }
  };

  const validateSettings = (settings: any): Partial<SettingsState> => {
    const validatedSettings: Partial<SettingsState> = {};
    
    // Validate each setting with proper type checking
    if (typeof settings.demoMode === 'boolean') {
      validatedSettings.demoMode = settings.demoMode;
    }
    
    if (['light', 'dark', 'system'].includes(settings.theme)) {
      validatedSettings.theme = settings.theme;
    }
    
    if (['el', 'en'].includes(settings.language)) {
      validatedSettings.language = settings.language;
    }
    
    if (typeof settings.notifications === 'boolean') {
      validatedSettings.notifications = settings.notifications;
    }
    
    if (typeof settings.autoRefresh === 'boolean') {
      validatedSettings.autoRefresh = settings.autoRefresh;
    }
    
    if (typeof settings.showAdvanced === 'boolean') {
      validatedSettings.showAdvanced = settings.showAdvanced;
    }
    
    if (typeof settings.debugMode === 'boolean') {
      validatedSettings.debugMode = settings.debugMode;
    }
    
    if (typeof settings.performanceMode === 'boolean') {
      validatedSettings.performanceMode = settings.performanceMode;
    }
    
    return validatedSettings;
  };

  const importSettings = (settingsData: Partial<SettingsState>) => {
    try {
      if (!settingsData || typeof settingsData !== 'object') {
        throw new Error('Invalid settings data format');
      }
      
      const validatedSettings = validateSettings(settingsData);
      const finalSettings = { ...defaultSettings, ...validatedSettings };
      
      // Additional validation for combinations
      if (finalSettings.performanceMode && finalSettings.debugMode) {
        toast.warning('Performance Mode και Debug Mode δεν συνιστώνται μαζί');
      }
      
      setSettings(finalSettings);
      toast.success(`${i18n.t('settings.settingsImported')} (${Object.keys(validatedSettings).length} options)`);
    } catch (error) {
      console.error('Failed to import settings:', error);
      toast.error(i18n.t('settings.invalidSettingsFile'));
    }
  };

  const value: SettingsContextType = {
    settings,
    updateSetting,
    resetSettings,
    exportSettings,
    importSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
import { useSettings as useSettingsContext } from '@/contexts/SettingsContext';
import { useCallback } from 'react';

export const useSettings = () => {
  const context = useSettingsContext();
  
  const toggleSetting = useCallback((key: keyof typeof context.settings) => {
    const currentValue = context.settings[key];
    if (typeof currentValue === 'boolean') {
      context.updateSetting(key, !currentValue as any);
    }
  }, [context]);

  const isDemoMode = context.settings.demoMode;
  const isDarkMode = context.settings.theme === 'dark' || 
    (context.settings.theme === 'system' && 
     window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  const isGreekLanguage = context.settings.language === 'el';
  const isAdvancedMode = context.settings.showAdvanced;
  const isDebugMode = context.settings.debugMode;
  const isPerformanceMode = context.settings.performanceMode;

  return {
    ...context,
    toggleSetting,
    // Computed values
    isDemoMode,
    isDarkMode,
    isGreekLanguage,
    isAdvancedMode,
    isDebugMode,
    isPerformanceMode,
  };
};

export default useSettings;
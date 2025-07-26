import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface KeyboardShortcutsProps {
  onRefresh?: () => void;
  onExport?: () => void;
  onToggleDemoMode?: () => void;
  onToggleTheme?: () => void;
}

export function useKeyboardShortcuts({
  onRefresh,
  onExport,
  onToggleDemoMode,
  onToggleTheme
}: KeyboardShortcutsProps = {}) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore shortcuts when typing in input fields
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLSelectElement) {
        return;
      }

      // Ctrl/Cmd + Key combinations
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case '1':
            event.preventDefault();
            navigate('/');
            toast.success('Dashboard');
            break;
          case '2':
            event.preventDefault();
            navigate('/campaigns');
            toast.success('Campaigns');
            break;
          case '3':
            event.preventDefault();
            navigate('/analytics');
            toast.success('Analytics');
            break;
          case '4':
            event.preventDefault();
            navigate('/campaign-analysis');
            toast.success('Campaign Analysis');
            break;
          case '5':
            event.preventDefault();
            navigate('/funnel-analysis');
            toast.success('Funnel Analysis');
            break;
          case '6':
            event.preventDefault();
            navigate('/settings');
            toast.success('Settings');
            break;
          case 'r':
            event.preventDefault();
            onRefresh?.();
            toast.success('Refreshing data...');
            break;
          case 'e':
            event.preventDefault();
            onExport?.();
            toast.success('Exporting data...');
            break;
          case 'd':
            event.preventDefault();
            onToggleDemoMode?.();
            break;
          case 't':
            event.preventDefault();
            onToggleTheme?.();
            break;
        }
      }

      // Function keys
      switch (event.key) {
        case 'F1':
          event.preventDefault();
          navigate('/');
          toast.success('Dashboard (F1)');
          break;
        case 'F2':
          event.preventDefault();
          navigate('/campaigns');
          toast.success('Campaigns (F2)');
          break;
        case 'F3':
          event.preventDefault();
          navigate('/analytics');
          toast.success('Analytics (F3)');
          break;
        case 'F5':
          event.preventDefault();
          onRefresh?.();
          toast.success('Refreshing data... (F5)');
          break;
        case 'F9':
          event.preventDefault();
          onToggleDemoMode?.();
          break;
        case 'F10':
          event.preventDefault();
          onToggleTheme?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, onRefresh, onExport, onToggleDemoMode, onToggleTheme]);
} 
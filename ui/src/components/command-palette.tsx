import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Home, Target, BarChart3, PieChart, Activity, Settings, Search, Keyboard, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PAGES = (t: (key: string) => string) => [
  { label: t('navigation.dashboard'), path: '/', icon: <Home className="w-4 h-4" /> },
  { label: t('navigation.campaigns'), path: '/campaigns', icon: <Target className="w-4 h-4" /> },
  { label: t('navigation.analytics'), path: '/analytics', icon: <BarChart3 className="w-4 h-4" /> },
  { label: t('navigation.campaignAnalysis'), path: '/campaign-analysis', icon: <PieChart className="w-4 h-4" /> },
  { label: t('navigation.funnelAnalysis'), path: '/funnel-analysis', icon: <Activity className="w-4 h-4" /> },
  { label: t('navigation.settings'), path: '/settings', icon: <Settings className="w-4 h-4" /> },
];

const ACTIONS = [
  { label: 'Toggle Demo Mode', action: 'toggleDemo', icon: <Play className="w-4 h-4" /> },
  { label: 'Keyboard Shortcuts', action: 'shortcuts', icon: <Keyboard className="w-4 h-4" /> },
];

export function CommandPalette({ onToggleDemoMode, onShowShortcuts }: {
  onToggleDemoMode?: () => void;
  onShowShortcuts?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Keyboard shortcut Ctrl/Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (open) {
        if (e.key === 'Escape') setOpen(false);
        if (e.key === 'ArrowDown') setSelected((s) => Math.min(s + 1, results.length - 1));
        if (e.key === 'ArrowUp') setSelected((s) => Math.max(s - 1, 0));
        if (e.key === 'Enter') {
          const item = results[selected];
          if (item) handleSelect(item);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, selected, query]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelected(0);
      setQuery('');
    }
  }, [open]);

  const results = [
    ...PAGES(t).filter((p) => p.label.toLowerCase().includes(query.toLowerCase())),
    ...ACTIONS.filter((a) => a.label.toLowerCase().includes(query.toLowerCase())),
  ];

  const handleSelect = (item: any) => {
    setOpen(false);
    if (item.path) {
      navigate(item.path);
    } else if (item.action === 'toggleDemo' && onToggleDemoMode) {
      onToggleDemoMode();
    } else if (item.action === 'shortcuts' && onShowShortcuts) {
      onShowShortcuts();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        <div className="flex items-center gap-2 border-b px-4 py-2 bg-muted">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder', 'Search pages or actions...')}
            className="border-0 bg-transparent focus:ring-0 focus-visible:ring-0"
          />
        </div>
        <div className="max-h-72 overflow-y-auto divide-y">
          {results.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">No results</div>
          )}
          {results.map((item, i) => (
            <Button
              key={item.label}
              variant={i === selected ? 'default' : 'ghost'}
              className="w-full justify-start gap-2 rounded-none px-4 py-3 text-left"
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setSelected(i)}
            >
              {item.icon}
              {item.label}
            </Button>
          ))}
        </div>
        <div className="px-4 py-2 text-xs text-muted-foreground bg-muted border-t flex items-center gap-2">
          <kbd className="rounded bg-background px-2 py-1 font-mono text-xs">Ctrl</kbd>
          <span>+</span>
          <kbd className="rounded bg-background px-2 py-1 font-mono text-xs">K</kbd>
          <span>to open</span>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
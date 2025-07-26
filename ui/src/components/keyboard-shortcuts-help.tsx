import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Keyboard, Command } from 'lucide-react';

export function KeyboardShortcutsHelp() {
  const [open, setOpen] = useState(false);

  const shortcuts = [
    {
      category: 'Navigation',
      shortcuts: [
        { key: 'Ctrl/Cmd + 1', description: 'Dashboard' },
        { key: 'Ctrl/Cmd + 2', description: 'Campaigns' },
        { key: 'Ctrl/Cmd + 3', description: 'Analytics' },
        { key: 'Ctrl/Cmd + 4', description: 'Campaign Analysis' },
        { key: 'Ctrl/Cmd + 5', description: 'Funnel Analysis' },
        { key: 'Ctrl/Cmd + 6', description: 'Settings' },
      ]
    },
    {
      category: 'Function Keys',
      shortcuts: [
        { key: 'F1', description: 'Dashboard' },
        { key: 'F2', description: 'Campaigns' },
        { key: 'F3', description: 'Analytics' },
        { key: 'F5', description: 'Refresh Data' },
        { key: 'F9', description: 'Toggle Demo Mode' },
        { key: 'F10', description: 'Toggle Theme' },
      ]
    },
    {
      category: 'Actions',
      shortcuts: [
        { key: 'Ctrl/Cmd + R', description: 'Refresh Data' },
        { key: 'Ctrl/Cmd + E', description: 'Export Data' },
        { key: 'Ctrl/Cmd + D', description: 'Toggle Demo Mode' },
        { key: 'Ctrl/Cmd + T', description: 'Toggle Theme' },
      ]
    }
  ];

  const getKeyIcon = (key: string) => {
    if (key.includes('F1')) return <span className="w-4 h-4 text-center text-xs font-mono">F1</span>;
    if (key.includes('F2')) return <span className="w-4 h-4 text-center text-xs font-mono">F2</span>;
    if (key.includes('F3')) return <span className="w-4 h-4 text-center text-xs font-mono">F3</span>;
    if (key.includes('F5')) return <span className="w-4 h-4 text-center text-xs font-mono">F5</span>;
    if (key.includes('F9')) return <span className="w-4 h-4 text-center text-xs font-mono">F9</span>;
    if (key.includes('F10')) return <span className="w-4 h-4 text-center text-xs font-mono">F10</span>;
    if (key.includes('Ctrl/Cmd')) return <Command className="w-4 h-4" />;
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Keyboard className="w-4 h-4" />
          Keyboard Shortcuts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts for quick navigation and actions throughout the app.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {shortcuts.map((category) => (
            <div key={category.category} className="space-y-3">
              <h3 className="font-semibold text-lg border-b pb-2">
                {category.category}
              </h3>
              <div className="grid gap-3">
                {category.shortcuts.map((shortcut) => (
                  <div key={shortcut.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getKeyIcon(shortcut.key)}
                      <Badge variant="outline" className="font-mono">
                        {shortcut.key}
                      </Badge>
                    </div>
                    <span className="text-muted-foreground">
                      {shortcut.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Tip:</strong> Keyboard shortcuts are disabled when typing in input fields, 
            text areas, or select dropdowns to avoid conflicts.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
import { useState } from 'react';
import { useNotifications } from '@/lib/notifications-context';
import { Button } from '@/components/ui/button';
import { Bell, X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export function NotificationsCenter() {
  const { notifications, markAllRead, clearAll } = useNotifications();
  const [open, setOpen] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error': return <X className="w-4 h-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default: return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" onClick={() => setOpen((o) => !o)}>
        <Bell className="w-5 h-5" />
        {notifications.some((n) => !n.read) && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500" />
        )}
      </Button>
      {open && (
        <div className="absolute right-0 mt-2 w-96 max-w-full bg-background border rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <span className="font-semibold">Notifications</span>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={markAllRead}>Mark all read</Button>
              <Button size="sm" variant="ghost" onClick={clearAll}>Clear all</Button>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto divide-y">
            {notifications.length === 0 && (
              <div className="p-4 text-center text-muted-foreground">No notifications</div>
            )}
            {notifications.map((n) => (
              <div key={n.id} className={`flex items-start gap-3 p-4 ${n.read ? 'opacity-60' : ''}`}>
                <div className="mt-1">{getIcon(n.type)}</div>
                <div className="flex-1">
                  <div className="font-medium">{n.title}</div>
                  {n.description && <div className="text-sm text-muted-foreground">{n.description}</div>}
                  <div className="text-xs text-muted-foreground mt-1">{new Date(n.timestamp).toLocaleString()}</div>
                </div>
                {!n.read && (
                  <Button size="icon" variant="ghost" onClick={() => markAllRead()}>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 
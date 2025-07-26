/**
 * Debug Panel Component - Development logging interface
 * Shows real-time logs, performance metrics, and system status
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bug, 
  Download, 
  Trash2, 
  Activity,
  AlertTriangle,
  Info,
  XCircle
} from 'lucide-react';
import { logger, LogLevel, LogEntry } from '@/lib/logger';

interface DebugPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DebugPanel = ({ isOpen, onClose }: DebugPanelProps) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterComponent, setFilterComponent] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  // Refresh logs every second when auto-refresh is enabled
  useEffect(() => {
    const interval = autoRefresh ? setInterval(() => {
      const recentLogs = logger.getRecentLogs(100);
      setLogs(recentLogs);
    }, 1000) : null;

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  // Filter logs based on criteria
  useEffect(() => {
    let filtered = logs;

    // Filter by level
    if (filterLevel !== 'all') {
      const levelValue = LogLevel[filterLevel as keyof typeof LogLevel];
      filtered = filtered.filter(log => log.level === levelValue);
    }

    // Filter by component
    if (filterComponent !== 'all') {
      filtered = filtered.filter(log => log.context.component === filterComponent);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.context.component && log.context.component.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredLogs(filtered);
  }, [logs, filterLevel, filterComponent, searchTerm]);

  const getUniqueComponents = () => {
    const components = logs
      .map(log => log.context.component)
      .filter(Boolean)
      .filter((component, index, arr) => arr.indexOf(component) === index);
    return components;
  };

  const getLevelIcon = (level: LogLevel) => {
    switch (level) {
      case LogLevel.DEBUG:
        return <Bug className="w-4 h-4 text-gray-500" />;
      case LogLevel.INFO:
        return <Info className="w-4 h-4 text-blue-500" />;
      case LogLevel.WARN:
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case LogLevel.ERROR:
        return <XCircle className="w-4 h-4 text-red-500" />;
      case LogLevel.CRITICAL:
        return <XCircle className="w-4 h-4 text-red-700" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getLevelBadgeColor = (level: LogLevel) => {
    switch (level) {
      case LogLevel.DEBUG:
        return 'secondary';
      case LogLevel.INFO:
        return 'default';
      case LogLevel.WARN:
        return 'destructive';
      case LogLevel.ERROR:
        return 'destructive';
      case LogLevel.CRITICAL:
        return 'destructive';
      default:
        return 'default';
    }
  };

  const exportLogs = () => {
    const logsData = logger.exportLogs();
    const blob = new Blob([logsData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ads-pro-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearLogs = () => {
    // Note: This only clears the display, not the actual logger memory
    setLogs([]);
    setFilteredLogs([]);
  };

  const testLogs = () => {
    logger.debug('Debug test message', { component: 'DebugPanel', action: 'test' });
    logger.info('Info test message', { component: 'DebugPanel', action: 'test' });
    logger.warn('Warning test message', { component: 'DebugPanel', action: 'test' });
    logger.error('Error test message', new Error('Test error'), { component: 'DebugPanel', action: 'test' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <Card className="w-11/12 h-5/6 max-w-6xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Bug className="w-5 h-5" />
            Debug Panel - Ads Pro Platform
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <Activity className={`w-4 h-4 mr-2 ${autoRefresh ? 'text-green-500' : 'text-gray-500'}`} />
              Auto Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={testLogs}>
              Test Logs
            </Button>
            <Button variant="outline" size="sm" onClick={exportLogs}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={clearLogs}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardHeader>

        <CardContent className="h-full overflow-hidden">
          <Tabs defaultValue="logs" className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="logs">Recent Logs</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="logs" className="h-full space-y-4">
              {/* Filters */}
              <div className="flex gap-4 items-center">
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Select value={filterLevel} onValueChange={setFilterLevel}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="DEBUG">Debug</SelectItem>
                    <SelectItem value="INFO">Info</SelectItem>
                    <SelectItem value="WARN">Warn</SelectItem>
                    <SelectItem value="ERROR">Error</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterComponent} onValueChange={setFilterComponent}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Component" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Components</SelectItem>
                    {getUniqueComponents().map((component) => (
                      <SelectItem key={component} value={component!}>
                        {component}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Logs Display */}
              <div className="h-96 overflow-y-auto border rounded p-4 bg-gray-50 dark:bg-gray-900 font-mono text-sm">
                {filteredLogs.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No logs found. Try adjusting your filters or wait for new logs.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredLogs.slice(-50).reverse().map((log, index) => (
                      <div key={index} className="flex items-start gap-2 py-1 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 min-w-max">
                          {getLevelIcon(log.level)}
                          <Badge variant={getLevelBadgeColor(log.level)} className="text-xs">
                            {LogLevel[log.level]}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                          {log.context.component && (
                            <Badge variant="outline" className="text-xs">
                              {log.context.component}
                            </Badge>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm">{log.message}</div>
                          {log.error && (
                            <div className="text-xs text-red-600 mt-1 font-normal">
                              {log.error.message}
                            </div>
                          )}
                          {Object.keys(log.context).length > 0 && (
                            <details className="text-xs text-gray-600 mt-1">
                              <summary className="cursor-pointer">Context</summary>
                              <pre className="mt-1 bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                                {JSON.stringify(log.context, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Memory Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {(performance as any).memory?.usedJSHeapSize 
                        ? `${Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)}MB`
                        : 'N/A'
                      }
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Logs in Memory</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{logs.length}</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Logger Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Minimum Log Level</label>
                    <Select 
                      defaultValue="DEBUG" 
                      onValueChange={(value) => logger.setMinLevel(LogLevel[value as keyof typeof LogLevel])}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DEBUG">Debug</SelectItem>
                        <SelectItem value="INFO">Info</SelectItem>
                        <SelectItem value="WARN">Warn</SelectItem>
                        <SelectItem value="ERROR">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Environment: {import.meta.env.MODE}</p>
                    <p>Production: {import.meta.env.PROD ? 'Yes' : 'No'}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
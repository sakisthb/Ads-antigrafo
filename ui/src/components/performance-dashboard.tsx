import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Activity,
  Zap,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Eye,
  Timer,
  Gauge
} from 'lucide-react';
import { usePerformanceMonitor } from '../lib/performance-monitor';

export function PerformanceDashboard() {
  const { getMetrics, getSummary } = usePerformanceMonitor();
  const [summary, setSummary] = useState<any>(null);
  const [metrics, setMetrics] = useState<any[]>([]);

  const refreshData = () => {
    setSummary(getSummary());
    setMetrics(getMetrics());
  };

  useEffect(() => {
    refreshData();
    
    // Refresh every 5 seconds
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!summary) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Loading performance data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300';
      case 'needs-improvement':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'poor':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'good':
        return <TrendingUp className="w-3 h-3" />;
      case 'needs-improvement':
        return <Minus className="w-3 h-3" />;
      case 'poor':
        return <TrendingDown className="w-3 h-3" />;
      default:
        return <Activity className="w-3 h-3" />;
    }
  };

  const formatValue = (value: number, unit: string = 'ms') => {
    if (value < 1000) {
      return `${Math.round(value)}${unit}`;
    } else {
      return `${(value / 1000).toFixed(2)}s`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Monitor</h2>
          <p className="text-muted-foreground">Real-time application performance metrics</p>
        </div>
        <Button onClick={refreshData} size="sm" variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Metrics</p>
                <p className="text-2xl font-bold">{summary.totalMetrics}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Good Metrics</p>
                <p className="text-2xl font-bold text-green-600">{summary.byRating.good}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Needs Improvement</p>
                <p className="text-2xl font-bold text-yellow-600">{summary.byRating.needsImprovement}</p>
              </div>
              <Minus className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Poor Metrics</p>
                <p className="text-2xl font-bold text-red-600">{summary.byRating.poor}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <Tabs defaultValue="web-vitals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="web-vitals">Core Web Vitals</TabsTrigger>
          <TabsTrigger value="custom">Custom Metrics</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>

        {/* Core Web Vitals */}
        <TabsContent value="web-vitals" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(summary.coreWebVitals).map(([name, data]: [string, any]) => (
              <Card key={name}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{name}</CardTitle>
                    <Badge className={getRatingColor(data.rating)}>
                      {getRatingIcon(data.rating)}
                      <span className="ml-1">{data.rating}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Latest:</span>
                    <span className="font-mono">{formatValue(data.latest)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Average:</span>
                    <span className="font-mono">{formatValue(data.average)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Count:</span>
                    <span>{data.count}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Custom Metrics */}
        <TabsContent value="custom" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(summary.customMetrics).map(([name, data]: [string, any]) => (
              <Card key={name}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{name.replace(/_/g, ' ')}</CardTitle>
                    <Badge className={getRatingColor(data.rating)}>
                      {getRatingIcon(data.rating)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Latest:</span>
                    <span className="font-mono text-sm">{formatValue(data.latest)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Average:</span>
                    <span className="font-mono text-sm">{formatValue(data.average)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Recent Activity */}
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Metrics</CardTitle>
              <CardDescription>Last 10 performance measurements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {metrics.slice(-10).reverse().map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-3">
                      <Badge className={getRatingColor(metric.rating)}>
                        {getRatingIcon(metric.rating)}
                      </Badge>
                      <span className="font-medium">{metric.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-mono">{formatValue(metric.value)}</span>
                      <span>•</span>
                      <span>{new Date(metric.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
                {metrics.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No metrics recorded yet. Performance data will appear here as you use the application.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
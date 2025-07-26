import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  Trash2, 
  Eye, 
  Save, 
  Download, 
  Copy,
  BarChart3,
  LineChart,
  PieChart,
  Settings,
  Filter,
  Calendar,
  Users,
  DollarSign,
  Target,
  TrendingUp,
  MousePointer,
  Globe,
  Smartphone,
  Clock
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

// Report Builder Types
interface ReportWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'text';
  title: string;
  description?: string;
  config: {
    metric?: string;
    chartType?: 'bar' | 'line' | 'pie' | 'donut';
    dataSource?: string;
    filters?: ReportFilter[];
    dateRange?: string;
    groupBy?: string;
    aggregation?: 'sum' | 'avg' | 'count' | 'max' | 'min';
  };
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface ReportFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
  value: string | number | [number, number];
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'performance' | 'attribution' | 'demographics' | 'custom';
  widgets: ReportWidget[];
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
    enabled: boolean;
  };
}

// Available Metrics
const availableMetrics = [
  { id: 'impressions', name: 'Εμφανίσεις', icon: Eye, category: 'engagement' },
  { id: 'clicks', name: 'Κλικ', icon: MousePointer, category: 'engagement' },
  { id: 'conversions', name: 'Μετατροπές', icon: Target, category: 'conversion' },
  { id: 'revenue', name: 'Έσοδα', icon: DollarSign, category: 'revenue' },
  { id: 'spend', name: 'Δαπάνες', icon: DollarSign, category: 'cost' },
  { id: 'roas', name: 'ROAS', icon: TrendingUp, category: 'efficiency' },
  { id: 'ctr', name: 'CTR', icon: MousePointer, category: 'efficiency' },
  { id: 'cpc', name: 'CPC', icon: DollarSign, category: 'cost' },
  { id: 'cpa', name: 'CPA', icon: DollarSign, category: 'cost' },
  { id: 'cpm', name: 'CPM', icon: DollarSign, category: 'cost' }
];

// Data Sources
const dataSources = [
  { id: 'facebook', name: 'Facebook Ads', icon: Globe },
  { id: 'google', name: 'Google Ads', icon: Globe },
  { id: 'instagram', name: 'Instagram Ads', icon: Globe },
  { id: 'tiktok', name: 'TikTok Ads', icon: Globe },
  { id: 'all', name: 'Όλες οι Πλατφόρμες', icon: Globe }
];

// Predefined Templates
const reportTemplates: ReportTemplate[] = [
  {
    id: 'performance-overview',
    name: 'Performance Overview',
    description: 'Γενική επισκόπηση απόδοσης όλων των καμπανιών',
    category: 'performance',
    widgets: []
  },
  {
    id: 'platform-comparison',
    name: 'Platform Comparison',
    description: 'Σύγκριση απόδοσης μεταξύ πλατφορμών',
    category: 'performance',
    widgets: []
  },
  {
    id: 'attribution-analysis',
    name: 'Attribution Analysis',
    description: 'Multi-touch attribution και customer journey',
    category: 'attribution',
    widgets: []
  },
  {
    id: 'demographic-insights',
    name: 'Demographic Insights',
    description: 'Ανάλυση δημογραφικών στοιχείων και συμπεριφοράς',
    category: 'demographics',
    widgets: []
  }
];

export function ReportBuilder() {
  const { t } = useTranslation();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [widgets, setWidgets] = useState<ReportWidget[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  const addWidget = (type: ReportWidget['type']) => {
    const newWidget: ReportWidget = {
      id: `widget-${Date.now()}`,
      type,
      title: type === 'metric' ? 'Νέα Μετρική' : 
             type === 'chart' ? 'Νέο Γράφημα' :
             type === 'table' ? 'Νέος Πίνακας' : 'Νέο Κείμενο',
      config: {
        metric: type === 'metric' ? 'revenue' : undefined,
        chartType: type === 'chart' ? 'bar' : undefined,
        dataSource: 'all',
        dateRange: 'last-30-days',
        aggregation: 'sum'
      },
      position: {
        x: 0,
        y: widgets.length * 200,
        width: 400,
        height: 200
      }
    };

    setWidgets([...widgets, newWidget]);
    toast.success(`${newWidget.title} προστέθηκε στο report`);
  };

  const removeWidget = (widgetId: string) => {
    setWidgets(widgets.filter(w => w.id !== widgetId));
    toast.success('Widget αφαιρέθηκε');
  };

  const updateWidget = (widgetId: string, updates: Partial<ReportWidget>) => {
    setWidgets(widgets.map(w => 
      w.id === widgetId ? { ...w, ...updates } : w
    ));
  };

  const duplicateWidget = (widgetId: string) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (widget) {
      const duplicated: ReportWidget = {
        ...widget,
        id: `widget-${Date.now()}`,
        title: `${widget.title} (Copy)`,
        position: {
          ...widget.position,
          y: widget.position.y + 220
        }
      };
      setWidgets([...widgets, duplicated]);
      toast.success('Widget αντιγράφηκε');
    }
  };

  const saveReport = () => {
    if (!reportName.trim()) {
      toast.error('Παρακαλώ εισάγετε όνομα για το report');
      return;
    }

    // Mock save functionality
    const reportData = {
      name: reportName,
      description: reportDescription,
      widgets,
      createdAt: new Date().toISOString()
    };

    console.log('Saving report:', reportData);
    toast.success(`Report "${reportName}" αποθηκεύτηκε επιτυχώς!`);
    setIsSaveDialogOpen(false);
  };

  const exportReport = () => {
    toast.info('Export functionality σύντομα διαθέσιμο!');
  };

  const getMetricIcon = (metricId: string) => {
    const metric = availableMetrics.find(m => m.id === metricId);
    return metric?.icon || BarChart3;
  };

  const getMetricName = (metricId: string) => {
    const metric = availableMetrics.find(m => m.id === metricId);
    return metric?.name || metricId;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Custom Report Builder</h2>
          <p className="text-muted-foreground">
            Δημιουργήστε προσαρμοσμένα reports με drag & drop interface
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsPreviewOpen(true)}
            disabled={widgets.length === 0}
          >
            <Eye className="w-4 h-4 mr-2" />
            Προεπισκόπηση
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsSaveDialogOpen(true)}
            disabled={widgets.length === 0}
          >
            <Save className="w-4 h-4 mr-2" />
            Αποθήκευση
          </Button>
          <Button 
            variant="outline" 
            onClick={exportReport}
            disabled={widgets.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Εξαγωγή
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar - Widget Library */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Widget Library</CardTitle>
              <CardDescription>
                Σύρετε widgets για να δημιουργήσετε το report σας
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => addWidget('metric')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Μετρική
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => addWidget('chart')}
              >
                <LineChart className="w-4 h-4 mr-2" />
                Γράφημα
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => addWidget('table')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Πίνακας
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => addWidget('text')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Κείμενο
              </Button>
            </CardContent>
          </Card>

          {/* Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Templates</CardTitle>
              <CardDescription>
                Προκατασκευασμένα templates για γρήγορη εκκίνηση
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {reportTemplates.map((template) => (
                <Button
                  key={template.id}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    setReportName(template.name);
                    setReportDescription(template.description);
                    toast.info(`Template "${template.name}" φορτώθηκε`);
                  }}
                >
                  <div>
                    <div className="font-medium">{template.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {template.description}
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Canvas */}
        <div className="lg:col-span-3 space-y-4">
          {/* Report Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Report Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="report-name">Όνομα Report</Label>
                  <Input
                    id="report-name"
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                    placeholder="π.χ. Weekly Performance Report"
                  />
                </div>
                <div>
                  <Label htmlFor="report-description">Περιγραφή</Label>
                  <Input
                    id="report-description"
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Σύντομη περιγραφή του report"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Widgets Canvas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Report Canvas</CardTitle>
              <CardDescription>
                {widgets.length === 0 
                  ? 'Προσθέστε widgets από την αριστερή στήλη για να ξεκινήσετε'
                  : `${widgets.length} widget${widgets.length !== 1 ? 's' : ''} προστέθηκαν`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {widgets.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Κανένα widget δεν έχει προστεθεί ακόμα</p>
                  <p className="text-sm">Κάντε κλικ στα widgets αριστερά για να ξεκινήσετε</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {widgets.map((widget) => (
                    <div key={widget.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {widget.type === 'metric' && <BarChart3 className="w-4 h-4" />}
                          {widget.type === 'chart' && <LineChart className="w-4 h-4" />}
                          {widget.type === 'table' && <Settings className="w-4 h-4" />}
                          {widget.type === 'text' && <Settings className="w-4 h-4" />}
                          <Input
                            value={widget.title}
                            onChange={(e) => updateWidget(widget.id, { title: e.target.value })}
                            className="font-medium border-none p-0 h-auto"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => duplicateWidget(widget.id)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeWidget(widget.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Widget Configuration */}
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {widget.type === 'metric' && (
                          <div>
                            <Label>Μετρική</Label>
                            <Select
                              value={widget.config.metric}
                              onValueChange={(value) => 
                                updateWidget(widget.id, { 
                                  config: { ...widget.config, metric: value }
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {availableMetrics.map((metric) => (
                                  <SelectItem key={metric.id} value={metric.id}>
                                    {metric.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {widget.type === 'chart' && (
                          <div>
                            <Label>Τύπος Γραφήματος</Label>
                            <Select
                              value={widget.config.chartType}
                              onValueChange={(value) => 
                                updateWidget(widget.id, { 
                                  config: { ...widget.config, chartType: value as any }
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="bar">Bar Chart</SelectItem>
                                <SelectItem value="line">Line Chart</SelectItem>
                                <SelectItem value="pie">Pie Chart</SelectItem>
                                <SelectItem value="donut">Donut Chart</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        <div>
                          <Label>Πηγή Δεδομένων</Label>
                          <Select
                            value={widget.config.dataSource}
                            onValueChange={(value) => 
                              updateWidget(widget.id, { 
                                config: { ...widget.config, dataSource: value }
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {dataSources.map((source) => (
                                <SelectItem key={source.id} value={source.id}>
                                  {source.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Εύρος Ημερομηνιών</Label>
                          <Select
                            value={widget.config.dateRange}
                            onValueChange={(value) => 
                              updateWidget(widget.id, { 
                                config: { ...widget.config, dateRange: value }
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="last-7-days">Τελευταίες 7 ημέρες</SelectItem>
                              <SelectItem value="last-30-days">Τελευταίες 30 ημέρες</SelectItem>
                              <SelectItem value="last-90-days">Τελευταίες 90 ημέρες</SelectItem>
                              <SelectItem value="custom">Προσαρμοσμένο</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Widget Preview */}
                      <div className="mt-4 p-4 bg-muted/50 rounded border-2 border-dashed">
                        <div className="flex items-center justify-center h-24 text-muted-foreground">
                          {widget.type === 'metric' && (
                            <div className="text-center">
                              <div className="text-2xl font-bold">€12,450</div>
                              <div className="text-sm">{getMetricName(widget.config.metric || '')}</div>
                            </div>
                          )}
                          {widget.type === 'chart' && (
                            <div className="text-center">
                              <BarChart3 className="w-8 h-8 mx-auto mb-2" />
                              <div className="text-sm">{widget.config.chartType} preview</div>
                            </div>
                          )}
                          {widget.type === 'table' && (
                            <div className="text-center">
                              <Settings className="w-8 h-8 mx-auto mb-2" />
                              <div className="text-sm">Table preview</div>
                            </div>
                          )}
                          {widget.type === 'text' && (
                            <div className="text-center">
                              <div className="text-sm">Text widget preview</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save Dialog */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Αποθήκευση Report</DialogTitle>
            <DialogDescription>
              Αποθηκεύστε το custom report σας για μελλοντική χρήση
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="save-name">Όνομα Report</Label>
              <Input
                id="save-name"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="Εισάγετε όνομα report"
              />
            </div>
            <div>
              <Label htmlFor="save-description">Περιγραφή</Label>
              <Textarea
                id="save-description"
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Προαιρετική περιγραφή"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>
              Ακύρωση
            </Button>
            <Button onClick={saveReport}>
              Αποθήκευση
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Report Preview</DialogTitle>
            <DialogDescription>
              Προεπισκόπηση του report όπως θα φαίνεται στους clients
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="text-center py-8 text-muted-foreground">
              <Eye className="w-12 h-12 mx-auto mb-4" />
              <p>Report preview functionality σύντομα διαθέσιμη!</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Κλείσιμο
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
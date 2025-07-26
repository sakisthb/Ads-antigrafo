import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  FileText, 
  Calendar, 
  Settings, 
  TrendingUp, 
  Users, 
  Clock,
  BarChart3,
  PieChart,
  Download,
  Send,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ReportBuilder } from "@/components/report-builder";
import { AutomatedReporting } from "@/components/automated-reporting";
import { toast } from "sonner";

// Types for Report Gallery
interface SavedReport {
  id: string;
  name: string;
  description: string;
  category: 'performance' | 'attribution' | 'demographics' | 'custom';
  widgets: number;
  lastModified: string;
  createdBy: string;
  isShared: boolean;
  usageCount: number;
}

const mockSavedReports: SavedReport[] = [
  {
    id: 'rep-1',
    name: 'Weekly Performance Dashboard',
    description: 'Εβδομαδιαία επισκόπηση απόδοσης όλων των καμπανιών',
    category: 'performance',
    widgets: 8,
    lastModified: '2024-01-15',
    createdBy: 'Marketing Team',
    isShared: true,
    usageCount: 45
  },
  {
    id: 'rep-2',
    name: 'Attribution Analysis Report',
    description: 'Multi-touch attribution και customer journey mapping',
    category: 'attribution',
    widgets: 12,
    lastModified: '2024-01-14',
    createdBy: 'Analytics Team',
    isShared: true,
    usageCount: 28
  },
  {
    id: 'rep-3',
    name: 'Demographic Insights',
    description: 'Ανάλυση δημογραφικών δεδομένων και συμπεριφοράς κοινού',
    category: 'demographics',
    widgets: 6,
    lastModified: '2024-01-13',
    createdBy: 'Strategy Team',
    isShared: false,
    usageCount: 12
  },
  {
    id: 'rep-4',
    name: 'Cross-Platform Performance',
    description: 'Σύγκριση απόδοσης μεταξύ Facebook, Google, Instagram',
    category: 'performance',
    widgets: 10,
    lastModified: '2024-01-12',
    createdBy: 'Campaign Manager',
    isShared: true,
    usageCount: 33
  }
];

export function ReportingHub() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('gallery');
  const [savedReports, setSavedReports] = useState<SavedReport[]>(mockSavedReports);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'performance': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'attribution': return 'bg-green-50 text-green-700 border-green-200';
      case 'demographics': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'custom': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return <TrendingUp className="w-4 h-4" />;
      case 'attribution': return <BarChart3 className="w-4 h-4" />;
      case 'demographics': return <Users className="w-4 h-4" />;
      case 'custom': return <Settings className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const deleteReport = (reportId: string) => {
    const report = savedReports.find(r => r.id === reportId);
    setSavedReports(savedReports.filter(r => r.id !== reportId));
    toast.success(`Report "${report?.name}" διαγράφηκε`);
  };

  const duplicateReport = (reportId: string) => {
    const report = savedReports.find(r => r.id === reportId);
    if (report) {
      const duplicated: SavedReport = {
        ...report,
        id: `rep-${Date.now()}`,
        name: `${report.name} (Copy)`,
        lastModified: new Date().toISOString().split('T')[0],
        usageCount: 0
      };
      setSavedReports([...savedReports, duplicated]);
      toast.success(`Report "${report.name}" αντιγράφηκε`);
    }
  };

  const openReport = (reportId: string) => {
    const report = savedReports.find(r => r.id === reportId);
    toast.info(`Άνοιγμα report "${report?.name}"`);
    // Here you would navigate to the report builder with the saved report data
  };

  const shareReport = (reportId: string) => {
    const report = savedReports.find(r => r.id === reportId);
    setSavedReports(savedReports.map(r => 
      r.id === reportId ? { ...r, isShared: !r.isShared } : r
    ));
    toast.success(`Report "${report?.name}" ${!report?.isShared ? 'διαμοιράστηκε' : 'έγινε ιδιωτικό'}`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <Breadcrumbs />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Reporting Hub</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Δημιουργία, διαχείριση και προγραμματισμός προχωρημένων reports
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button onClick={() => setActiveTab('builder')}>
            <Plus className="w-4 h-4 mr-2" />
            Νέο Report
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="gallery">Report Gallery</TabsTrigger>
          <TabsTrigger value="builder">Report Builder</TabsTrigger>
          <TabsTrigger value="automated">Automated Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Report Gallery */}
        <TabsContent value="gallery" className="space-y-6">
          {/* Statistics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Αποθηκευμένα Reports</CardTitle>
                <FileText className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{savedReports.length}</div>
                <p className="text-xs text-muted-foreground">
                  +2 αυτόν τον μήνα
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Συνολικές Χρήσεις</CardTitle>
                <Eye className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {savedReports.reduce((sum, r) => sum + r.usageCount, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +23% από τον προηγούμενο μήνα
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Διαμοιρασμένα Reports</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {savedReports.filter(r => r.isShared).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {((savedReports.filter(r => r.isShared).length / savedReports.length) * 100).toFixed(0)}% των reports
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Μέσα Widgets</CardTitle>
                <PieChart className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(savedReports.reduce((sum, r) => sum + r.widgets, 0) / savedReports.length).toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">
                  ανά report
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Reports Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Αποθηκευμένα Reports</CardTitle>
              <CardDescription>
                Διαχείριση και επεξεργασία των custom reports σας
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {savedReports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{report.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {report.description}
                        </p>
                      </div>
                      <Badge className={getCategoryColor(report.category)}>
                        {getCategoryIcon(report.category)}
                        <span className="ml-1 capitalize">{report.category}</span>
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Widgets</div>
                        <div className="font-medium">{report.widgets}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Χρήσεις</div>
                        <div className="font-medium">{report.usageCount}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Δημιουργός</div>
                        <div className="font-medium">{report.createdBy}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Τροποποίηση</div>
                        <div className="font-medium">
                          {new Date(report.lastModified).toLocaleDateString('el-GR')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-1">
                        {report.isShared && (
                          <Badge variant="outline" className="text-xs">
                            <Users className="w-3 h-3 mr-1" />
                            Διαμοιρασμένο
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openReport(report.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveTab('builder')}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => duplicateReport(report.id)}
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteReport(report.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Report Builder */}
        <TabsContent value="builder">
          <ReportBuilder />
        </TabsContent>

        {/* Automated Reporting */}
        <TabsContent value="automated">
          <AutomatedReporting />
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Reporting Analytics
              </CardTitle>
              <CardDescription>
                Ανάλυση χρήσης και απόδοσης των reports σας
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Usage Trends */}
                <div>
                  <h3 className="font-semibold mb-3">Τάσεις Χρήσης Reports</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 border rounded-lg">
                      <div className="text-sm text-muted-foreground">Σήμερα</div>
                      <div className="text-2xl font-bold">47</div>
                      <div className="text-sm text-green-600">+12% vs χθες</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-sm text-muted-foreground">Αυτή την εβδομάδα</div>
                      <div className="text-2xl font-bold">284</div>
                      <div className="text-sm text-green-600">+8% vs προηγούμενη</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-sm text-muted-foreground">Αυτόν τον μήνα</div>
                      <div className="text-2xl font-bold">1,247</div>
                      <div className="text-sm text-green-600">+23% vs προηγούμενο</div>
                    </div>
                  </div>
                </div>

                {/* Popular Reports */}
                <div>
                  <h3 className="font-semibold mb-3">Δημοφιλέστερα Reports</h3>
                  <div className="space-y-2">
                    {savedReports
                      .sort((a, b) => b.usageCount - a.usageCount)
                      .slice(0, 3)
                      .map((report, index) => (
                        <div key={report.id} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">#{index + 1}</Badge>
                            <div>
                              <div className="font-medium">{report.name}</div>
                              <div className="text-sm text-muted-foreground">{report.category}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{report.usageCount} χρήσεις</div>
                            <div className="text-sm text-muted-foreground">
                              {report.widgets} widgets
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div>
                  <h3 className="font-semibold mb-3">Μετρικές Απόδοσης</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-muted-foreground">Μέσος Χρόνος Δημιουργίας</div>
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold">12.5 λεπτά</div>
                      <div className="text-sm text-green-600">-2.3 λεπτά vs προηγούμενο μήνα</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-muted-foreground">Ποσοστό Διαμοιρασμού</div>
                        <Users className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold">75%</div>
                      <div className="text-sm text-green-600">+5% vs προηγούμενο μήνα</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Clock, 
  Mail, 
  Calendar, 
  Users, 
  Settings, 
  Play, 
  Pause, 
  Trash2, 
  Edit, 
  Plus,
  Send,
  FileText,
  Download,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Eye
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

// Types
interface ScheduledReport {
  id: string;
  name: string;
  description: string;
  template: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  time: string; // HH:MM format
  recipients: string[];
  isActive: boolean;
  format: 'pdf' | 'excel' | 'csv';
  includeCharts: boolean;
  lastSent?: string;
  nextSend: string;
  status: 'active' | 'paused' | 'error';
  sentCount: number;
}

interface ReportRecipient {
  email: string;
  name: string;
  role: 'client' | 'team' | 'manager';
}

const mockScheduledReports: ScheduledReport[] = [
  {
    id: '1',
    name: 'Weekly Performance Summary',
    description: 'Εβδομαδιαία σύνοψη απόδοσης όλων των καμπανιών',
    template: 'performance-overview',
    frequency: 'weekly',
    dayOfWeek: 1, // Monday
    time: '09:00',
    recipients: ['client@example.com', 'manager@agency.com'],
    isActive: true,
    format: 'pdf',
    includeCharts: true,
    lastSent: '2024-01-15T09:00:00Z',
    nextSend: '2024-01-22T09:00:00Z',
    status: 'active',
    sentCount: 24
  },
  {
    id: '2',
    name: 'Monthly ROI Report',
    description: 'Μηνιαία ανάλυση ROI και attribution',
    template: 'attribution-analysis',
    frequency: 'monthly',
    dayOfMonth: 1,
    time: '10:00',
    recipients: ['ceo@client.com', 'analytics@agency.com'],
    isActive: true,
    format: 'excel',
    includeCharts: true,
    lastSent: '2024-01-01T10:00:00Z',
    nextSend: '2024-02-01T10:00:00Z',
    status: 'active',
    sentCount: 12
  },
  {
    id: '3',
    name: 'Daily Quick Stats',
    description: 'Καθημερινά βασικά στατιστικά',
    template: 'quick-stats',
    frequency: 'daily',
    time: '08:00',
    recipients: ['team@agency.com'],
    isActive: false,
    format: 'csv',
    includeCharts: false,
    lastSent: '2024-01-15T08:00:00Z',
    nextSend: '2024-01-16T08:00:00Z',
    status: 'paused',
    sentCount: 45
  }
];

const reportTemplates = [
  { id: 'performance-overview', name: 'Performance Overview' },
  { id: 'attribution-analysis', name: 'Attribution Analysis' },
  { id: 'demographic-insights', name: 'Demographic Insights' },
  { id: 'platform-comparison', name: 'Platform Comparison' },
  { id: 'quick-stats', name: 'Quick Stats' }
];

export function AutomatedReporting() {
  const { t } = useTranslation();
  const [reports, setReports] = useState<ScheduledReport[]>(mockScheduledReports);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ScheduledReport | null>(null);
  const [newReport, setNewReport] = useState<Partial<ScheduledReport>>({
    name: '',
    description: '',
    template: '',
    frequency: 'weekly',
    dayOfWeek: 1,
    time: '09:00',
    recipients: [],
    isActive: true,
    format: 'pdf',
    includeCharts: true
  });

  const [recipientEmail, setRecipientEmail] = useState('');

  const toggleReportStatus = (reportId: string) => {
    setReports(reports.map(report => 
      report.id === reportId 
        ? { 
            ...report, 
            isActive: !report.isActive,
            status: !report.isActive ? 'active' : 'paused'
          }
        : report
    ));
    
    const report = reports.find(r => r.id === reportId);
    toast.success(
      `Report "${report?.name}" ${!report?.isActive ? 'ενεργοποιήθηκε' : 'παυώθηκε'}`
    );
  };

  const deleteReport = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    setReports(reports.filter(r => r.id !== reportId));
    toast.success(`Report "${report?.name}" διαγράφηκε`);
  };

  const addRecipient = () => {
    if (recipientEmail && newReport.recipients) {
      setNewReport({
        ...newReport,
        recipients: [...newReport.recipients, recipientEmail]
      });
      setRecipientEmail('');
    }
  };

  const removeRecipient = (email: string) => {
    if (newReport.recipients) {
      setNewReport({
        ...newReport,
        recipients: newReport.recipients.filter(r => r !== email)
      });
    }
  };

  const createReport = () => {
    if (!newReport.name || !newReport.template || !newReport.recipients?.length) {
      toast.error('Παρακαλώ συμπληρώστε τα απαιτούμενα πεδία');
      return;
    }

    const report: ScheduledReport = {
      ...newReport,
      id: `report-${Date.now()}`,
      nextSend: calculateNextSend(newReport.frequency!, newReport.dayOfWeek, newReport.dayOfMonth, newReport.time!),
      status: 'active',
      sentCount: 0
    } as ScheduledReport;

    setReports([...reports, report]);
    setNewReport({
      name: '',
      description: '',
      template: '',
      frequency: 'weekly',
      dayOfWeek: 1,
      time: '09:00',
      recipients: [],
      isActive: true,
      format: 'pdf',
      includeCharts: true
    });
    setIsCreateDialogOpen(false);
    toast.success(`Report "${report.name}" δημιουργήθηκε επιτυχώς!`);
  };

  const calculateNextSend = (frequency: string, dayOfWeek?: number, dayOfMonth?: number, time?: string): string => {
    const now = new Date();
    const [hours, minutes] = (time || '09:00').split(':').map(Number);
    
    if (frequency === 'daily') {
      const nextSend = new Date(now);
      nextSend.setDate(now.getDate() + 1);
      nextSend.setHours(hours, minutes, 0, 0);
      return nextSend.toISOString();
    } else if (frequency === 'weekly' && dayOfWeek !== undefined) {
      const nextSend = new Date(now);
      const daysUntilNext = (dayOfWeek - now.getDay() + 7) % 7 || 7;
      nextSend.setDate(now.getDate() + daysUntilNext);
      nextSend.setHours(hours, minutes, 0, 0);
      return nextSend.toISOString();
    } else if (frequency === 'monthly' && dayOfMonth !== undefined) {
      const nextSend = new Date(now);
      nextSend.setMonth(now.getMonth() + 1);
      nextSend.setDate(dayOfMonth);
      nextSend.setHours(hours, minutes, 0, 0);
      return nextSend.toISOString();
    }
    
    return new Date().toISOString();
  };

  const getFrequencyText = (report: ScheduledReport): string => {
    if (report.frequency === 'daily') {
      return `Καθημερινά στις ${report.time}`;
    } else if (report.frequency === 'weekly') {
      const days = ['Κυριακή', 'Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο'];
      return `Κάθε ${days[report.dayOfWeek!]} στις ${report.time}`;
    } else if (report.frequency === 'monthly') {
      return `Κάθε μήνα στις ${report.dayOfMonth} στις ${report.time}`;
    }
    return '';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'paused': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const sendTestReport = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    toast.success(`Test report στάλθηκε για "${report?.name}"`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Automated Reporting</h2>
          <p className="text-muted-foreground">
            Προγραμματισμένα reports που στέλνονται αυτόματα
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Νέο Automated Report
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ενεργά Reports</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter(r => r.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              από {reports.length} συνολικά
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports Σήμερα</CardTitle>
            <Send className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              προγραμματισμένα για αποστολή
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Συνολικά Στάλθηκαν</CardTitle>
            <Mail className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.reduce((sum, r) => sum + r.sentCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              τον τελευταίο μήνα
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Επιτυχία Αποστολής</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% από τον προηγούμενο μήνα
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Προγραμματισμένα Reports</CardTitle>
          <CardDescription>
            Διαχείριση και παρακολούθηση των automated reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <div>
                      <h3 className="font-semibold">{report.name}</h3>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(report.status)}>
                      {getStatusIcon(report.status)}
                      <span className="ml-1">
                        {report.status === 'active' ? 'Ενεργό' :
                         report.status === 'paused' ? 'Παυσμένο' : 'Σφάλμα'}
                      </span>
                    </Badge>
                    <Switch
                      checked={report.isActive}
                      onCheckedChange={() => toggleReportStatus(report.id)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Συχνότητα</div>
                    <div className="font-medium">{getFrequencyText(report)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Επόμενη Αποστολή</div>
                    <div className="font-medium">
                      {new Date(report.nextSend).toLocaleDateString('el-GR')}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Παραλήπτες</div>
                    <div className="font-medium">{report.recipients.length} άτομα</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Μορφή</div>
                    <div className="font-medium uppercase">{report.format}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Στάλθηκε {report.sentCount} φορές • Τελευταία: {
                      report.lastSent ? new Date(report.lastSent).toLocaleDateString('el-GR') : 'Ποτέ'
                    }
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendTestReport(report.id)}
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Test
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedReport(report);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
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

      {/* Create Report Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Δημιουργία Automated Report</DialogTitle>
            <DialogDescription>
              Δημιουργήστε ένα νέο προγραμματισμένο report
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="report-name">Όνομα Report *</Label>
                <Input
                  id="report-name"
                  value={newReport.name}
                  onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                  placeholder="π.χ. Weekly Performance Report"
                />
              </div>
              <div>
                <Label htmlFor="template">Template *</Label>
                <Select
                  value={newReport.template}
                  onValueChange={(value) => setNewReport({ ...newReport, template: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Επιλέξτε template" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Περιγραφή</Label>
              <Textarea
                id="description"
                value={newReport.description}
                onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                placeholder="Σύντομη περιγραφή του report"
                rows={2}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label>Συχνότητα</Label>
                <Select
                  value={newReport.frequency}
                  onValueChange={(value) => setNewReport({ ...newReport, frequency: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Καθημερινά</SelectItem>
                    <SelectItem value="weekly">Εβδομαδιαία</SelectItem>
                    <SelectItem value="monthly">Μηνιαία</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newReport.frequency === 'weekly' && (
                <div>
                  <Label>Ημέρα Εβδομάδας</Label>
                  <Select
                    value={newReport.dayOfWeek?.toString()}
                    onValueChange={(value) => setNewReport({ ...newReport, dayOfWeek: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Δευτέρα</SelectItem>
                      <SelectItem value="2">Τρίτη</SelectItem>
                      <SelectItem value="3">Τετάρτη</SelectItem>
                      <SelectItem value="4">Πέμπτη</SelectItem>
                      <SelectItem value="5">Παρασκευή</SelectItem>
                      <SelectItem value="6">Σάββατο</SelectItem>
                      <SelectItem value="0">Κυριακή</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {newReport.frequency === 'monthly' && (
                <div>
                  <Label>Ημέρα Μήνα</Label>
                  <Select
                    value={newReport.dayOfMonth?.toString()}
                    onValueChange={(value) => setNewReport({ ...newReport, dayOfMonth: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label>Ώρα</Label>
                <Input
                  type="time"
                  value={newReport.time}
                  onChange={(e) => setNewReport({ ...newReport, time: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Μορφή Αρχείου</Label>
                <Select
                  value={newReport.format}
                  onValueChange={(value) => setNewReport({ ...newReport, format: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="include-charts"
                  checked={newReport.includeCharts}
                  onCheckedChange={(checked) => setNewReport({ ...newReport, includeCharts: checked })}
                />
                <Label htmlFor="include-charts">Συμπερίληψη γραφημάτων</Label>
              </div>
            </div>

            <div>
              <Label>Παραλήπτες *</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="email@example.com"
                    type="email"
                  />
                  <Button type="button" onClick={addRecipient} disabled={!recipientEmail}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {newReport.recipients && newReport.recipients.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {newReport.recipients.map((email, index) => (
                      <Badge key={index} variant="outline" className="pr-0">
                        {email}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-1 ml-1"
                          onClick={() => removeRecipient(email)}
                        >
                          ×
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Ακύρωση
            </Button>
            <Button onClick={createReport}>
              Δημιουργία Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
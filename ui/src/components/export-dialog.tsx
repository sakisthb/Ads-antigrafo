import { useState, ReactNode } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon, Download, FileText, FileJson, FileSpreadsheet } from 'lucide-react';
import { format as formatDate } from 'date-fns';
import { el } from 'date-fns/locale';
import { cn } from '../lib/utils';
import { exportService, ExportOptions } from '../lib/export-service';
import { toast } from 'sonner';
import { Campaign, AnalyticsData, FunnelData } from '../types/data-types';

// Extended campaign type for Meta Ads API
interface CampaignInsights {
  impressions: number;
  clicks: number;
  spend: number;
  reach: number;
  frequency: number;
  cpp: number;
  cpm: number;
  actions?: Array<{ action_type: string; value: string }>;
}

interface CampaignWithInsights extends Campaign {
  insights?: CampaignInsights;
  daily_budget?: number;
  lifetime_budget?: number;
  bid_strategy?: string;
  optimization_goal?: string;
}

interface ExportDialogProps {
  dataType: 'campaigns' | 'analytics' | 'funnel';
  data: Campaign[] | CampaignWithInsights[] | AnalyticsData[] | FunnelData[];
  trigger?: ReactNode;
  className?: string;
}

const formatOptions = [
  { value: 'csv', label: 'CSV', icon: FileSpreadsheet },
  { value: 'json', label: 'JSON', icon: FileJson },
  { value: 'pdf', label: 'PDF', icon: FileText },
];

export function ExportDialog({ dataType, data, trigger, className }: ExportDialogProps) {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<'csv' | 'json' | 'pdf'>('csv');
  const [includeCharts, setIncludeCharts] = useState(false);
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!data || data.length === 0) {
      toast.error('Δεν υπάρχουν δεδομένα για εξαγωγή');
      return;
    }

    setIsExporting(true);
    try {
      const options: ExportOptions = {
        format,
        includeCharts,
        dateRange: dateRange.start && dateRange.end ? {
          start: dateRange.start.toISOString(),
          end: dateRange.end.toISOString(),
        } : undefined,
      };

      let blob: Blob;
      const dateRangeStr = dateRange.start && dateRange.end 
        ? `${formatDate(dateRange.start, 'yyyy-MM-dd')}_${formatDate(dateRange.end, 'yyyy-MM-dd')}`
        : undefined;

      switch (dataType) {
        case 'campaigns':
          blob = await exportService.exportCampaigns(data as Campaign[] | CampaignWithInsights[], options);
          break;
        case 'analytics':
          blob = await exportService.exportAnalytics(data as AnalyticsData[], options);
          break;
        case 'funnel':
          blob = await exportService.exportFunnel(data as FunnelData[], options);
          break;
        default:
          throw new Error(`Unknown data type: ${dataType}`);
      }

      const filename = exportService.generateFilename(dataType, format, dateRangeStr);
      exportService.downloadFile(blob, filename);

      toast.success(`Επιτυχής εξαγωγή ${dataType} σε ${format.toUpperCase()}`);
      setOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Σφάλμα κατά την εξαγωγή');
    } finally {
      setIsExporting(false);
    }
  };

  const getDataTypeLabel = () => {
    switch (dataType) {
      case 'campaigns': return 'Καμπάνιες';
      case 'analytics': return 'Αναλυτικά';
      case 'funnel': return 'Ανάλυση Μετατροπών';
      default: return dataType;
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className={className}>
      <Download className="w-4 h-4 mr-2" />
      Εξαγωγή
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Εξαγωγή {getDataTypeLabel()}</DialogTitle>
          <DialogDescription>
            Επιλέξτε τη μορφή και τις επιλογές για την εξαγωγή των δεδομένων σας.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Format Selection */}
          <div className="space-y-2">
            <Label>Μορφή Αρχείου</Label>
            <Select value={format} onValueChange={(value: 'csv' | 'json' | 'pdf') => setFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {formatOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Εύρος Ημερομηνιών (προαιρετικό)</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange.start && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.start ? formatDate(dateRange.start, "PPP", { locale: el }) : "Από ημερομηνία"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.start}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, start: date }))}
                    initialFocus
                    locale={el}
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange.end && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.end ? formatDate(dateRange.end, "PPP", { locale: el }) : "Έως ημερομηνία"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.end}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, end: date }))}
                    initialFocus
                    locale={el}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Include Charts (for PDF) */}
          {format === 'pdf' && (
            <div className="flex items-center space-x-2">
              <Switch
                id="include-charts"
                checked={includeCharts}
                onCheckedChange={setIncludeCharts}
              />
              <Label htmlFor="include-charts">Συμπερίληψη γραφημάτων</Label>
            </div>
          )}

          {/* Data Summary */}
          <div className="bg-muted p-3 rounded-lg">
            <div className="text-sm text-muted-foreground">
              <div>Σύνολο εγγραφών: <span className="font-medium text-foreground">{data.length}</span></div>
              {dateRange.start && dateRange.end && (
                <div>Εύρος: <span className="font-medium text-foreground">
                  {formatDate(dateRange.start, "dd/MM/yyyy")} - {formatDate(dateRange.end, "dd/MM/yyyy")}
                </span></div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Ακύρωση
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={isExporting || data.length === 0}
            className="min-w-[100px]"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Εξαγωγή...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Εξαγωγή
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 
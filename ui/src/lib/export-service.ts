import { Campaign, AnalyticsData, FunnelData } from '../types/data-types';

// Extended campaign type for Meta Ads API
interface CampaignWithInsights extends Campaign {
  insights?: any;
  daily_budget?: number;
  [key: string]: any;
}

export interface ExportOptions {
  format: 'csv' | 'json' | 'pdf';
  includeCharts?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  filters?: Record<string, any>;
}

export interface ExportData {
  campaigns?: (Campaign | CampaignWithInsights)[];
  analytics?: AnalyticsData[];
  funnel?: FunnelData[];
  metadata: {
    exportDate: string;
    dateRange?: string;
    totalRecords: number;
    filters?: Record<string, any>;
  };
}

class ExportService {
  /**
   * Export campaigns data
   */
  async exportCampaigns(campaigns: (Campaign | CampaignWithInsights)[], options: ExportOptions): Promise<Blob> {
    const exportData: ExportData = {
      campaigns,
      metadata: {
        exportDate: new Date().toISOString(),
        totalRecords: campaigns.length,
        filters: options.filters,
      },
    };

    switch (options.format) {
      case 'csv':
        return this.toCSV(exportData);
      case 'json':
        return this.toJSON(exportData);
      case 'pdf':
        return this.toPDF(exportData);
      default:
        throw new Error(`Unsupported format: ${options.format}`);
    }
  }

  /**
   * Export analytics data
   */
  async exportAnalytics(analytics: AnalyticsData[], options: ExportOptions): Promise<Blob> {
    const exportData: ExportData = {
      analytics,
      metadata: {
        exportDate: new Date().toISOString(),
        dateRange: options.dateRange ? `${options.dateRange.start} - ${options.dateRange.end}` : undefined,
        totalRecords: analytics.length,
        filters: options.filters,
      },
    };

    switch (options.format) {
      case 'csv':
        return this.toCSV(exportData);
      case 'json':
        return this.toJSON(exportData);
      case 'pdf':
        return this.toPDF(exportData);
      default:
        throw new Error(`Unsupported format: ${options.format}`);
    }
  }

  /**
   * Export funnel data
   */
  async exportFunnel(funnel: FunnelData[], options: ExportOptions): Promise<Blob> {
    const exportData: ExportData = {
      funnel,
      metadata: {
        exportDate: new Date().toISOString(),
        dateRange: options.dateRange ? `${options.dateRange.start} - ${options.dateRange.end}` : undefined,
        totalRecords: funnel.length,
        filters: options.filters,
      },
    };

    switch (options.format) {
      case 'csv':
        return this.toCSV(exportData);
      case 'json':
        return this.toJSON(exportData);
      case 'pdf':
        return this.toPDF(exportData);
      default:
        throw new Error(`Unsupported format: ${options.format}`);
    }
  }

  /**
   * Convert data to CSV format
   */
  private toCSV(data: ExportData): Blob {
    let csvContent = '';
    
    // Add metadata
    csvContent += 'Metadata\n';
    csvContent += `Export Date,${data.metadata.exportDate}\n`;
    if (data.metadata.dateRange) {
      csvContent += `Date Range,${data.metadata.dateRange}\n`;
    }
    csvContent += `Total Records,${data.metadata.totalRecords}\n`;
    csvContent += '\n';

    // Add campaigns data
    if (data.campaigns && data.campaigns.length > 0) {
      csvContent += 'Campaigns\n';
      const headers = Object.keys(data.campaigns[0]).join(',');
      csvContent += headers + '\n';
      
      data.campaigns.forEach(campaign => {
        const values = Object.values(campaign).map(value => 
          typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(',');
        csvContent += values + '\n';
      });
      csvContent += '\n';
    }

    // Add analytics data
    if (data.analytics && data.analytics.length > 0) {
      csvContent += 'Analytics\n';
      const headers = Object.keys(data.analytics[0]).join(',');
      csvContent += headers + '\n';
      
      data.analytics.forEach(analytics => {
        const values = Object.values(analytics).map(value => 
          typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(',');
        csvContent += values + '\n';
      });
      csvContent += '\n';
    }

    // Add funnel data
    if (data.funnel && data.funnel.length > 0) {
      csvContent += 'Funnel Analysis\n';
      const headers = Object.keys(data.funnel[0]).join(',');
      csvContent += headers + '\n';
      
      data.funnel.forEach(funnel => {
        const values = Object.values(funnel).map(value => 
          typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(',');
        csvContent += values + '\n';
      });
    }

    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  }

  /**
   * Convert data to JSON format
   */
  private toJSON(data: ExportData): Blob {
    const jsonContent = JSON.stringify(data, null, 2);
    return new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  }

  /**
   * Convert data to PDF format (simplified implementation)
   */
  private async toPDF(data: ExportData): Promise<Blob> {
    // For now, we'll create a simple text-based PDF-like structure
    // In a real implementation, you'd use a library like jsPDF or pdfmake
    
    let pdfContent = '';
    pdfContent += 'Ads Pro - Platforms Analysis Report\n';
    pdfContent += '=====================================\n\n';
    pdfContent += `Export Date: ${data.metadata.exportDate}\n`;
    if (data.metadata.dateRange) {
      pdfContent += `Date Range: ${data.metadata.dateRange}\n`;
    }
    pdfContent += `Total Records: ${data.metadata.totalRecords}\n\n`;

    if (data.campaigns) {
      pdfContent += 'CAMPAIGNS\n';
      pdfContent += '---------\n';
      data.campaigns.forEach((campaign, index) => {
        pdfContent += `${index + 1}. ${campaign.name}\n`;
        pdfContent += `   Status: ${campaign.status}\n`;
        pdfContent += `   Budget: ${campaign.budget}\n`;
        pdfContent += `   Spend: ${campaign.spend}\n\n`;
      });
    }

    if (data.analytics) {
      pdfContent += 'ANALYTICS\n';
      pdfContent += '---------\n';
      data.analytics.forEach((analytics, index) => {
        pdfContent += `${index + 1}. ${analytics.date}\n`;
        pdfContent += `   Impressions: ${analytics.impressions}\n`;
        pdfContent += `   Clicks: ${analytics.clicks}\n`;
        pdfContent += `   CTR: ${analytics.ctr}%\n\n`;
      });
    }

    if (data.funnel) {
      pdfContent += 'FUNNEL ANALYSIS\n';
      pdfContent += '---------------\n';
      data.funnel.forEach((funnel, index) => {
        pdfContent += `${index + 1}. ${funnel.stage}\n`;
        pdfContent += `   Conversions: ${funnel.conversions}\n`;
        pdfContent += `   Rate: ${funnel.rate}%\n\n`;
      });
    }

    return new Blob([pdfContent], { type: 'text/plain;charset=utf-8;' });
  }

  /**
   * Download file with proper filename
   */
  downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Generate filename based on data type and format
   */
  generateFilename(dataType: string, format: string, dateRange?: string): string {
    const timestamp = new Date().toISOString().split('T')[0];
    const range = dateRange ? `_${dateRange.replace(/\s/g, '')}` : '';
    return `ads_pro_${dataType}${range}_${timestamp}.${format}`;
  }
}

export const exportService = new ExportService(); 